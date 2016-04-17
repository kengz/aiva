# import google translate
from ais.ai_lib.translate import *
# print(translate('hola amigos'))
# print(detect_language('hola amigos'))

# NLP with spaCy https://spacy.io
from spacy.en import English
nlp = English()

# Useful properties, summary of the docs from https://spacy.io

# class Doc
# properties: text, vector, vector_norm, ents, noun_chunks, sents
# method: similarity
# NER specs https://spacy.io/docs#annotation-ner
# doc tokenization will preserve meaningful units together

# class Token
# token.doc -> parent sequence
# string features: text, lemma, lower, shape
# boolean flags: https://spacy.io/docs#token-booleanflags
# POS: pos_, tag_
# tree: https://spacy.io/docs#token-navigating 
# ner: ent_type, ent_iob

# class Span
# span.doc -> parent sequence
# vector, vector_norm
# string features: text, lemma
# methods: similarity
# syntactic parse: use root, lefts, rights, subtree https://spacy.io/docs#span-navigativing-parse


# !more to implement:
# also filter to prepare for tree
# syntactic parse tree https://spacy.io/docs#span-navigativing-parse
# word2vec, numpy array
# similarity https://spacy.io/docs#examples-word-vectors https://spacy.io/docs#span-similarity

# https://github.com/spacy-io/sense2vec/
# tuts https://spacy.io/docs#tutorials
# custom NER and intent arg parsing eg https://github.com/spacy-io/spaCy/issues/217


# Helper methods
##########################################

def merge_ents(doc):
  '''Helper: merge adjacent entities into single tokens; modifies the doc.'''
  for ent in doc.ents:
    ent.merge(ent.root.tag_, ent.text, ent.label_)
  return doc

def _NER_POS_lr_subtree(root):
  '''Helper: generate a NER_POS subtree with left/right for a root token. The doc must have merge_ents(doc) ran on it.'''
  subtree = {
    root.text: {
      "edge": root.dep_,
      "tag": root.ent_type_ or root.pos_,
      "lefts": [],
      "rights": []
    }
  }
  for l in root.lefts:
    subtree[root.text]["lefts"].append(_NER_POS_subtree(l))
  for r in root.rights:
    subtree[root.text]["rights"].append(_NER_POS_subtree(r))
  return subtree

def _NER_POS_subtree(root):
  '''Helper: generate a NER_POS subtree without left/right for a root token. The doc must have merge_ents(doc) ran on it.'''
  subtree = {
    root.text: {
      "edge": root.dep_,
      "tag": root.ent_type_ or root.pos_,
      "children": []
    }
  }
  for c in root.children:
    subtree[root.text]["children"].append(_NER_POS_subtree(c))
  return subtree

def _NER_POS_lr_tree(sent):
  '''Helper: generate the NER_POS tree (with left/right) for a sentence'''
  return _NER_POS_lr_subtree(sent.root)

def _NER_POS_tree(sent):
  '''Helper: generate the NER_POS tree for a sentence'''
  return _NER_POS_subtree(sent.root)


def NER_POS_lr_tree(doc):
  '''generate the NER_POS tree (with left/right) for all sentences in a doc'''
  merge_ents(doc) # merge the entities into single tokens first
  return [_NER_POS_lr_tree(sent) for sent in doc.sents]

def NER_POS_tree(doc):
  '''generate the NER_POS tree for all sentences in a doc'''
  merge_ents(doc) # merge the entities into single tokens first
  return [_NER_POS_tree(sent) for sent in doc.sents]

def NER_POS_tag(doc):
  '''tag the doc first by NER (merged as tokens) then POS. Can be seen as the flat version of NER_POS_tree'''
  merge_ents(doc) # merge the entities into single tokens first
  return [(token.text, token.ent_type_ or token.pos_) for token in doc]

# s = "find me flights from New York to London next month"
# doc = nlp(s)
# NER_POS_tag(doc)
# => [('find', 'VERB'), ('me', 'NOUN'), ('flights', 'NOUN'), ('from', 'ADP'), ('New York', 'GPE'), ('to', 'ADP'), ('London', 'GPE'), ('next month', 'DATE')]
# => [{'find': {'edge': 'ROOT', 'children': [{'flights': {'edge': 'ccomp', 'children': [{'me': {'edge': 'nsubj', 'children': [], 'tag': 'NOUN'}}, {'from': {'edge': 'prep', 'children': [{'New York': {'edge': 'pobj', 'children': [], 'tag': 'GPE'}}], 'tag': 'ADP'}}, {'to': {'edge': 'prep', 'children': [{'London': {'edge': 'pobj', 'children': [], 'tag': 'GPE'}}], 'tag': 'ADP'}}], 'tag': 'NOUN'}}, {'next month': {'edge': 'npadvmod', 'children': [], 'tag': 'DATE'}}], 'tag': 'VERB'}}]



# Primary methods
##########################################

def parse(sentence):
  '''
  Main method: parse an input sentence and return the nlp properties.
  '''
  doc = nlp(sentence)
  reply = {
    "text": doc.text,
    "len": len(doc),

    "tokens": [token.text for token in doc],
    "lemmas": [token.lemma_ for token in doc],
    # "lower": [token.lower_ for token in doc],
    # "shape": [token.shape_ for token in doc],

    "NER": list(zip([token.text for token in doc.ents], [token.label_ for token in doc.ents])),
    "noun_phrases": [token.text for token in doc.noun_chunks],
    "pos_coarse": list(zip([token.text for token in doc], [token.pos_ for token in doc])),
    "pos_fine": list(zip([token.text for token in doc], [token.tag_ for token in doc])),
    "NER_POS_tree": NER_POS_tree(doc),
    "NER_POS_tag": NER_POS_tag(doc)
  }
  return reply

# res = parse("find me flights from New York to London next month.")

def parsedoc(input):
  '''
  parse for multi-sentences; split and apply parse in a list.
  '''
  doc = nlp(input, tag=False, entity=False)
  return [parse(sent.text) for sent in doc.sents]

# res = parsedoc("find me flights from New York to London next month.")


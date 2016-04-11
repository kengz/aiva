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


def parse(sentence):
  """
  Main method: parse an input sentence and return the nlp properties.
  """
  doc = nlp(sentence)
  reply = {
    "text": doc.text,
    "len": len(doc),

    "tokens": [token.text for token in doc],
    "lemmas": [token.lemma_ for token in doc],
    "lower": [token.lower_ for token in doc],
    # "shape": [token.shape_ for token in doc],

    "NER": list(zip([token.text for token in doc.ents], [token.label_ for token in doc.ents])),
    "noun_phrase": [token.text for token in doc.noun_chunks],
    "pos_coarse": list(zip([token.text for token in doc], [token.pos_ for token in doc])),
    "pos_fine": list(zip([token.text for token in doc], [token.tag_ for token in doc])),
  }
  return reply

# res = parse("Mr. Best flew to New York on Saturday morning at 9am.")

def parsedoc(input):
  """
  parse for multi-sentences; split and apply parse in a list.
  """
  doc = nlp(input, tag=False, entity=False)
  return [parse(sent.text) for sent in doc.sents]

# res = parsedoc("Mr. Best flew to New York on Saturday morning at 9am. Also his wife was flying with him too.")


# !more to implement:
# also filter to prepare for tree
# syntactic parse tree https://spacy.io/docs#span-navigativing-parse
# word2vec, numpy array
# similarity https://spacy.io/docs#examples-word-vectors https://spacy.io/docs#span-similarity

# Syntactic dependencies
# s1 = list(doc.sents)[0]
# r = s1.root
# c = r.children
# tree https://spacy.io/docs#span-navigativing-parse
# list(r.rights) get children of next level
# list(r.lefts)
# 
# see displacy it's a combo of multiple parser and grouping
# https://spacy.io/demos/displacy
# https://github.com/spacy-io/spaCy/issues/244
# hmm it's a progressive filter:
# NER -> np -> pos
# 
# https://github.com/spacy-io/sense2vec/
# tuts https://spacy.io/docs#tutorials
# custom NER and intent arg parsing eg https://github.com/spacy-io/spaCy/issues/217


# import google translate
from ai_lib.translate import *

# print(translate('hola amigos'))
# print(detect_language('hola amigos'))
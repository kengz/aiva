# from spacy.en import English
# nlp = English()

# make into sentences
def parse(sentence):
  """
  parse an input sentence with spaCy and return the basic nlp properties.
  """
  doc = nlp(sentence)
  reply = {
    "text": doc.text,
    "len": len(doc),

    "tokens": [token.text for token in doc],
    "lemmas": [token.lemma_ for token in doc],
    "lower": [token.lower_ for token in doc],
    # "shape": [token.shape_ for token in doc],

    "NER": list(zip([span.text for span in doc.ents], [span.label_ for span in doc.ents])),
    "noun_phrase": [span.text for span in doc.noun_chunks],
    "pos_coarse": [token.pos_ for token in doc],
    "pos_fine": [token.tag_ for token in doc]
  }
  return reply

# res = parse("Mr. Best flew to New York on Saturday morning at 9am.")

# "sentences": [sent.text for sent in doc.sents],
# "sents_tokens": [[token.text for token in sent] for sent in doc.sents],

# more shits:
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


# Basic useful extraction

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


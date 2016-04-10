# from spacy.en import English
# nlp = English()

# print("start parsing")
# doc = nlp("Mr. Best flew to New York on Saturday morning at 9pm to Brooklyn University. Here's another sentence...")
# print(doc)
# # print(doc.vector)
# # print(doc.vector_norm)
# # print(doc.ents)
# # print(doc.noun_chunks)

# # doc is already tokenized
# print(list(doc))
# # split sentences
# print(list(doc.sents))
# # NER
# print(list(doc.ents))
# for entity in doc.ents:
#   print(entity.label_)
#   print(entity.orth_)
# # noun_phrase
# print(list(doc.noun_chunks))

# # for token in doc:
# #   print(token)
# #   print(token.lemma)
# #   print(token.lemma_)
# #   print(token.pos_)
# #   print(token.tag_)

# # print(list(doc.token))

# doc = nlp("Apples and oranges are similar. Boots and hippos aren't.")

# apples = doc[0]
# oranges = doc[2]
# boots = doc[6]
# hippos = doc[8]
# print(apples.similarity(oranges))
# print(boots.similarity(hippos))

# # ok basic NLP features to wrap:
# # tokens (sentence, already comes with doc) + sentence
# # NER https://spacy.io/docs#examples-entities
# # noun phrase
# # POS https://spacy.io/docs#examples-pos-tags
# # syntactic dependencies https://spacy.io/docs#examples-dependencies
# # lemma
# # word vector, can do similiarty https://spacy.io/docs#examples-word-vectors
# # export to numpy


# doc = nlp(<your string>)
# doc.text
# doc.vector
# doc.vector_norm
# token texts:
# tok = list(map(lambda t: t.text, doc))
# 
# 
# doc.sents
# splitdocs = list(doc.sents)
# splitdocs[0].vector etc. above, use like doc
# 
# sentences = list(map(lambda s: s.text, doc.sents))
# 
# into list of Spans from generator
# 
# ents = list(doc.ents)
# ents_str = [span.text for span in ents]
# ents_label = [span.label_ for span in ents]
# 
# np = list(doc.noun_chunks)
# np_str = [span.text for span in np]
# np_label = [span.label_ for span in np]
# 
# lemmas = [token.lemma_ for token in doc]
# like_emails = [token.like_email for token in doc]
# 
# pos = [token.pos_ for token in doc]
# tag = [token.tag_ for token in doc]

# Syntactic dependencies
# s1 = list(doc.sents)[0]
# r = s1.root
# c = r.children
# see displacy it's a combo of multiple parser and grouping
# https://spacy.io/demos/displacy
# https://github.com/spacy-io/spaCy/issues/244


# doc = nlp("Apples and oranges are similar. Boots and hippos aren't.")

# apples = doc[0]
# oranges = doc[2]
# boots = doc[6]
# hippos = doc[8]
# print(apples.similarity(oranges))
# print(boots.similarity(hippos))

# token flags https://spacy.io/docs#token-booleanflags


# Attributs of a token
# lemma_
# orth_
# lower_
# shape_
# prefix_
# suffix_
# pos_
# tag_
# 
# Boolean flags
# is_alpha  Equivalent to word.orth_.isalpha()
# is_ascii  Equivalent to any(ord(c) >= 128 for c in word.orth_)]
# is_digit  Equivalent to word.orth_.isdigit()
# is_lower  Equivalent to word.orth_.islower()
# is_title  Equivalent to word.orth_.istitle()
# is_punct  Equivalent to word.orth_.ispunct()
# is_space  Equivalent to word.orth_.isspace()
# like_url  Does the word resemble a URL?
# like_num  Does the word represent a number? e.g. “10.9”, “10”, “ten”, etc.
# like_email  Does the word resemble an email?
# is_oov  Is the word out-of-vocabulary?
# is_stop Is the word part of a "stop list"? Stop lists are used to improve the quality of topic models, by filtering out common, domain-general words.

# Lemmatization
# A "lemma" is the uninflected form of a word. In English, this means:

# Adjectives: The form like "happy", not "happier" or "happiest"
# Adverbs: The form like "badly", not "worse" or "worst"
# Nouns: The form like "dog", not "dogs"; like "child", not "children"
# Verbs: The form like "write", not "writes", "writing", "wrote" or "written"
# The lemmatization data is taken from WordNet. However, we also add a special case for pronouns: all pronouns are lemmatized to the special token -PRON-.



# NER:
# ENTITY TYPE DESCRIPTION
# PERSON  People, including fictional.
# NORP  Nationalities or religious or political groups.
# FACILITY  Buildings, airports, highways, bridges, etc.
# ORG Companies, agencies, institutions, etc.
# GPE Countries, cities, states.
# LOC Non-GPE locations, mountain ranges, bodies of water.
# PRODUCT Vehicles, weapons, foods, etc. (Not services)
# EVENT Named hurricanes, battles, wars, sports events, etc.
# WORK_OF_ART Titles of books, songs, etc.
# LAW Named documents made into laws
# LANGUAGE  Any named language
# The following values are also annotated in a style similar to names:

# ENTITY TYPE DESCRIPTION
# DATE  Absolute or relative dates or periods
# TIME  Times smaller than a day
# PERCENT Percentage (including “%”)
# MONEY Monetary values, including unit
# QUANTITY  Measurements, as of weight or distance
# ORDINAL "first", "second"
# CARDINAL  Numerals that do not fall under another type

# # # https://github.com/spacy-io/sense2vec/
# # tuts https://spacy.io/docs#tutorials
# # custom NER and intent arg parsing eg https://github.com/spacy-io/spaCy/issues/217
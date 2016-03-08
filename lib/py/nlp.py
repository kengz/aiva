# the id of this script for JSON payload 'from'
from os.path import basename
id = basename(__file__)


##########################################
# your code below

from textblob import TextBlob
import time

# Get the TextBlob basic properties in JSON, sent to msg.from via socket
def getTB(msg):
  start = time.time()
  b = TextBlob(msg.get('input'))
  reply = {
    'to': msg.get('from'),
    'from': id,
    'hash': msg.get('hash'),
    'correct': b.correct().raw,
    'lemmatize': list(b.words.lemmatize()),
    'noun_phrases': b.noun_phrases,
    'parse': b.parse(),
    'raw': b.raw,
    'subjectivity': b.subjectivity,
    'tags': [list(pair) for pair in b.tags],
    'time': time.time() - start
  }
  return reply

# !defaults to english for now
# !hacks: in socketIO-client/transports.py change 'six.b' to 'six.u'. Waiting for author to merge
def translate(msg):
  start = time.time()
  b = TextBlob(msg.get('input'))
  output = b.translate().raw
  reply = {
    'to': msg.get('from'),
    'from': id,
    'hash': msg.get('hash'),
    'output': output,
    'time': time.time() - start
  }
  return reply


# NLP features outline:
# available:
# pos tag
# noun_phrases extractor. use Conll too
# sentiment
# translation, language detection
# lemmatization
# Wordnet synsets (use for Canonicalization)
# autocorrect
# parse: pos tag, pnpshit
# classifier
# HOLD BACK ON STANFORD NLP first. Focken license
# stanford's above
# stanford NER
# stanford SUTime
# 
# 
# What u really need (try to avoid stanford's stinky GPL)
# intent parse: by POS tag, take actor-[action]->(subject); by noun_phrases extract
# Canonicalization: by autocorrect, lemmatization, synsets
# ohh can do Wordlist lemmatize too
# parse time
# easy tools like sentiment, translation
# 
# ok lets start with nltk POS tag

# from textblob import TextBlob

# b = TextBlob('Remind me to do laundry.')
# print(b.parse())
# print(b.correct().raw)
# print(b.words.lemmatize())
# print(list(b.words.lemmatize()))
# print(b.noun_phrases)
# print(b.raw)
# print(b.subjectivity)
# print(b.tags)
# print(b.correct())

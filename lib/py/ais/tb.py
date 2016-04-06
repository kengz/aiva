# Basic TextBlob wrapped module
# Textblob docs:
# https://textblob.readthedocs.org/en/dev/quickstart.html
# Note that Textblob has some initialization overhead, but subsequent runs will complete in about 0.05s

from textblob import TextBlob
import time
from nltk.tag import StanfordNERTagger
st = StanfordNERTagger('english.all.3class.distsim.crf.ser.gz')


# Helper methods
##########################################

# join the ner result list into list of entities
def join_by_tags(ners):
  ners.append(('$', 'O'))
  joined = []
  words = []
  prevE = False
  for w, e in ners:
    if e == 'O':
      if e != prevE:
        if len(words) > 0:
          joined.append((' '.join(words), prevE))
        words = []
    else:
      if e == prevE:
        words.append(w)
      else:
        if len(words) > 0:
          joined.append((' '.join(words), prevE))
          words = []
        words.append(w)
    prevE = e
  # termination cond
  ners.pop()
  return joined


# Exported methods
##########################################

# Use Google translate, with auto langauge-detection. 
# May optionally specify language code translating to (default='en')
# Language code refer here https://cloud.google.com/translate/v2/using_rest
def translate(s, to='en'):
  b = TextBlob(s)
  if to == 'en':
    return b.translate().raw 
  else:
    from_lang = b.detect_language()
    return b.translate(from_lang=from_lang, to=to).raw


# Uses StanfordNERTagger to extract tag with NER (Named Entity Recognition)
def NERTag(s):
  res = st.tag(s.split())
  return join_by_tags(res)


# Get the TextBlob basic parsed results in JSON
# Note this method has an initialization overhead,
# after the first call it will only take time = 0.05s
def TextBlobParse(sentence):
  start = time.time()
  b = TextBlob(sentence)
  parsed = {
    'tags': b.tags,
    'noun_phrases': b.noun_phrases,
    'correct': b.correct().raw,
    'lemmatize': list(b.words.lemmatize()),
    'parse': b.parse(),
    'raw': b.raw,
    'subjectivity': b.subjectivity,
    'tags': [list(pair) for pair in b.tags],
    'time': time.time() - start
  }
  return parsed



# print(translate('hola amigos'))
# print(translate('hola amigos', 'zh-CN'))

# print(NERTag('Rami Eid is studying at Stony Brook University in NY'))

# print(TextBlobParse('Rami Eid is studying at Stony Brook University in NY'))

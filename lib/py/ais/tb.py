##########################################
# your code below

from textblob import TextBlob
# import time

from nltk.tag import StanfordNERTagger
st = StanfordNERTagger('english.all.3class.distsim.crf.ser.gz')
res = st.tag('Rami Eid is studying at Stony Brook University in NY'.split())

# res = [('Rami', 'PERSON'), ('Eid', 'PERSON'), ('Stony', 'ORGANIZATION'), ('Brook', 'ORGANIZATION'), ('University', 'ORGANIZATION')]

# join the ner result list into list of entities
def join_by_tags(ners):
  ners.append(('$', 'O'))
  joined = []
  words_to_join = []
  prevE = False
  for w, e in ners:
    if e == 'O':
      if e != prevE:
        if len(words_to_join) > 0:
          joined.append((' '.join(words_to_join), prevE))
        words_to_join = []
    else:
      if e == prevE:
        words_to_join.append(w)
      else:
        if len(words_to_join) > 0:
          joined.append((' '.join(words_to_join), prevE))
          words_to_join = []
        words_to_join.append(w)
    prevE = e
  # termination cond
  ners.pop()
  return joined

print(join_by_tags(res))


# def translate(s):
#   b = TextBlob(s)
#   return b.translate().raw

# print(translate('hola amigos'))

# # Get the TextBlob basic properties in JSON, sent to msg.from via socket
# def getTB(msg):
#   start = time.time()
#   b = TextBlob(msg.get('input'))
#   reply = {
#     'to': msg.get('from'),
#     'from': id,
#     'hash': msg.get('hash'),
#     'correct': b.correct().raw,
#     'lemmatize': list(b.words.lemmatize()),
#     'noun_phrases': b.noun_phrases,
#     'parse': b.parse(),
#     'raw': b.raw,
#     'subjectivity': b.subjectivity,
#     'tags': [list(pair) for pair in b.tags],
#     'time': time.time() - start
#   }
#   return reply

# # !defaults to english for now
# # !hacks: in socketIO-client/transports.py change 'six.b' to 'six.u'. Waiting for author to merge
# def translate(msg):
#   start = time.time()
#   b = TextBlob(msg.get('input'))
#   output = b.translate().raw
#   reply = {
#     'to': msg.get('from'),
#     'from': id,
#     'hash': msg.get('hash'),
#     'output': _translate(msg.get('input')),
#     'time': time.time() - start
#   }
#   return reply

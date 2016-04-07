from os.path import basename
id = basename(__file__) # 'ai.py'
from ais import * # import all for usage

##########################################
# Titanic DNN
import ais.dnn_titanic_deploy as titanic
# load and initialize the trained model
titanic.init()

# get titanic model accuracy
def titanic_accuracy(msg):
  score = titanic.accuracy()
  reply = {
  'output': 'Current DNN model accuracy: ' + str(score),
  'to': msg.get('from'),
  'from': id,
  'hash': msg.get('hash')
  }
  return reply

# predict titanic given X
def titanic_predict(msg):
  X = msg.get('input')
  y = titanic.predict(X)
  reply = {
  'output': 'Prediction: Survived = ' + str(y),
  'to': msg.get('from'),
  'from': id,
  'hash': msg.get('hash')
  }
  return reply

# continue training titanic given X, y
def titanic_train(msg):
  X = msg.get('input')
  y = msg.get('y')
  new_score = titanic.train(X, y)
  reply = {
  'output': 'Post-training new score is ' + str(new_score) + '. Model not saved.',
  'to': msg.get('from'),
  'from': id,
  'hash': msg.get('hash')
  }
  return reply

##########################################

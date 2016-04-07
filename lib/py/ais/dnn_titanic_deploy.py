import numpy as np
from ai_lib import *
from sklearn import cross_validation, metrics
import pandas
import skflow

# reliable absolute path when this module is called elsewhere
model_path = preprocess.abspath('models/dnn_titanic')
classifier = None
mle = None

# load the saved model and label encoder
def init():
  global classifier, mle
  classifier = skflow.TensorFlowEstimator.restore(model_path)
  mle = preprocess.MultiLabelEncoder().restore(model_path)
  print('Model loaded from', model_path)
  return classifier, mle

# Get the accuracy of the current model
# first load the data needed for scoring
def accuracy():
  data_path = preprocess.abspath('data/titanic_test.csv')
  df = pandas.read_csv(data_path)
  X_test, y_test = df[['Sex', 'Age', 'SibSp', 'Fare']], df['Survived']
  X_test = preprocess.deploy_transform(mle, X_test)
  score = metrics.accuracy_score(y_test, classifier.predict(X_test))
  score_native = score.item() # to native format for usage
  return score_native

# Predict X using the loaded model
def predict(X):
  # make X into table
  X = preprocess.deploy_transform(mle, X)
  y = classifier.predict(X)
  y_native = y.tolist() # to native format for usage
  return y_native

# Continue training the loaded model with more data
def train(X, y, save=False):
  classifier.continue_training = True # set to True just in case
  X_train, y_train = preprocess.deploy_transform(mle, X, y)
  classifier.fit(X_train, y_train)
  score = accuracy()
  print('Updated model accuracy:', score)
  if save:
    classifier.save(model_path) # save the model for use
    print('Updated model saved to', model_path)
  else:
    print('Updated model not saved')
  return score

# # Example usage
# # make a prediction
# init()
# x = ['male', 22, 1, 7.25]
# print(predict(x))
# print(accuracy())

# # continue training with more data set to 'improve'
# data_path = preprocess.abspath('data/titanic_test.csv')
# df = pandas.read_csv(data_path)
# X_test, y_test = df[['Sex', 'Age', 'SibSp', 'Fare']], df['Survived']
# X_test = preprocess.deploy_transform(mle, X_test)

# print(X_test[:1], predict(X_test[:1]))
# # current model accuracy, about 0.74
# print(accuracy())
# # cheating: cont-train on test data, accuracy increases to 0.76
# train(X_test, y_test, save=False)


# Socket handlers
##########################################



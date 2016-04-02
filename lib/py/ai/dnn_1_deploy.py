import numpy as np
from ai_lib import *
from sklearn import cross_validation, metrics
import pandas
import skflow

# reliable absolute path when this module is called elsewhere
model_path = preprocess.abspath('models/titanic_dnn')
classifier = None
mle = None


def init():
  global classifier, mle
  # load the saved model and label encoder
  classifier = skflow.TensorFlowEstimator.restore(model_path)
  mle = preprocess.MultiLabelEncoder().restore(model_path)
  print('Model loaded from', model_path)
  return classifier

# Get the accuracy of the current model
def accuracy():
  score = metrics.accuracy_score(y_test, classifier.predict(X_test))
  return score

# Predict X using the loaded model
def predict(X):
  # check dim, make X into table
  npX = np.array(X)
  if npX.ndim == 1:
    X = [X]
  df_X = pandas.DataFrame(X, columns=mle.header)
  df_X = mle.fit_transform(df_X)
  return classifier.predict(df_X)

# Continue training the loaded model with more data
# then save if want to
def train(X, y, save=False):
  # set to True just in case
  classifier.continue_training = True
  npX = preprocess.np_to_ndim(X, 2)
  npy = preprocess.np_to_ndim(y, 1)
  classifier.fit(npX, npy)
  print('Updated model accuracy:', accuracy())
  if save:
    # save the model for use
    classifier.save(model_path)
    print('Updated model saved to', model_path)
  else:
    print('Updated model not saved')
  return classifier


# # Example usage
# # make a prediction
# init()
# x = ['male', 22, 1, 7.25]
# print(x, predict(x))

# # continue training with more data set to 'improve'
# data_path = preprocess.abspath('data/titanic.csv')
# df = pandas.read_csv(data_path)
# X, y = df[['Sex', 'Age', 'SibSp', 'Fare']], df['Survived']
# # chain: fillna for str with 'NA', num with 0, transform
# X = preprocess.MultiFillna(X)
# X = mle.fit_transform(X)
# # random-split into train (80%), test data (20%)
# X_train, X_test, y_train, y_test = cross_validation.train_test_split(X, y, test_size=0.2, random_state=42)

# print(X_test[:1], predict(X_test[:1]))
# # current model accuracy, about 0.74
# print(accuracy())
# # cheating: train more on test data, accuracy should increase, about 0.76
# train(X_test, y_test, save=False)
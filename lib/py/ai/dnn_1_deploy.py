import numpy as np
from ai_lib import *
from sklearn import cross_validation, metrics
import pandas
import skflow

# reliable absolute path when this module is called elsewhere
model_path = preprocess.abspath('models/titanic_dnn')
print('model_path', model_path)

# load the saved model and label encoder
classifier = skflow.TensorFlowEstimator.restore(model_path)
mle = preprocess.MultiLabelEncoder().restore(model_path)
print('Model loaded from', model_path, mle)

# export methods for usage:

# Get the accuracy of the current model
def accuracy():
  score = metrics.accuracy_score(y_test, classifier.predict(X_test))
  return score

# Predict X using the loaded model
def predict(X):
  # ensure ndim=2
  npX = preprocess.np_to_ndim(X, 2)
  return classifier.predict(npX)

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



# Save and load labelencoder
# http://stackoverflow.com/questions/28656736/using-scikits-labelencoder-correctly-across-multiple-programs
# Example usage
# load the dataset to test prediction
data_path = preprocess.abspath('data/titanic.csv')
df = pandas.read_csv(data_path)
X, y = df[['Sex', 'Age', 'SibSp', 'Fare']], df['Survived']
# chain: fillna for str with 'NA', num with 0
X = preprocess.MultiFillna(X)
X = mle.fit_transform(X)
# random-split into train (80%), test data (20%)
X_train, X_test, y_train, y_test = cross_validation.train_test_split(X, y, test_size=0.2, random_state=42)

# make a prediction
# x = ['male', 22, 1, 7.25]
# print(x, predict(x))
print(X_test[:1], predict(X_test[:1]))
# current model accuracy, about 0.74
print(accuracy())
# cheating: train more on test data, accuracy should increase, about 0.76
# train(X_test, y_test, save=False)
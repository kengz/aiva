import numpy as np
from ai_lib import preprocess
from sklearn import cross_validation, metrics
import pandas
import skflow

# reliable absolute path when this module is called elsewhere
data_path = preprocess.abspath('data/titanic.csv')
model_path = preprocess.abspath('models/titanic_dnn')

# load the dataset
df = pandas.read_csv(data_path)
X, y = df[['Sex', 'Age', 'SibSp', 'Fare']], df['Survived']
# chain: fillna for 'Sex' with 'NA', the rest with 0
X = X.fillna({'Sex': 'NA'}).fillna(0)
# Label Encoder to encode string entries into integers
le_X = preprocess.MultiColumnLabelEncoder(columns = ['Sex'])
X = le_X.fit_transform(X)

# random-split into train (80%), test data (20%)
X_train, X_test, y_train, y_test = cross_validation.train_test_split(X, y, test_size=0.2, random_state=42)

# model
classifier = skflow.TensorFlowEstimator.restore(model_path)
print('Model loaded from', model_path)

# Methods exports for usage

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

# print(X_test[:1], predict(X_test[:1]))
# print(accuracy())
# train(X_test, y_test)
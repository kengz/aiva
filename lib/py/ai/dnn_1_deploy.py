from sklearn import datasets, metrics, cross_validation
import skflow
import os.path

# reliable absolute path when this module is called elsewhere
data_path = os.path.join(os.path.dirname(__file__), 'data/titanic.csv')
model_path = os.path.join(os.path.dirname(__file__), 'models/iris_dnn')

import numpy as np

# load the dataset
# train = np.genfromtxt()
iris = datasets.load_iris()
X_train, X_test, y_train, y_test = cross_validation.train_test_split(iris.data, iris.target,
    test_size=0.2, random_state=42)

# iris model
classifier = skflow.TensorFlowEstimator.restore(model_path)
print('Model loaded from models/iris_dnn')


# Methods exports for usage

# Get the accuracy of the current model
def accuracy():
  score = metrics.accuracy_score(y_test, classifier.predict(X_test))
  return score

# Predict X using the loaded model
def predict(X):
  npX = np.array(X)
  # increase depth if not already dim=2
  npX = (np.expand_dims(npX, axis=0) if npX.ndim == 1 else npX)
  return classifier.predict(npX)

# !TODO: waiting for resolution by skflow team https://github.com/tensorflow/skflow/issues/153
def train(X, y):
  # do online training and model update
  return 'Feature to be implemented, waiting for skflow team'


# print(predict([[ 5.1,3.5,1.4,0.2]]))
# print(predict([ 5.1,3.5,1.4,0.2]))
# accuracy()
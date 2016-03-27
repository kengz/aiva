from sklearn import datasets, metrics, cross_validation
import skflow
import os.path

# reliable absolute path when this module is called elsewhere
data_path = os.path.join(os.path.dirname(__file__), 'data/titanic.csv')
model_path = os.path.join(os.path.dirname(__file__), 'models/iris_dnn')

# http://machinelearningmastery.com/how-to-load-data-in-python-with-scikit-learn/
# http://docs.scipy.org/doc/numpy-1.10.1/reference/generated/numpy.load.html
import numpy as np

# load the dataset
train = np.genfromtxt()
iris = datasets.load_iris()
X_train, X_test, y_train, y_test = cross_validation.train_test_split(iris.data, iris.target,
    test_size=0.2, random_state=42)

# iris model
classifier = skflow.TensorFlowEstimator.restore(model_path)
print('Model loaded from models/iris_dnn')

# outcome = classifier.predict(iris.data[:1])
# print(outcome)
# print(iris.data[:1], iris.target[:1])

# Methods exports for usage
def predict(X):
  # make numpy array (works even if already is)
  npX = np.array(X)
  print(npX.shape)
  np.expand_dims(npX, axis=0)
  return classifier.predict(npX)

def accuracy():
  score = metrics.accuracy_score(y_test, classifier.predict(X_test))
  print('Accuracy: {0:f}'.format(score))


print(predict([[ 5.1,3.5,1.4,0.2]]))
# print(predict([ 5.1,3.5,1.4,0.2]))
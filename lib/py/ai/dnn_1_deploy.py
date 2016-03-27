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
  npX = np.array(X)
  # increase depth if not already dim=2
  npX = (np.expand_dims(npX, axis=0) if npX.ndim == 1 else npX)
  return classifier.predict(npX)

# !TODO: waiting for resolution by skflow team https://github.com/tensorflow/skflow/issues/153
def train(X, y):
  # do online training and model update
  return 'Feature to be implemented, waiting for skflow team'


# print(X_test[:1], predict(X_test[:1]))
# print(accuracy())
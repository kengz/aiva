from sklearn import datasets, metrics, cross_validation
import skflow
import os.path

# reliable absolute path when this module is called elsewhere
model_path = os.path.join(os.path.dirname(__file__), 'models/iris_dnn')

# Load the dataset.
iris = datasets.load_iris()
X_train, X_test, y_train, y_test = cross_validation.train_test_split(iris.data, iris.target,
    test_size=0.2, random_state=42)

# Build 3 layer DNN with 10, 20, 10 units respecitvely.
classifier = skflow.TensorFlowDNNClassifier(
  hidden_units=[10, 15, 10], 
  n_classes=3, 
  steps=800,
  learning_rate=0.1
)

# Fit and save model for deployment.
classifier.fit(X_train, y_train)
score = metrics.accuracy_score(y_test, classifier.predict(X_test))
print('Accuracy: {0:f}'.format(score))

# save the model for use
classifier.save(model_path)
print('Model saved to models/iris_dnn')

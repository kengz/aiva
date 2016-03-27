import os.path
import numpy as np
from sklearn.preprocessing import LabelEncoder

# generate the absolute path for /ai folder
def abspath(path):
  return os.path.normpath(os.path.join(os.path.dirname(__file__), '../', path))


# reshape numpy tensor T to ndim = d
def np_to_ndim(T, d):
  npT = np.array(T)
  diff = d - npT.ndim
  if diff == 0:
    return npT
  elif diff < 0:
    npT.flatten()
  else:
    npT = np.expand_dims(npT, axis=0)
  return np_to_ndim(npT, d)

# Apply sklearn.preprocessing.LabelEncoder to multiple columns
# Used to encode string categories into integers, e.g. ['male', 'female'] -> [0, 1]
class MultiColumnLabelEncoder:
  def __init__(self,columns = None):
    self.columns = columns # array of column names to encode
    self.le = LabelEncoder()

  def fit(self,X,y=None):
    return self # not relevant here

  def transform(self,X):
    '''
    Transforms columns of X specified in self.columns using
    LabelEncoder(). If no columns specified, transforms all
    columns in X.
    '''
    output = X.copy()
    if self.columns is not None:
      for col in self.columns:
        output[col] = self.le.fit_transform(output[col])
    else:
      for colname,col in output.iteritems():
        output[colname] = self.le.fit_transform(col)
    return output

  def fit_transform(self,X,y=None):
    return self.fit(X,y).transform(X)

  def inverse_transform(self,X):
    '''
    Inverse of transform() above, using the self.le LabelEncoder of this class instance.
    '''
    output = X.copy()
    if self.columns is not None:
      for col in self.columns:
        output[col] = self.le.inverse_transform(output[col])
    else:
      for colname,col in output.iteritems():
        output[colname] = self.le.inverse_transform(col)
    return output


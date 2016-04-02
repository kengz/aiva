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
class MultiLabelEncoder:
  def __init__(self,columns = None):
    self.columns = columns # array of column names to encode
    self.encoders = {}

  def save(self,path):
    '''
    Save the LabelEncoder classes, effectively this whole multiencoder to path as npz file.
    '''
    class_dict = {}
    for k, v in self.encoders.items():
      class_dict[k] = v.classes_
    return np.savez(path, **class_dict)

  def load(self,path):
    '''
    Restore a saved multiencoder from path using npz file, by reconstructing the LabelEncoders with the classes.
    '''
    npzfile = np.load(path)
    self.encoders = {}
    for k,v in npzfile.items():
      le = LabelEncoder()
      le.classes_ = v
      self.encoders[k] = le
    self.columns = list(self.encoders.keys())
    return self.encoders

  def fit(self,X,y=None):
    return self # not relevant here

  def transform(self,X):
    output = X.copy()
    if self.columns is not None:
      for colname in self.columns:
        print(colname)
        le = LabelEncoder()
        output[colname] = le.fit_transform(output[colname])
        self.encoders[colname] = le
    else:
      for colname,col in output.iteritems():
        le = LabelEncoder()
        output[colname] = le.fit_transform(col)
        self.encoders[colname] = le
      self.columns = list(self.encoders.keys())
    return output

  def fit_transform(self,X,y=None):
    '''
    The transform method that is compatible with Pipeline.
    '''
    return self.fit(X,y).transform(X)

  def inverse_transform(self,X):
    '''
    Inverse of transform() above, using the self.le LabelEncoder of this class instance.
    '''
    output = X.copy()
    if self.columns is not None:
      for colname in self.columns:
        le = self.encoders[colname]
        output[colname] = le.inverse_transform(output[colname])
    else:
      for colname,col in output.iteritems():
        le = self.encoders[colname]
        output[colname] = le.inverse_transform(col)
      self.columns = list(self.encoders.keys())
    return output


import os.path
import numpy as np
from sklearn.preprocessing import LabelEncoder
import pandas

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


# transform X, y into proper format in usage by deploy
def deploy_transform(mle, X, y=None):
  # check dim, make X into table
  npX = np.array(X)
  if npX.ndim == 1:
    X = [X]
  X = pandas.DataFrame(X, columns=mle.header)
  X = MultiFillna(X)
  X = mle.fit_transform(X)
  if y is None:
    return X
  else:
    # ensure y is a list
    y = np_to_ndim(y, 1)
    return X, y


# check if a list x contains string
def has_str(x):
  for v in x:
    if isinstance(v, str):
      return True
    elif np.isnan([v]):
      pass
    else:
      return False

def str_columns(X):
  '''
  find the names of columns of str
  '''
  header = list(X)
  str_headers = []
  for h in header:
    is_string_arr = has_str(X[h])
    if is_string_arr:
      str_headers.append(h)
  return str_headers

def MultiFillna(X, str_val='NA', num_val=0):
  '''
  Apply panda's fillna too all columns
  if a list is of string, fill with str_val (default 'NA')
  if a list is of numbers, fill with num_val (default 0)
  '''
  header = list(X)
  fillna_dict = {}
  for h in header:
    is_string_arr = has_str(X[h])
    if is_string_arr:
      fillna_dict[h] = str_val
  return X.fillna(fillna_dict).fillna(num_val)


class MultiLabelEncoder:
  '''
  Apply sklearn.preprocessing.LabelEncoder to all columns
  Used to encode string categories into integers, e.g. ['male', 'female'] -> [0, 1]
  '''
  def __init__(self,columns = None):
    self.header = None
    self.columns = columns # array of column names to encode
    self.encoders = {}

  def save(self,model_path):
    '''
    Save the LabelEncoder classes, effectively this whole multiencoder under model_path as npz file.
    Save the X header too.
    '''
    path = model_path + '/encoder.npz'
    h_path = model_path + '/header.npz'
    class_dict = {}
    for k, v in self.encoders.items():
      class_dict[k] = v.classes_
    np.savez(path, **class_dict)
    np.savez(h_path, header=self.header)
    return self

  def restore(self,model_path):
    '''
    Restore a saved multiencoder from path using npz file, by reconstructing the LabelEncoders with the classes.
    Restore the X header too.
    '''
    path = model_path + '/encoder.npz'
    h_path = model_path + '/header.npz'
    npzfile = np.load(path)
    h_npzfile = np.load(h_path)
    self.header = h_npzfile['header']
    self.encoders = {}
    for k,v in npzfile.items():
      le = LabelEncoder()
      le.classes_ = v
      self.encoders[k] = le
    self.columns = list(self.encoders.keys())
    return self

  def fit(self,X,y=None):
    return self # not relevant here

  def transform(self,X):
    output = X.copy()
    # save the ordered headers if haven't yet
    if self.header is None:
      self.header = list(X)
    # to automatically aim for str
    str_headers = str_columns(X)
    if self.columns is not None:
      # will always transform str columns
      self.columns = list(set(self.columns) | set(str_headers))
      for colname in self.columns:
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

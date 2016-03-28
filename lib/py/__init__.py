from os.path import dirname, basename, isfile
import glob
modules = glob.glob(dirname(__file__)+"/*.py")
__all__ = [ basename(f)[:-3] for f in modules if isfile(f)]

# allow rel import to work when called from elsewhere
import os
import sys
file_path = os.path.normpath(os.path.join(os.path.dirname(__file__)))
sys.path.insert(0, file_path)
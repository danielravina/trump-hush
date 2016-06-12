import time
import logging
logging.basicConfig(filename='trumplearn.log', level=logging.INFO)

def log(msg):
  logging.info(time.ctime() + " -- " + msg)


from lib.exceptions import RecognitionError
import logger
import json
import os
import sklearn.externals.joblib as joblib
from lib.features_extractors import MFCCExtractor
import numpy as np

CLF = os.getcwd() + '/classifiers/trump-gradient-boosting.pkl'

class TrumpRecognizer:
  def __init__(self):
    self.predictions  = None
    self.rate = None
    self.wave_file = None

  def recognize(self, path_to_wave):
    # try:
    self.wave_file = path_to_wave
    self.__predict()
    self.__parse()
    self.__clean()
    return (self.rate, self.predictions)

    # except Exception as e:
      # raise RecognitionError(e)

  def __clean(self):
    logger.log("Recognizer: Removing wav file %s" % self.wave_file)
    os.remove(self.wave_file)

  def __parse(self):
    milli = 0
    tmp = []

    for step in self.predictions:
      tmp.append(round(step[1], 2))
      milli += self.rate

    self.rate = round(self.rate, 2)
    self.predictions = json.dumps(tmp)
    logger.log("Recognizer: Done parsing %s" % self.wave_file)

  def __predict(self):
    extractor = MFCCExtractor()

    clf = joblib.load(CLF)
    mfcc = extractor.extract(self.wave_file)
    wave = extractor.wave

    milliseconds = (wave.getnframes() / float(extractor.rate)) * 1000.0
    self.rate = (float(extractor.step_size) / (extractor.rate/1000.0))

    logger.log("Recognizer: Start recognizing %s" % self.wave_file)

    self.predictions = clf.predict_proba(mfcc)

    logger.log("Recognizer: Done recognizing %s" % self.wave_file)

if __name__ == "__main__":
  import sys
  path_to_wave = sys.argv[1]
  tr = TrumpRecognizer()
  print tr.recognize(path_to_wave)

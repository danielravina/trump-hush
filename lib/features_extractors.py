import wave
import os
import numpy as np
from yaafelib import Engine, AudioFileProcessor, FeaturePlan

class MFCCExtractor:
  def __init__(self, **args):
    self.engine = Engine()
    self.afp = AudioFileProcessor()

    self.block_size = (1024 if not 'block_size' in args else args['block_size'])
    self.step_size  = (512 if not 'step_size' in args else args['step_size'])

  def extract(self, path, **args):
    self.path = path
    print path
    self.wave = wave.open(path, 'r')
    self.rate = self.wave.getframerate()

    fp = FeaturePlan(sample_rate=self.rate)
    fp.addFeature('mfcc: MFCC blockSize={} stepSize={}'.format(self.block_size, self.step_size))
    self.engine.load(fp.getDataFlow())
    self.afp.processFile(self.engine, path)

    feats = self.engine.readAllOutputs()

    if 'save_to_disk' in args:
      self.__save_to_disk(feats['mfcc'])

    return feats['mfcc']

  def __save_to_disk(self, feats):
    new_path = self.path + ".mfc.csv"
    np.savetxt(new_path, feats, delimiter=",")

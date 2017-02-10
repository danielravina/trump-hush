import os
from features_extractors import MFCCExtractor;

extractor = MFCCExtractor()

pos_path  = os.getcwd() + "/training_data/pos/"
neg_path  = os.getcwd() + "/training_data/neg/"

for path in [pos_path, neg_path]:
  for file_name in os.listdir(path):
    if file_name.endswith('.wav'):
      file_path = path + file_name
      extractor.extract(file_path, save_to_disk=True)

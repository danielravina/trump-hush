import os
import numpy as np

from sklearn.externals import joblib
from sklearn.svm import SVC
from sklearn.ensemble import GradientBoostingClassifier

def getFeatures(path):
  return np.loadtxt(open(path, "rb"), delimiter=",")

pos = []
positive_path = os.getcwd() + "/training_data/pos/"
for file_name in os.listdir(positive_path):
  if file_name.endswith('.csv'):
    for feature in getFeatures(positive_path + file_name):
      pos.append(feature)

y = np.ones(len(pos))

neg = []
negative_path = os.getcwd()+ "/training_data/neg/"
for file_name in os.listdir(negative_path):
  if file_name.endswith('.csv'):
    features = np.loadtxt(open(negative_path + file_name, "rb"), delimiter=",")
    for feature in features:
      neg.append(feature)

X = pos + neg
y = np.concatenate([y, np.zeros(len(neg))])

print "Training samples: %s" % len(X)

clf = GradientBoostingClassifier(verbose=True, n_estimators=1500)

print(clf)

print "Training..."
clf.fit(X, y)

joblib.dump(clf, 'classifiers/trump-gradient-boosting.pkl', compress=1)

# CLASSIFICATION_REPORT
from sklearn.cross_validation import train_test_split
from sklearn.metrics import classification_report
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5)

y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred,target_names=['Trump','Not Trump']))
print(clf.score(X_test, y_test))

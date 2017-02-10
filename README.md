# Trump HUSH
![Image Trump speaks](https://github.com/danielravina/trump-learn/raw/master/web/static/images/logo.png)

This is an experimental python machine learning pipeline that extracts MFCC voice features from youtube videos and trains a [Gradient Boosting Classifier](http://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingClassifier.html) algorithm. For this project, the training data is ~1800 seconds of donald trump speaks in different scenarios + equivalent time of random people (men and women) talk about random stuff. The project was inspired by this [youtube video](https://www.youtube.com/watch?v=_aFo_BV-UzI) where this guy explain some unique features in his talk. I wanted to know if computers are able to analyze these things as well and maybe even more.

The pipeline is relatively simple and doesn't include sophisticated pre-processing methods. I was quite happy with the results so far and in the future I'll spend more time improving the model so it could work on potentially any voice, given enough input.


### Tools used:
- [scikit-learn](http://scikit-learn.org/stable/index.html) for the ML algorithm
- [YAAFE](http://yaafe.sourceforge.net/) for feature extraction
- [Flask](http://flask.pocoo.org/) for the web server
- [youtube-dl](https://rg3.github.io/youtube-dl/) to handle youtube downloads
- [postgresql](https://www.postgresql.org/) - as the database
- [redis](http://redis.io/) + [celery](http://www.celeryproject.org/) to handle the recognition background job

If you want to try it locally you need to have these environment variables:
```bash
# Postgres
export PGPASSWORD="password"
export POSTGRES_CRED="dbname=trumplearn user=app password=$PGPASSWORD"

# YAAFE
export LD_LIBRARY_PATH=/usr/local/lib/

# Flask
export DEBUG=True

# Celery
export REDIS_SERVER='redis://127.0.0.1:6379'
```

On an ubuntu machine, it's possible to run `bootstap.sh` to provision the environment.

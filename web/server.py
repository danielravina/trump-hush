import json
import os
import sys
from flask import Flask, Response, jsonify, render_template
sys.path.append(os.getcwd())

import logger
import trumplearn

app = Flask(__name__)

# Nginx..
@app.route('/')
def home():
  return render_template('index.html')

@app.route('/api/videos/<youtube_id>/poll')
def poll(youtube_id):
  video = trumplearn.get_video(youtube_id)
  if video:
    return jsonify(video.attributes())
  else:
    return jsonify({'state': 'not_ready'})

@app.route('/api/videos/<youtube_id>')
def video(youtube_id):
  response = trumplearn.run(youtube_id)
  if response:
    return jsonify(response)
  else:
    return '', 404

@app.route('/api/videos/popular')
def popular_video():
  response = trumplearn.popular()
  return jsonify(response)

@app.after_request
def add_header(response):
  if os.environ['DEBUG'] == 'True':
    response.headers['Cache-Control'] = 'public, max-age=0'
    response.headers['Pragma'] = ' no-cache'
    return response

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=3000, debug=(os.environ['DEBUG'] == 'True'))

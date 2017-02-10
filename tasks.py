from lib.exceptions import VideoTooLong, DownlaodError, VideoNotFound
from trump_recognizer import TrumpRecognizer
from youtube import Downloader
from celery import Celery
from lib.video import Video
import os
import re

app = Celery('tasks', broker=os.environ['REDIS_SERVER'])

@app.task
def add_new_video(youtube_id):
  Video.connect()
  #
  # iterate all the workers and all the running jobs
  # and stop the ones that already running
  #
  def find_duplicated_job():
    run_count = 0
    workers = app.control.inspect()
    active = workers.active()

    for worker, jobs in active.iteritems():
      for job in jobs:
        # args is a string tuple =\. need to get the id
        match = re.match(r'\(u\'(.{11})\',\)', job['args'])
        if match and match.group(1) == youtube_id:
          run_count += 1

    return run_count > 1

  if find_duplicated_job():
    print "Already running "
    return

  dl = Downloader()
  tr = TrumpRecognizer()

  video = Video()

  try:
    (path_to_wave, thumbnail, title) = dl.start(youtube_id)
  except VideoTooLong as e:
    video.set(youtube_id=youtube_id, state="too_long")
    video.save()
    return
  except VideoNotFound as e:
    video.set(youtube_id=youtube_id, state="not_found")
    video.save()
    return

  except DownlaodError as e:
    video.set(youtube_id=youtube_id, state="not_found")
    video.save()
    return

  # Video might already exist if multiple jobs are in the queue
  if video.fetch(youtube_id):
    return

  (rate, predictions) = tr.recognize(path_to_wave)

  video.set(
    youtube_id  = youtube_id,
    thumbnail   = thumbnail,
    title       = title,
    rate        = rate,
    predictions = predictions
  )

  video.save()
  Video.disconnect()

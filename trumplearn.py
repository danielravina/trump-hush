import logger
from lib.exceptions import VideoNotFound
from lib.video import Video
from tasks import add_new_video
import re

YOUTUBE_ID_LENGTH = 11

def run(youtube_src):
  Video.connect()

  logger.log('Running %s' % youtube_src)

  youtube_id = __parse_youtube_src(youtube_src)
  video = get_video(youtube_src)

  if video:
    return video.attributes()
  else:
    add_new_video.delay(youtube_id)
    return { 'delayed': 'true' }

  Video.disconnect()

def popular():
  Video.connect()
  video = Video()
  popular = video.last()
  video.disconnect()
  return popular

def get_video(youtube_src):
  logger.log('Checking %s' % youtube_src)
  youtube_id = __parse_youtube_src(youtube_src)
  video = Video()

  if video.fetch(youtube_id):
    return video

def __parse_youtube_src(youtube_src):
  if re.match(r'http|.com|www|youtube|v=', youtube_src):
    return youtube_src.split('v=')[1]
  elif len(youtube_src) == YOUTUBE_ID_LENGTH:
    return youtube_src
  else:
    return None

if __name__ == "__main__":
  import sys
  yt_source = sys.argv[1]
  print run(yt_source)

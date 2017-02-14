import youtube_dl
from lib.exceptions import VideoTooLong, DownlaodError
output = []

class Logger(object):
  def debug(self, msg):
    output.append(msg)

  def warning(self, msg):
      pass

  def error(self, msg):
    output.append(msg)

normal_options = {
  'format': 'bestaudio/best',
  'logger': Logger(),
  'forcethumbnail': True,
  'forcetitle': True,
  'quite': True,
  'gettitle': True,
  'outtmpl': '%(id)s.v',
  'prefer_ffmpeg': True,
  'audioformat': 'wav',

  'postprocessors': [{
    'key': 'FFmpegExtractAudio',
    'preferredcodec': 'wav'
  }]
}

validate_opts = {
  'simulate': True,
  'logger': Logger(),
  'forceduration': True
}

class Downloader:
  def __init__(self):
    self.__youtube_id = None

  def start(self, youtube_id):
    self.__youtube_id = youtube_id

    if self.__validate():
      self.__download(normal_options)
      path_to_wave = youtube_id + '.wav'
      title        = output[4]
      thumbnail    = output[5].replace('maxresdefault', 'hqdefault') # Hack

      return (path_to_wave, thumbnail, title)

  def __validate(self):
    self.__download(validate_opts)
    duration       = output[-1]
    time_parts     = str.split(str(duration), ':' )
    time_parts_len = len(time_parts)
                              # if 3 then it's over an hour
    if time_parts_len == 1 or (time_parts_len == 2 and int(time_parts[0]) <= 25):
      output[:] = []
      return True

    raise VideoTooLong

  def __download(self, options):
    with youtube_dl.YoutubeDL(options) as ydl:
      try:
        ydl.download(["http://www.youtube.com/watch?v=%s" % self.__youtube_id])
      except youtube_dl.utils.DownloadError as e:
        print e
        raise DownlaodError(e)


if __name__ == "__main__":
  import sys
  youtube_id = sys.argv[1]
  dl = Downloader()
  print dl.start(youtube_id)

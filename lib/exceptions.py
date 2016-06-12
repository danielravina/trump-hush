class VideoTooLong(Exception):
  def __init__(self,*args,**kwargs):
      Exception.__init__(self,*args,**kwargs)

class VideoNotFound(Exception):
  def __init__(self,*args,**kwargs):
      Exception.__init__(self,*args,**kwargs)

class DownlaodError(Exception):
  def __init__(self,*args,**kwargs):
      Exception.__init__(self,*args,**kwargs)

class RecognitionError(Exception):
  def __init__(self,*args,**kwargs):
      Exception.__init__(self,*args,**kwargs)

class DatabaseError(Exception):
  def __init__(self,*args,**kwargs):
      Exception.__init__(self,*args,**kwargs)

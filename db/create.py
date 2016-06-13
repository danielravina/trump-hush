import os
import psycopg2
conn = psycopg2.connect(os.environ['POSTGRES_CRED'])
c = conn.cursor()

c.execute (
  '''
    CREATE TABLE videos
    (
      id SERIAL,
      played integer DEFAULT 1,
      predictions text,
      rate float,
      thumbnail varchar,
      title varchar,
      youtube_id varchar,
      state varchar,
      created_at timestamp without time zone default (now() at time zone 'utc')
    )
  '''
)

c.execute (
  '''
    CREATE UNIQUE INDEX uniq_youtube_id
    on videos (youtube_id);
    CREATE INDEX state_index
    on videos (state);
  '''
)

conn.commit()
c.close()
conn.close()

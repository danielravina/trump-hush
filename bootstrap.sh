if [ -n "$PGPASSWORD" ]; then
  echo "PROVISIONING BOX"
else
  echo 'Missing params $PGPASSWORD'
  exit
fi

echo "UPDATING / UPGRADING BOX"

sudo apt-get upgrade -y 2>&1 >/dev/null
sudo apt-get update -y 2>&1 >/dev/null

echo "INSTALLING REQUIRED PACKAGES"

packagelist=(
  build-essential
  libeigen3-dev
  git
  cmake
  cmake-curses-gui
  libargtable2-0
  libargtable2-dev
  libsndfile1
  libsndfile1-dev
  libmpg123-0
  libmpg123-dev
  libfftw3-3
  libfftw3-dev
  liblapack-dev
  libhdf5-serial-dev
  libhdf5-7
  python-pip
  python-dev
  postgresql
  postgresql-contrib
  libav-tools
  python-psycopg2
  libpq-dev
  tcl8.5
  nginx
)

sudo apt-get install ${packagelist[@]} -y 2>&1 >/dev/null

echo "INSTALLING REDIS"
cd ~
wget http://download.redis.io/releases/redis-stable.tar.gz 2>&1 >/dev/null
tar xzf redis-stable.tar.gz
cd redis-stable
make 2>&1 >/dev/null

sudo make install 2>&1 >/dev/null
cd utils
sudo ./install_server.sh 2>&1 >/dev/null
sudo service redis_6379 start
cd ../../;
rm -R redis-stable
rm redis-stable.tar.gz

echo "INSTALLING YAAFE"
cd ~
git clone https://github.com/Yaafe/Yaafe yaafe
cd yaafe
mkdir build
cd build
ccmake ..
make
sudo make install
echo "export ld_library_path=$ld_library_path:/usr/local/lib/" >> ~/.bashrc; source ~/.bashrc

echo "INSTALLING YOUTUBE-DL"
sudo wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl 2>&1 >/dev/null

echo "INSTALL APPLICATION CODE"

cd ~
sudo pip install --upgrade pip
sudo pip install virtualenv
virtualenv .
source bin/activate
ln -s /usr/local/lib/python2.7/dist-packages/yaafelib lib/python2.7/site-packages/yaafelib
git clone https://github.com/danielravina/trump-learn src
pip install numpy cython
cd src
pip install -r 'requirements.txt'

echo "NGINX SETUP"
sudo cat > ~/nginx.conf <<EOL
server {
  listen 80 default_server;
  listen [::]:80 default_server ipv6only=on;

  server_name localhost;

  location / {
    root /home/ubuntu/src/web/templates;
    index index.html index.htm;
  }

  location /static {
    root    /home/ubuntu/src/web/;
    autoindex on;
  }

  location /api {
    proxy_pass  http://localhost:3000;
  }
}
EOL
sudo mv ~/nginx.conf /etc/nginx/sites-enabled/trumplearn.com
sudo rm /etc/nginx/sites-enabled/default
sudo service nginx restart

echo "ENVIRONMENT VARIABLES"
echo "export REDIS_SERVER='redis://127.0.0.1:6379'" >> ~/.bashrc
echo "export POSTGRES_CRED='dbname=trumplearn user=app password=$PGPASSWORD host=localhost'" >> ~/.bashrc
echo "export DEBUG=false" >> ~/.bashrc
source ~/.bashrc

echo "SETUP POSTGRES"
sudo -u postgres psql postgres -c "CREATE ROLE app with LOGIN CREATEDB ENCRYPTED PASSWORD '$PGPASSWORD';"
sudo -u postgres psql postgres -c "CREATE database trumplearn;"
python ~/src/db/create.py

echo "PROVISIONING COMPLETED"

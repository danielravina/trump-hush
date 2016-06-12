echo "updating / upgrading box"

sudo apt-get upgrade -y 2>&1 >/dev/null
sudo apt-get update -y 2>&1 >/dev/null

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
)

echo "Installing required packages"

sudo apt-get install ${packagelist[@]} -y 2>&1 >/dev/null

# Redis
echo "Installing redis"
cd ~
wget http://download.redis.io/releases/redis-stable.tar.gz 2>&1 >/dev/null
tar xzf redis-stable.tar.gz
cd redis-stable
make 2>&1 >/dev/null
make test 2>&1 >/dev/null
sudo make install 2>&1 >/dev/null
cd utils
sudo ./install_server.sh 2>&1 >/dev/null
sudo service redis_6379 start
cd ../../;
rm -R redis-stable
rm redis-stable.tar.gz

echo "Installing Yaafe"
cd ~
git clone https://github.com/Yaafe/Yaafe yaafe
cd yaafe
mkdir build
cd build
ccmake ..
make && sudo make install
echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib/" >> ~/.bashrc; source ~/.bashrc

echo "Installing youtube-dl"
sudo wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl 2>&1 >/dev/null

echo "Install application code"
sudo mkdir -p /home/app
sudo useradd app

cd ~
pip install --upgrade pip
sudo pip install virtualenv
virtualenv .
source bin/activate
git clone https://github.com/danielravina/trump-learn 2>&1 >/dev/null
cd trump-learn
pip install numpy cython
pip install -r 'requirements.txt'

# Set psql (MANUALLY):
# 1. useradd app
# 2. export PGPASSWORD=whatever
# 3. sudo -u postgres psql postgres -c "CREATE ROLE app with LOGIN CREATEDB ENCRYPTED PASSWORD $PGPASSWORD;"
# 4. psql
# psql; \connect trump; select * from trumps; CREATE ROLE app with LOGIN; ALTER ROLE app with ENCRYPTED PASSWORD 'password';
#

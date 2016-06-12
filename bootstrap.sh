if [ $PGPASSWORD == "" ]; then
  echo "PGPASSWORD is missing";
  exit
done

echo "updating / upgrading box"
apt-get upgrade && apt-get update -y 1> /dev/null

packagelist= (
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
  postgresql
  postgresql-contrib
  libav-tools
  python-psycopg2
  libpq-dev
)

echo "Installing required packages"

apt-get install ${packagelist[@]} -y 1> /dev/null

echo "Installing Yaafe"
cd ~
git clone https://github.com/Yaafe/Yaafe yaafe
cd yaafe
mkdir build
cd build
ccmake ..
make && make install
echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib/" >> ~/.bashrc; source ~/.bashrc

echo "Installing youtube-dl"
wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl

# Redis
echo "Installing redis"
wget http://download.redis.io/releases/redis-stable.tar.gz
tar xzf redis-stable.tar.gz
cd redis-stable
make test
make install
cd utils
./install_server.sh
service redis_6379 start



echo "Install application code"
mkdir -p /home/app
cd /home/app
git clone https://github.com/danielravina/trump-learn
cd trump-learn
pip install -r requirements.txt


# Set psql (MANUALLY):
# 1. useradd app
# 2. export PGPASSWORD=whatever
# 3. sudo -u postgres psql postgres -c "CREATE ROLE app with LOGIN CREATEDB ENCRYPTED PASSWORD $PGPASSWORD;"
# 4. psql
# psql; \connect trump; select * from trumps; CREATE ROLE app with LOGIN; ALTER ROLE app with ENCRYPTED PASSWORD 'password';
#

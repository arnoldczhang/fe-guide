# 云服务器搭建指南

## node
  - cd /root
  - wget https://npm.taobao.org/mirrors/node/v8.9.3/node-v8.9.3-linux-x64.tar.xz
  - xz -d node-v8.9.3-linux-x64.tar.xz
  - tar -xvf node-v8.9.3-linux-x64.tar
  - ln -s /root/node-v8.9.3-linux-x64/bin/node /usr/local/bin/node
  - ln -s /root/node-v8.9.3-linux-x64/bin/npm /usr/local/bin/npm
  - npm install -g cnpm --registry=https://registry.npm.taobao.org

## nginx
  - wget --no-check-certificate https://sourceforge.net/projects/pcre/files/pcre/8.42/pcre-8.42.tar.gz
  - wget http://nginx.org/download/nginx-1.8.0.tar.gz
  - wget http://www.openssl.org/source/openssl-fips-2.0.9.tar.gz
  - wget http://zlib.net/zlib-1.2.8.tar.gz
  - tar zxvf openssl-fips-2.0.9.tar.gz
  - cd openssl-fips-2.0.9
  - ./config && make && make install
  - tar zxvf pcre-8.42.tar.gz
  - cd pcre-8.42
  - ./configure && make && make install
  - tar zxvf zlib-1.2.11.tar.gz
  - cd zlib-1.2.11
  - ./configure && make && make install
  - tar zxvf nginx-1.8.0.tar.gz
  - cd nginx-1.8.0
  - ./configure && make && make install
  - ./usr/local/nginx/sbin/nginx
  - ./usr/local/nginx/sbin/nginx -s reload

## pm2
  - npm i -g pm2
  - ln -s /root/node-v8.9.3-linux-x64/bin/pm2 /usr/local/bin/pm2
  - cd /usr/local/server
  - pm2 start app.js





# 云服务器搭建指南

## 参考
  - https ssl 证书生成：https://blog.csdn.net/tanyhuan/article/details/79992975
  - h2：https://zhangge.net/5076.html
  - nginx ssl：https://www.cnblogs.com/piscesLoveCc/p/6120875.html

## node
  - cd /root
  - wget https://npm.taobao.org/mirrors/node/v8.9.3/node-v8.9.3-linux-x64.tar.xz
  - xz -d node-v8.9.3-linux-x64.tar.xz
  - tar -xvf node-v8.9.3-linux-x64.tar
  - ln -s /root/node-v8.9.3-linux-x64/bin/node /usr/local/bin/node
  - ln -s /root/node-v8.9.3-linux-x64/bin/npm /usr/local/bin/npm
  - npm install -g cnpm --registry=https://registry.npm.taobao.org

## resource
  - wget --no-check-certificate https://sourceforge.net/projects/pcre/files/pcre/8.42/pcre-8.42.tar.gz
  - wget http://nginx.org/download/nginx-1.8.0.tar.gz
  - wget http://www.openssl.org/source/openssl-fips-2.0.9.tar.gz
  - wget http://zlib.net/zlib-1.2.8.tar.gz
  - wget http://www.openssl.org/source/openssl-1.0.2o.tar.gz

## openssl-fips
  - tar zxvf openssl-fips-2.0.9.tar.gz
  - cd openssl-fips-2.0.9
  - ./config && make && make install

## openssl
  - yum -y install openssl openssl-devel
  - tar zxvf openssl-1.0.2o.tar.gz
  - cd openssl-1.0.2o
  - ./config && make && make install

## pcre
  - tar zxvf pcre-8.42.tar.gz
  - cd pcre-8.42
  - ./configure && make && make install

## zlib
  - tar zxvf zlib-1.2.11.tar.gz
  - cd zlib-1.2.11
  - ./configure && make && make install

## nginx
  - tar zxvf nginx-1.9.7.tar.gz
  - cd nginx-1.9.7
  - ./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_gzip_static_module --with-http_v2_module --with-http_ssl_module
  - make && make install
  - ./usr/local/nginx/sbin/nginx
  - ./usr/local/nginx/sbin/nginx -s reload

## pm2
  - npm i -g pm2
  - ln -s /root/node-v8.9.3-linux-x64/bin/pm2 /usr/local/bin/pm2
  - cd /usr/local/server
  - pm2 start app.js
  - pm2 kill

## git
  - yum -y install git
  - git config --global user.name 'sample'
  - git config --global user.email 'sample@sample.com'
  - git config --global color.ui true
  - ssh-keygen -t rsa -C "sample@sample.com"
  - useradd -s /usr/bin/git-shell git
  - mkdir /git; cd /git
  - git init --bare sample.git
  - chown -R git:git sample.git
  - mkdir /home/git/.ssh; cd /home/git/.ssh
  - vim authorized_keys（公钥id_rsa，单行一个写入）
  - git clone git@123.57.177.232:/git/sample.git


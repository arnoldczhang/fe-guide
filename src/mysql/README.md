# mysql

## 参考

- [mac安装mysql.tgz](https://www.cnblogs.com/yjmyzz/p/how-to-install-mysql8-on-mac-using-tar-gz.html)

## 安装（mysql8）

```sh
# 解压下载的 tgz，得到文件夹 mysql-8.0.22-macos10.15-x86_64（假如这个名字）

# 拷贝到/usr/local
mv mysql-8.0.22-macos10.15-x86_64 /usr/local/mysql

# 全局可用mysql xxx
export PATH=/usr/local/mysql/bin:$PATH

# 文件夹赋权
cd /usr/local
chown -R 当前登录mac的管理员用户名 mysql

# 初始化
# 特别注意 lower-case-table-names，mysql8默认是0，这里要手动设置下，1或2，自己试试
cd /usr/local/mysql/bin
sudo ./mysqld --user=mysql --initialize --lower-case-table-names=2

# 初始化的信息包含初始密码，记录下
# [Server] A temporary xxxxx: 注意这了

# 启动
cd /usr/local/mysql/support-files
./mysql.server start

# 修改密码
./mysqladmin -u root -p password

# 登录
mysql -u root -p

# 建库
CREATE DATABASE IF NOT EXISTS aaaa DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

# 删库
drop database <数据库名>;
```

更多指令参考[mysql指南](https://www.runoob.com/mysql/mysql-tutorial.html)

# shell

## 常用命令

### 批量写入多个文件
```sh
for file in $(find . -name "*.customfile")
do
  echo "xxx" > $file
done
```
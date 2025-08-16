# bash

## 快捷命令

### 文件按行去重
```
cat test.txt | sort | uniq
```

### 文件按行去重 + 输出文件
```
cat test.txt | sort | uniq > "result.txt"
```

### 文件按行去重 + 统计重复数
```
awk -F '\n' '{print $0}' test.txt | sort | uniq -c
```

### 文件按行去重 + 统计重复数 + 美化 + 输出文件
```
awk -F '\n' '{print $0}' test.txt | sort | uniq -c | awk '{$1=$1};1' | sed -r 's/\s+/,/'  > result.txt
```



# sql

## 概念

### sql执行顺序

1. FROM + JOIN
2. WHERE
3. GROUP BY
4. HAVING
5. SELECT
6. ORDER BY
7. LIMIT

### order by优先级

**就近原则**

order by a,b,c desc，表示：先按a排，再按b，然后c。

### linq执行顺序

FROM...WHERE...SELECT

```sql
from s in studentList
where s.Age > 12 && s.Age < 20
select s;
```

---

## 常用命令

### 碎片整理

```sql
alter table TABLE_NAME engine=innodb;
```

---

## 索引

原理：[B+tree](https://blog.csdn.net/yin767833376/article/details/81511377)

### 关键点

具体[参考](https://tech.meituan.com/2014/06/30/mysql-index.html)

- 区分度大的列，适合加索引（通过**select count(distinct 列名)/count(*) from 表名**计算，一般要求 **>0.1**）
- 区分度小，但列的值分配极不均（比如频繁的查找值占比很小）时，适合加索引
- 最左前缀匹配原则（比如a,b,c，会先按a找，再b，最后c），直至遇到范围查询（>、<、between、like）
- = 和 in 可以乱序，mysql会自动优化
- 尽量扩展索引，替代新增





### 语法参考

```sql
ALTER TABLE xxx.表名 ADD INDEX 索引名(字段,...可以多个)

ALTER TABLE xxx.表名 DROP INDEX 索引名;
```


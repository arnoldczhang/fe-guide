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


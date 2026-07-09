# SQL进阶 Day15：EXPLAIN执行计划（完整版学习文档）

# 一、学习目标

Day15学习SQL性能分析核心工具：

EXPLAIN。


重点掌握：

- EXPLAIN作用
- 执行计划字段
- type访问类型
- possible_keys
- key
- rows
- filtered
- Extra信息
- 慢SQL分析流程


完成后能够：

1. 看懂SQL执行计划
2. 判断索引是否生效
3. 定位SQL性能问题
4. 指导SQL优化


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务模型设计


模拟订单查询系统。


业务：

后台订单列表：

- 条件查询
- 排序
- 分页


数据量：

生产：

百万级订单。


---

# 四、创建测试表


```sql
DROP TABLE IF EXISTS sale_order;


CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 status TINYINT,

 amount DECIMAL(12,2),

 create_time DATETIME,

 order_no VARCHAR(50),


 INDEX idx_customer(customer_id),

 INDEX idx_status_time(status,create_time)

);
```


---

# 五、插入测试数据


```sql
INSERT INTO sale_order
(customer_id,status,amount,create_time,order_no)

VALUES

(1,1,1000,'2026-01-01','SO001'),

(2,2,2000,'2026-01-02','SO002'),

(3,2,3000,'2026-01-03','SO003');
```


---

# 六、知识点详细讲解


# 1.EXPLAIN是什么


EXPLAIN：

查看MySQL如何执行SQL。


例如：


```sql
EXPLAIN

SELECT *

FROM sale_order

WHERE customer_id=1;
```


作用：

提前发现：

- 全表扫描
- 索引问题
- 数据扫描量


---

# 2.id字段


表示查询编号。


简单SQL：

一个id。


复杂SQL：

可能多个id。


---

# 3.select_type


表示查询类型。


常见：

## SIMPLE


简单查询。


## PRIMARY


外层查询。


## SUBQUERY


子查询。


---

# 4.table


当前访问表。


---

# 5.type访问类型


非常重要。


性能排序：


```
system

const

eq_ref

ref

range

index

ALL
```


---

## ALL


全表扫描。


例如：


```sql
SELECT *

FROM sale_order

WHERE amount>0;
```


问题：

扫描全部数据。


---

## ref


索引等值查询。


例如：


```sql
WHERE customer_id=1;
```


---

## range


范围查询。


例如：


```sql
WHERE create_time>'2026-01-01';
```


---

# 6.possible_keys


可能使用的索引。


---

# 7.key


实际使用索引。


重点关注：

如果：

possible_keys有值

但是：

key=NULL


说明：

索引没有使用。


---

# 8.rows


预计扫描行数。


越少越好。


例如：

```
rows=10

优于

rows=100000
```


---

# 9.Extra


重要信息。


## Using index


覆盖索引。


## Using filesort


额外排序。


可能需要优化。


## Using temporary


使用临时表。


可能性能问题。


---

# 七、企业案例


# 案例1：订单查询慢


SQL：

```sql
SELECT *

FROM sale_order

WHERE status=2

ORDER BY create_time DESC;
```


分析：


如果：

type=ALL


说明：

没有使用索引。


优化：

```sql
CREATE INDEX idx_status_time

ON sale_order(status,create_time);
```


---

# 案例2：分页慢


SQL：

```sql
SELECT *

FROM sale_order

ORDER BY create_time

LIMIT 100000,20;
```


问题：

扫描大量数据。


优化：

使用游标分页。


---

# 八、SQL优化流程


标准流程：


```
发现慢SQL

↓

EXPLAIN

↓

分析type

↓

查看key

↓

优化SQL

↓

调整索引

↓

再次验证
```


---

# 九、Java + MyBatis应用


接口慢：

```
Controller

↓

Service

↓

Mapper

↓

SQL

```


排查：

1. 打印SQL

2. EXPLAIN

3. 优化索引


Mapper：


```xml
<select id="page">

SELECT *

FROM sale_order

WHERE status=#{status}

</select>
```


---

# 十、练习题


## 基础


1. 使用EXPLAIN分析查询。

2. 找出全表扫描SQL。


---

## 进阶


3. 优化订单状态查询。

4. 分析rows数量。


5. 优化排序SQL。


---

## 高级


6. 分析复杂JOIN执行计划。

7. 优化分页SQL。

8. 编写SQL优化报告。


---

# 十一、面试问题


1. EXPLAIN主要看哪些字段？

2. type=ALL说明什么？

3. rows越大代表什么？

4. Using filesort如何优化？

5. key为什么为空？


---

# 十二、最终实战任务


模拟：

订单接口响应超过3秒。


完成：

1. EXPLAIN分析。

2. 找出原因。

3. 修改SQL。

4. 设计索引。


---

# 十三、总结


掌握：

✅ EXPLAIN

✅ type

✅ key

✅ rows

✅ Extra

✅ SQL优化流程


下一章节：

Day16：慢SQL优化

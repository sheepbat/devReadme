# SQL进阶 Day16：慢SQL优化（完整版学习文档）

# 一、学习目标

Day16学习生产环境数据库优化的重要能力：

慢SQL定位与优化。


重点掌握：

- 什么是慢SQL
- 慢查询日志
- SQL定位流程
- SQL改写优化
- 索引优化
- JOIN优化
- 大数据量查询优化
- MyBatis慢SQL分析


完成后能够：

1. 定位接口慢的数据库原因
2. 分析慢SQL执行计划
3. 制定SQL优化方案
4. 建立SQL性能优化流程


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、慢SQL产生原因


常见原因：


## 1. 没有索引


例如：


```sql
SELECT *

FROM sale_order

WHERE customer_id=100;
```


没有索引：

全表扫描。


---

## 2. 返回数据过多


错误：

```sql
SELECT *

FROM sale_order;
```


问题：

大量IO。


---

## 3. JOIN关联错误


例如：

没有关联条件：


```sql
SELECT *

FROM customer,sale_order;
```


产生笛卡尔积。


---

## 4. 深分页


例如：

```sql
LIMIT 100000,20;
```


---

# 四、环境准备


创建订单表：


```sql
DROP TABLE IF EXISTS sale_order;


CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 status TINYINT,

 amount DECIMAL(12,2),

 create_time DATETIME,


 INDEX idx_customer(customer_id),

 INDEX idx_status_time(status,create_time)

);
```


---

# 五、知识点详细讲解


# 1.什么是慢SQL


慢SQL：

执行时间超过阈值的SQL。


例如：

接口：

```
500ms
```


SQL：

```
3s
```


就是慢SQL。


---

# 2.慢SQL定位流程


标准流程：


```
接口慢

↓

查看SQL

↓

执行EXPLAIN

↓

分析索引

↓

优化SQL

↓

验证效果
```


---

# 3.慢查询日志


MySQL：

开启慢日志。


查看：

```sql
SHOW VARIABLES LIKE 'slow_query_log';
```


查看时间：

```sql
SHOW VARIABLES LIKE 'long_query_time';
```


---

# 4.SQL优化原则


## 原则1：减少扫描数据


不要：

```sql
SELECT *
```


改：

```sql
SELECT id,name
```


---

## 原则2：增加过滤条件


慢：

```sql
SELECT *

FROM sale_order;
```


快：

```sql
SELECT *

FROM sale_order

WHERE create_time>'2026-01-01';
```


---

## 原则3：优化排序


慢：

```sql
ORDER BY amount;
```


优化：

建立索引。


---

# 六、企业案例


# 案例1：订单列表慢


原SQL：


```sql
SELECT *

FROM sale_order

WHERE status=2

ORDER BY create_time DESC;
```


分析：


如果：

rows很大。


优化：

```sql
CREATE INDEX idx_status_time

ON sale_order(status,create_time);
```


---

# 案例2：查询客户订单


原SQL：

```sql
SELECT *

FROM customer c

JOIN sale_order o

ON c.id=o.customer_id;
```


优化：

确认：

customer.id

sale_order.customer_id


都有索引。


---

# 案例3：分页接口慢


问题：

```sql
LIMIT 500000,20;
```


优化：

游标分页。


---

# 七、JOIN优化


## 1.关联字段索引


必须：

```sql
customer.id

order.customer_id
```


---

## 2.减少JOIN数据


错误：

先查全部订单。


正确：

先过滤。


---

# 八、MyBatis慢SQL分析


常见问题：


## 1.N+1查询


错误：

查询100个用户。

执行：

101次SQL。


优化：

JOIN查询。


---

## 2.查询全部字段


错误：

```sql
SELECT *
```


优化：

明确字段。


---

## 3.动态SQL问题


例如：

空条件导致：

全表查询。


---

# 九、练习题


## 基础


1. 找出慢SQL原因。

2. 使用EXPLAIN分析。


---

## 进阶


3. 优化订单列表。

4. 优化JOIN查询。

5. 优化分页接口。


---

## 高级


6. 制定慢SQL排查流程。

7. 输出SQL优化报告。


---

# 十、面试问题


1. 如何定位慢SQL？

2. 慢SQL优化步骤？

3. JOIN慢如何优化？

4. 什么情况下不能使用索引？

5. MyBatis如何避免慢查询？


---

# 十一、最终实战任务


模拟：

订单查询接口响应3秒。


要求：

完成：

1. SQL分析。

2. EXPLAIN报告。

3. 索引方案。

4. 优化后SQL。


---

# 十二、总结


掌握：

✅ 慢SQL定位

✅ 慢查询日志

✅ SQL改写

✅ JOIN优化

✅ MyBatis优化


下一章节：

Day17：大表优化

# SQL进阶 Day04：子查询与 EXISTS 优化（完整版）

# 一、学习目标

今天学习 SQL 从“能查询”进入“能设计查询”。

掌握：

- 子查询概念
- 标量子查询
- IN子查询
- EXISTS
- NOT EXISTS
- 相关子查询
- 子查询与JOIN转换
- 子查询性能分析

完成后能够：

1. 编写复杂业务查询SQL
2. 判断子查询性能问题
3. 根据场景选择JOIN或EXISTS


---

# 二、环境准备


## 数据库


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务模型设计


业务：

客户购买订单分析。


关系：

```
customer

    1

    |

    N

sale_order

    1

    |

    N

order_item
```


---

# 四、创建练习表


## 1. 客户表


```sql
CREATE TABLE customer
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100),
 level VARCHAR(20)
);
```


数据：

```sql
INSERT INTO customer(name,level)
VALUES
('华东科技','A'),
('北方贸易','B'),
('未来数据','A'),
('测试客户','C');
```


---

## 2.订单表


```sql
CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 customer_id BIGINT,
 order_no VARCHAR(50),
 amount DECIMAL(12,2),
 status TINYINT,

 INDEX idx_order_customer(customer_id)
);
```


数据：

```sql
INSERT INTO sale_order
(customer_id,order_no,amount,status)
VALUES

(1,'SO001',120000,2),
(1,'SO002',50000,2),
(2,'SO003',80000,1),
(3,'SO004',30000,2);
```


---

# 五、知识点讲解


# 1. 什么是子查询


子查询：

SQL中嵌套另一个SQL。


例如：

查询购买过订单的客户：


```sql
SELECT *
FROM customer
WHERE id IN
(
 SELECT customer_id
 FROM sale_order
);
```


执行：

第一步：

执行内部SQL：

```sql
SELECT customer_id
FROM sale_order;
```


得到：

```
1
2
3
```


第二步：

执行：

```sql
WHERE id IN(1,2,3)
```


---

# 2. 标量子查询


返回一个值。


例如：

查询超过平均订单金额的订单：


```sql
SELECT *
FROM sale_order
WHERE amount >
(
 SELECT AVG(amount)
 FROM sale_order
);
```


内部：

计算平均金额。


外部：

比较订单金额。


---

# 3. IN子查询


查询存在关系。


案例：

查询有订单客户：


```sql
SELECT *
FROM customer
WHERE id IN
(
 SELECT customer_id
 FROM sale_order
);
```


适合：

结果集较小。


---

# 4. EXISTS


EXISTS判断是否存在数据。


案例：


```sql
SELECT *
FROM customer c
WHERE EXISTS
(
 SELECT 1
 FROM sale_order o
 WHERE c.id=o.customer_id
);
```


执行逻辑：

对于每个客户：

判断是否存在订单。


存在：

返回客户。


---

# 5. EXISTS与IN区别


## IN


流程：

先查询子查询结果。


例如：

```sql
id IN(1,2,3)
```


## EXISTS


流程：

找到匹配立即停止。


适合：

大表。


经验：

小表驱动大表：

IN可以。

大表关联：

优先考虑EXISTS。


---

# 6. NOT EXISTS


查询没有订单客户。


```sql
SELECT *
FROM customer c
WHERE NOT EXISTS
(
 SELECT 1
 FROM sale_order o
 WHERE c.id=o.customer_id
);
```


应用：

- 没购买客户
- 没审批数据用户
- 没权限角色


---

# 六、子查询优化


## 问题SQL


```sql
SELECT *
FROM customer
WHERE id IN
(
 SELECT customer_id
 FROM sale_order
);
```


优化：


```sql
SELECT DISTINCT c.*
FROM customer c
JOIN sale_order o
ON c.id=o.customer_id;
```


原因：

JOIN通常更容易利用索引。


---

# 七、企业案例


## 案例1：查询购买过商品客户


业务：

客户列表只显示有订单客户。


SQL：


```sql
SELECT *
FROM customer c
WHERE EXISTS
(
 SELECT 1
 FROM sale_order o
 WHERE c.id=o.customer_id
);
```


---

## 案例2：查询销售额超过平均值客户


```sql
SELECT
customer_id,
SUM(amount)
FROM sale_order
GROUP BY customer_id
HAVING SUM(amount)>
(
 SELECT AVG(amount)
 FROM sale_order
);
```


---

# 八、练习题


## 练习1

查询所有有订单客户。


要求：

分别使用：

- IN
- EXISTS


---

## 练习2

查询没有订单客户。


要求：

使用：

NOT EXISTS


---

## 练习3

查询金额超过平均订单金额的订单。


---

## 练习4

查询客户累计订单金额。


返回：

客户名称

订单数量

总金额


---

## 练习5（优化）


比较：

IN查询

JOIN查询


使用：

```sql
EXPLAIN
```


分析区别。


---

# 九、Java MyBatis应用


Mapper：


```xml
<select id="customerHasOrder">

SELECT *
FROM customer c

WHERE EXISTS
(
 SELECT 1
 FROM sale_order o
 WHERE c.id=o.customer_id
)

</select>
```


应用：

- 客户筛选
- 权限判断
- 流程查询


---

# 十、性能分析


执行：

```sql
EXPLAIN
SELECT *
FROM customer c
WHERE EXISTS
(
 SELECT 1
 FROM sale_order o
 WHERE c.id=o.customer_id
);
```


关注：

- type
- key
- rows


重点：

关联字段必须有索引：

```sql
customer.id

sale_order.customer_id
```


---

# 十一、面试问题


1. 什么是子查询？

2. EXISTS和IN区别？

3. 什么情况下使用EXISTS？

4. 子查询一定比JOIN慢吗？

5. 如何优化嵌套查询？


---

# 十二、今日总结


掌握：

✅ 子查询

✅ IN

✅ EXISTS

✅ NOT EXISTS

✅ 子查询优化

下一阶段：

Day05：复杂聚合查询与企业报表SQL

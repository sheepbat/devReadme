# SQL进阶 Day05：复杂聚合查询与企业报表SQL（完整版）

## 一、学习目标

Day05进入企业报表SQL阶段。

今天重点掌握：

- GROUP BY高级使用
- HAVING过滤
- 多维度聚合统计
- 条件聚合
- 聚合函数NULL处理
- 销售报表SQL设计


完成后能够：

1. 编写企业统计SQL
2. 设计销售分析报表
3. 处理复杂业务统计需求
4. 分析聚合SQL性能


---

# 二、环境准备


## 1. 创建数据库


```sql
CREATE DATABASE IF NOT EXISTS sql_learning
DEFAULT CHARACTER SET utf8mb4;

USE sql_learning;
```


---

# 三、业务模型设计


模拟销售系统：

```
客户

customer

   |

   |

订单

sale_order

   |

   |

订单明细

sale_order_detail
```


业务需求：

- 客户销售额统计
- 商品销售排行
- 月度销售趋势
- 销售人员排行


---

# 四、创建测试表


## 1.customer客户表


```sql
DROP TABLE IF EXISTS customer;


CREATE TABLE customer
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100),
 level VARCHAR(20),
 create_time DATETIME
);
```


插入数据：

```sql
INSERT INTO customer
(name,level,create_time)
VALUES
('华东科技有限公司','A级','2026-01-01'),
('北方贸易有限公司','B级','2026-01-02'),
('未来数据有限公司','A级','2026-02-01'),
('创新制造有限公司','C级','2026-02-15');
```


---

## 2.sale_order订单表


```sql
CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 customer_id BIGINT,
 order_no VARCHAR(50),
 amount DECIMAL(12,2),
 status TINYINT,
 create_time DATETIME,

 INDEX idx_customer(customer_id),
 INDEX idx_create_time(create_time)
);
```


插入：

```sql
INSERT INTO sale_order
(customer_id,order_no,amount,status,create_time)
VALUES

(1,'SO001',120000,2,'2026-01-05'),

(1,'SO002',50000,2,'2026-01-20'),

(2,'SO003',80000,1,'2026-02-10'),

(3,'SO004',30000,2,'2026-02-15'),

(4,'SO005',10000,3,'2026-03-01');
```


---

# 五、知识点讲解


# 1.GROUP BY基础


作用：

将数据按照指定字段分组。


例如：

统计每个客户订单数量：


```sql
SELECT
customer_id,
COUNT(*) order_count
FROM sale_order
GROUP BY customer_id;
```


执行过程：

```
FROM

↓

GROUP BY

↓

聚合计算

↓

返回结果
```


---

# 2.多个字段GROUP BY


例如：

统计：

客户 + 月份销售额。


```sql
SELECT
customer_id,
MONTH(create_time) month,
SUM(amount)
FROM sale_order
GROUP BY
customer_id,
MONTH(create_time);
```


应用：

销售报表。


---

# 3.HAVING过滤聚合结果


WHERE：

过滤原始数据。


HAVING：

过滤统计结果。


错误：


```sql
SELECT
customer_id,
SUM(amount)
FROM sale_order
WHERE SUM(amount)>100000
GROUP BY customer_id;
```


原因：

WHERE执行时还没有聚合。


正确：


```sql
SELECT
customer_id,
SUM(amount)
FROM sale_order
GROUP BY customer_id
HAVING SUM(amount)>100000;
```


---

# 4.条件聚合


企业报表高频。


需求：

统计：

- 已支付订单数量
- 未支付订单数量


SQL：


```sql
SELECT

COUNT(*) total,

SUM(
CASE
WHEN status=2 THEN 1
ELSE 0
END
) paid_count

FROM sale_order;
```


原理：

CASE产生0/1。

SUM完成统计。


---

# 5.NULL对聚合影响


数据：

```
10000

20000

NULL
```


COUNT：

```sql
COUNT(amount)
```


结果：

2


COUNT(*)：

结果：

3


AVG：

```sql
AVG(amount)
```


忽略NULL。


---

# 六、企业案例


# 案例1：客户销售排行


需求：

查询：

客户名称

销售金额


SQL：

```sql
SELECT
c.name,
SUM(o.amount) total_amount
FROM customer c
JOIN sale_order o
ON c.id=o.customer_id
GROUP BY c.id,c.name
ORDER BY total_amount DESC;
```


---

# 案例2：月销售趋势


需求：

统计每个月销售额。


```sql
SELECT

DATE_FORMAT(create_time,'%Y-%m') month,

SUM(amount)

FROM sale_order

GROUP BY
DATE_FORMAT(create_time,'%Y-%m');
```


---

# 案例3：销售等级统计


规则：

A级客户销售额。


```sql
SELECT
c.level,
SUM(o.amount)
FROM customer c
JOIN sale_order o
ON c.id=o.customer_id
GROUP BY c.level;
```


---

# 七、性能优化


## 1.聚合字段索引


例如：

```sql
CREATE INDEX idx_order_customer_amount
ON sale_order(customer_id,amount);
```


---

## 2.避免大范围GROUP


问题：

千万数据：

```sql
GROUP BY create_time
```


可能：

扫描大量数据。


优化：

增加时间范围：

```sql
WHERE create_time>='2026-01-01'
```


---

# 八、练习题


## 基础


### 1

统计每个客户订单数量。


### 2

统计每个客户销售金额。


### 3

统计订单平均金额。


---

## 进阶


### 4

查询销售金额超过10万客户。


要求：

GROUP BY + HAVING


---

### 5

统计每个月销售额。


---

### 6

统计订单状态：

返回：

- 总订单
- 已支付
- 未支付
- 已关闭


---

## 高级


### 7

查询销售金额Top3客户。


### 8

统计：

客户等级销售贡献。


### 9

生成销售日报表。


---

# 九、Java MyBatis应用


Mapper示例：


```xml
<select id="saleReport">

SELECT

c.name,

SUM(o.amount)

FROM customer c

LEFT JOIN sale_order o

ON c.id=o.customer_id

GROUP BY c.id

</select>
```


返回：

DTO：

```java
class SaleReportDTO{

private String customerName;

private BigDecimal amount;

}
```


应用：

- 首页统计
- 数据大屏
- Excel导出


---

# 十、面试问题


1. WHERE和HAVING区别？

2. COUNT(*)和COUNT字段区别？

3. GROUP BY为什么慢？

4. 如何优化大数据量聚合？

5. 条件聚合如何实现？


---

# 十一、最终实战


完成销售报表：

要求：

查询：

- 客户名称
- 订单数量
- 总销售额
- 平均订单金额
- 最大订单金额


要求：

使用：

- JOIN
- GROUP BY
- HAVING
- ORDER BY


---

# 十二、今日总结


掌握：

✅ GROUP BY

✅ HAVING

✅ 条件聚合

✅ 多维统计

✅ 报表SQL设计


下一章节：

Day06：窗口函数基础

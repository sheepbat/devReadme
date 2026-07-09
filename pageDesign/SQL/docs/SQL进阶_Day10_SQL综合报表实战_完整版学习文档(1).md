# SQL进阶 Day10：SQL综合报表实战（完整版学习文档）

# 一、学习目标

Day10进行综合训练。

将前面学习：

- JOIN
- GROUP BY
- HAVING
- 窗口函数
- 条件聚合

结合到企业报表开发。


目标：

1. 设计销售分析报表SQL
2. 完成多维度统计
3. 处理复杂业务查询
4. 具备企业报表开发能力


---

# 二、环境准备


## 创建数据库


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务场景设计


模拟企业销售管理系统。


报表需求：

## 首页数据大屏


展示：

- 总销售额
- 订单数量
- 客户数量
- 月度趋势


## 销售分析


展示：

- 销售人员排行
- 客户贡献排行
- 产品排行


## 客户分析


展示：

- 新客户
- 活跃客户
- 高价值客户


---

# 四、数据库设计


## 1.customer客户表


```sql
CREATE TABLE customer
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 name VARCHAR(100),

 level VARCHAR(20),

 create_time DATETIME
);
```


数据：


```sql
INSERT INTO customer
(name,level,create_time)

VALUES

('华东科技','A','2026-01-01'),

('北方贸易','B','2026-01-10'),

('未来数据','A','2026-02-01');
```


---

## 2.sale_order订单表


```sql
CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 salesman_id BIGINT,

 order_no VARCHAR(50),

 amount DECIMAL(12,2),

 status TINYINT,

 create_time DATETIME,


INDEX idx_customer(customer_id),

INDEX idx_salesman(salesman_id)

);
```


数据：

```sql
INSERT INTO sale_order
(customer_id,salesman_id,order_no,amount,status,create_time)

VALUES

(1,1,'SO001',10000,2,'2026-01-01'),

(1,1,'SO002',20000,2,'2026-01-10'),

(2,2,'SO003',15000,1,'2026-02-01'),

(3,1,'SO004',50000,2,'2026-02-10');
```


---

# 五、报表SQL设计思想


企业报表通常分三层：


```
基础数据层

↓

统计计算层

↓

展示层
```


SQL负责：

统计计算。


---

# 六、核心知识复习


# 1.聚合统计


例如：

总销售额：


```sql
SELECT

SUM(amount)

FROM sale_order;
```


---

# 2.条件统计


统计：

已支付订单。


```sql
SELECT

SUM(
CASE
WHEN status=2 THEN amount
ELSE 0
END
)

FROM sale_order;
```


---

# 3.多表统计


客户销售额：


```sql
SELECT

c.name,

SUM(o.amount)

FROM customer c

JOIN sale_order o

ON c.id=o.customer_id

GROUP BY c.id;
```


---

# 七、企业报表案例


# 案例1：首页销售指标


需求：

返回：

- 总订单数
- 总销售额
- 已支付金额


SQL：

```sql
SELECT

COUNT(*) order_count,

SUM(amount) total_amount,


SUM(
CASE
WHEN status=2
THEN amount
ELSE 0
END
) paid_amount


FROM sale_order;
```


---

# 案例2：客户贡献排行


需求：

TOP10客户。


```sql
SELECT

c.name,

SUM(o.amount) total_amount


FROM customer c

JOIN sale_order o

ON c.id=o.customer_id


GROUP BY c.id

ORDER BY total_amount DESC

LIMIT 10;
```


---

# 案例3：销售人员排行


```sql
SELECT

salesman_id,

SUM(amount) amount,


RANK()
OVER(
ORDER BY SUM(amount) DESC
) rank_no


FROM sale_order

GROUP BY salesman_id;
```


---

# 案例4：月度销售趋势


```sql
SELECT

DATE_FORMAT(create_time,'%Y-%m') month,

SUM(amount)

FROM sale_order

GROUP BY month

ORDER BY month;
```


---

# 八、复杂报表优化


## 问题


大报表：

百万订单。


直接：

JOIN + GROUP BY


可能慢。


---

## 优化方式


### 1.增加索引


例如：

```sql
CREATE INDEX idx_time_status

ON sale_order(create_time,status);
```


---

### 2.减少统计范围


不要：

全表统计。


增加：

时间条件。


---

### 3.预计算


例如：

每日销售汇总表。


```
sale_daily_report
```


---

# 九、MyBatis报表开发


Mapper：


```xml
<select id="saleDashboard">


SELECT

COUNT(*) orderCount,

SUM(amount) amount


FROM sale_order


</select>
```


DTO：


```java
class DashboardDTO{

private Integer orderCount;

private BigDecimal amount;

}
```


应用：

- 首页大屏
- 数据导出
- 管理报表


---

# 十、练习题


## 基础


1. 查询订单总数。


2. 查询销售总额。


3. 查询已支付金额。


---

## 进阶


4. 查询客户销售排行。


5. 查询月销售趋势。


6. 查询销售人员排行。


---

## 高级


7. 制作销售Dashboard SQL。


8. 查询连续增长客户。


9. 设计日报表SQL。


10. 优化百万订单统计。


---

# 十一、面试问题


1. 为什么GROUP BY可能慢？

2. 大数据报表如何优化？

3. 为什么需要汇总表？

4. 窗口函数适合什么场景？

5. 如何设计销售统计SQL？


---

# 十二、最终实战任务


设计企业销售分析报表。


要求输出：

## 指标

- 总销售额
- 订单数量
- 客户数量


## 排名

- 客户TOP10
- 销售人员TOP10


## 趋势

- 月销售趋势


要求：

结合：

JOIN

GROUP BY

窗口函数

索引优化


---

# 十三、总结


Day05-Day10完成：

✅ 聚合查询

✅ 窗口函数

✅ CTE

✅ 分页优化

✅ 企业报表SQL


下一阶段：

Day11：MySQL架构原理

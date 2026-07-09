# SQL进阶 Day07：窗口函数进阶（完整版学习文档）

# 一、学习目标

Day07继续深入窗口函数。

重点掌握：

- SUM() OVER()
- AVG() OVER()
- LAG()
- LEAD()
- 累计统计
- 环比分析
- 同比分析
- 分组趋势分析


完成后能够：

1. 编写数据分析SQL
2. 实现销售趋势分析
3. 完成企业报表统计需求
4. 使用窗口函数替代复杂子查询


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务模型


销售分析场景：

```
customer

客户

   |

sale_order

订单

   |

sale_order_detail

明细
```


分析需求：

- 每月销售额
- 累计销售额
- 月增长率
- 客户消费趋势


---

# 四、创建测试表


## 订单表


```sql
DROP TABLE IF EXISTS sale_order;


CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 order_no VARCHAR(50),

 amount DECIMAL(12,2),

 create_time DATE,

 INDEX idx_create_time(create_time)
);
```


插入数据：

```sql
INSERT INTO sale_order
(customer_id,order_no,amount,create_time)
VALUES

(1,'SO001',10000,'2026-01-10'),

(1,'SO002',15000,'2026-02-10'),

(1,'SO003',20000,'2026-03-10'),

(2,'SO004',8000,'2026-01-15'),

(2,'SO005',12000,'2026-02-15'),

(3,'SO006',30000,'2026-03-20');
```


---

# 五、知识点详细讲解


# 1.累计求和


普通SUM：

```sql
SELECT
SUM(amount)
FROM sale_order;
```


结果：

只有一个汇总值。


窗口函数：


```sql
SELECT

order_no,

amount,


SUM(amount)
OVER(
ORDER BY create_time
) total_amount


FROM sale_order;
```


结果：

每一行都有累计金额。


执行：

```
第1条订单

10000


第2条订单

25000


第3条订单

45000
```


---

# 2.PARTITION BY累计


需求：

每个客户分别累计消费。


SQL：

```sql
SELECT

customer_id,

order_no,

amount,


SUM(amount)
OVER(
PARTITION BY customer_id
ORDER BY create_time
)

FROM sale_order;
```


效果：

客户之间互不影响。


---

# 3.AVG窗口统计


查询：

订单金额与平均订单比较。


```sql
SELECT

order_no,

amount,


AVG(amount)
OVER()

FROM sale_order;
```


---

# 4.LAG函数


作用：

获取上一行数据。


案例：

计算销售环比。


```sql
SELECT

create_time,

amount,


LAG(amount)
OVER(
ORDER BY create_time
) last_amount


FROM sale_order;
```


结果：

当前销售额

上一期销售额


---

# 5.LEAD函数


作用：

获取下一行数据。


例如：

预测下一月份数据。


```sql
SELECT

create_time,

amount,


LEAD(amount)
OVER(
ORDER BY create_time
)

FROM sale_order;
```


---

# 六、企业案例


# 案例1：月销售趋势


需求：

统计每月销售额。


SQL：


```sql
SELECT

DATE_FORMAT(create_time,'%Y-%m') month,

SUM(amount) amount

FROM sale_order

GROUP BY month;
```


然后计算增长：


```sql
SELECT

month,

amount,


amount -
LAG(amount)
OVER(
ORDER BY month
)

growth

FROM monthly_sales;
```


---

# 案例2：客户消费趋势


需求：

查看客户累计消费。


```sql
SELECT

customer_id,

create_time,

amount,


SUM(amount)
OVER(
PARTITION BY customer_id
ORDER BY create_time
)

FROM sale_order;
```


---

# 案例3：同比环比


环比：

当前月份和上个月比较。


同比：

当前月份和去年同期比较。


常用：

```sql
LAG()
```


---

# 七、窗口函数优化


## 1.减少计算数据


错误：

```sql
SELECT *
FROM sale_order;
```


优化：

```sql
WHERE create_time>='2026-01-01'
```


---

## 2.排序字段索引


窗口：

```sql
ORDER BY create_time
```


建议：

```sql
CREATE INDEX idx_time
ON sale_order(create_time);
```


---

# 八、练习题


## 基础


1. 查询订单累计金额。


2. 查询每个客户累计消费。


3. 查询订单平均金额。


---

## 进阶


4. 查询每月销售额。


5. 计算销售环比。


6. 查询客户消费增长。


---

## 高级


7. 制作销售趋势报表。


8. 查询连续增长客户。


9. 查询最近一次订单与上一次订单差值。


---

# 九、Java + MyBatis应用


场景：

销售趋势图。


Mapper：

```xml
<select id="saleTrend">

SELECT

month,

amount,

growth

FROM sale_report

</select>
```


返回：

```java
class SaleTrendDTO{

private String month;

private BigDecimal amount;

private BigDecimal growth;

}
```


---

# 十、面试问题


1. SUM OVER和GROUP BY区别？

2. LAG有什么作用？

3. 如何计算环比？

4. 窗口函数为什么可能慢？

5. 如何优化窗口查询？


---

# 十一、最终实战


完成销售分析报表：

返回：

- 月份
- 销售额
- 累计销售额
- 环比增长率


要求：

使用：

- GROUP BY
- WINDOW FUNCTION
- LAG


---

# 十二、总结


掌握：

✅ SUM OVER

✅ AVG OVER

✅ LAG

✅ LEAD

✅ 累计统计

✅ 环比分析

下一章节：

Day08：CTE与递归查询

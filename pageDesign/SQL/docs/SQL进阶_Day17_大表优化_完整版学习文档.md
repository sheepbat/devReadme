# SQL进阶 Day17：大表优化（完整版学习文档）

# 一、学习目标

Day17学习生产环境大数据量表优化。

重点掌握：

- 什么是大表
- 大表性能问题
- 数据归档
- 热冷数据分离
- 分区表
- 大表索引设计
- 分页优化
- 历史数据处理


完成后能够：

1. 设计千万级数据表优化方案
2. 处理历史业务数据
3. 优化大表查询性能
4. 制定数据生命周期策略


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、大表业务场景


模拟：

企业订单系统。


订单表：

```
sale_order
```


随着业务增长：

第一年：

100万


第三年：

5000万


问题：

- 查询慢
- 索引膨胀
- 写入压力增加
- 数据备份慢


---

# 四、创建订单表


```sql
DROP TABLE IF EXISTS sale_order;


CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_no VARCHAR(50),

 customer_id BIGINT,

 status TINYINT,

 amount DECIMAL(12,2),

 create_time DATETIME,


 INDEX idx_customer(customer_id),

 INDEX idx_time(create_time)

);
```


---

# 五、知识点详细讲解


# 1.什么是大表


没有固定标准。


通常：

- 百万级开始关注
- 千万级需要优化
- 亿级需要架构设计


影响因素：

- 数据量
- 查询频率
- 写入压力
- 索引数量


---

# 2.大表常见问题


## 查询慢


原因：

扫描数据过多。


例如：

```sql
SELECT *

FROM sale_order;
```


---

## 索引变大


索引占用：

- 内存
- 磁盘


---

## 删除历史数据慢


例如：

```sql
DELETE

FROM sale_order

WHERE create_time<'2020-01-01';
```


大量删除：

影响事务。


---

# 六、数据归档


## 什么是归档


把历史数据移动到历史表。


例如：


当前：

```
sale_order
```


历史：

```
sale_order_history
```


---

## 创建历史表


```sql
CREATE TABLE sale_order_history LIKE sale_order;
```


迁移：


```sql
INSERT INTO sale_order_history

SELECT *

FROM sale_order

WHERE create_time<'2025-01-01';
```


删除：


```sql
DELETE

FROM sale_order

WHERE create_time<'2025-01-01';
```


---

# 七、热冷数据分离


业务数据分：

## 热数据


最近访问。


例如：

最近3个月订单。


## 冷数据


历史订单。


例如：

三年前订单。


方案：

冷热分库。


---

# 八、分区表


作用：

把一个大表拆分。


例如：

按年份。


```sql
PARTITION BY RANGE(YEAR(create_time))
```


优势：

减少扫描范围。


---

# 九、大表索引设计


原则：


## 1.控制索引数量


原因：

写入需要维护索引。


---

## 2.选择高频查询字段


例如：

订单：

customer_id

create_time


---

## 3.避免大字段索引


例如：

TEXT字段。


---

# 十、分页优化


大表禁止：

```sql
LIMIT 1000000,20;
```


推荐：

游标分页。


```sql
WHERE id < last_id

ORDER BY id DESC

LIMIT 20;
```


---

# 十一、企业案例


# 案例1：订单表5000万数据


问题：

后台订单查询慢。


优化：

1. 增加时间索引。

2. 历史数据归档。

3. 使用游标分页。


---

# 案例2：交易流水表


特点：

只增加，不修改。


方案：

按月分区。


---

# 十二、MyBatis应用


历史订单查询：


```xml
<select id="historyOrder">


SELECT *

FROM sale_order_history

WHERE customer_id=#{id}


</select>
```


注意：

不要查询主业务大表。


---

# 十三、练习题


## 基础


1. 什么是大表？

2. 大表为什么慢？


---

## 进阶


3. 设计订单归档方案。

4. 设计冷热数据方案。

5. 优化百万订单分页。


---

## 高级


6. 设计千万订单表。

7. 设计分区策略。

8. 输出大表优化方案。


---

# 十四、面试问题


1. 多少数据算大表？

2. 大表为什么需要归档？

3. 分区表解决什么问题？

4. 大表如何分页？

5. 历史数据如何处理？


---

# 十五、最终实战任务


设计：

电商订单系统。


要求：

支持：

- 亿级订单
- 查询最近订单
- 历史订单查询
- 数据归档


输出：

数据库优化方案。


---

# 十六、总结


掌握：

✅ 大表问题

✅ 数据归档

✅ 热冷分离

✅ 分区设计

✅ 大表索引


下一章节：

Day18：事务基础

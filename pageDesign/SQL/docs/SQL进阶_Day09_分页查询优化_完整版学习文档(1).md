# SQL进阶 Day09：分页查询优化（完整版学习文档）

# 一、学习目标

Day09学习企业系统中高频场景：

列表分页查询。

重点掌握：

- LIMIT分页原理
- OFFSET深分页问题
- 主键游标分页
- 时间游标分页
- 分页索引设计
- 大数据量列表优化


完成后能够：

1. 设计高性能分页SQL
2. 分析分页慢查询原因
3. 优化百万级数据列表
4. 结合MyBatis实现高效分页


---

# 二、环境准备


## 创建数据库


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务模型设计


模拟企业订单列表：


```
客户

customer


订单

sale_order


订单明细

order_item
```


业务：

后台订单列表：

- 分页
- 搜索
- 排序
- 筛选


---

# 四、创建订单表


```sql
DROP TABLE IF EXISTS sale_order;


CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_no VARCHAR(50),

 customer_id BIGINT,

 amount DECIMAL(12,2),

 status TINYINT,

 create_time DATETIME,


 INDEX idx_create_time(create_time),

 INDEX idx_status_time(status,create_time)

);
```


---

# 五、插入测试数据


```sql
INSERT INTO sale_order
(order_no,customer_id,amount,status,create_time)
VALUES

('SO001',1,10000,1,'2026-01-01'),

('SO002',2,20000,2,'2026-01-02'),

('SO003',3,30000,2,'2026-01-03'),

('SO004',4,40000,1,'2026-01-04');
```


实际生产：

通常：

百万级订单。


---

# 六、知识点详细讲解


# 1.普通LIMIT分页


语法：


```sql
SELECT *

FROM sale_order

LIMIT 0,20;
```


含义：

跳过0条。

取20条。


第二页：

```sql
LIMIT 20,20;
```


---

# 2.LIMIT执行问题


例如：

```sql
LIMIT 100000,20;
```


看似：

只需要20条。


实际：

MySQL需要：

```
扫描100020条

丢弃100000条

返回20条
```


问题：

offset越大：

越慢。


---

# 七、深分页优化


# 方法1：记录ID分页


传统：


```sql
LIMIT 100000,20
```


优化：


第一次：

```sql
SELECT *

FROM sale_order

ORDER BY id

LIMIT 20;
```


下一页：


```sql
SELECT *

FROM sale_order

WHERE id>100020

ORDER BY id

LIMIT 20;
```


优点：

利用主键索引。


---

# 方法2：时间游标分页


适合：

时间列表。


SQL：

```sql
SELECT *

FROM sale_order

WHERE create_time<'2026-01-01'

ORDER BY create_time DESC

LIMIT 20;
```


应用：

消息列表。

订单列表。


---

# 八、企业案例


# 案例1：订单后台列表


需求：

查询：

- 订单编号
- 金额
- 状态
- 创建时间


SQL：


```sql
SELECT

order_no,

amount,

status,

create_time

FROM sale_order

ORDER BY create_time DESC

LIMIT 20;
```


---

# 案例2：带条件分页


需求：

查询已支付订单。


```sql
SELECT *

FROM sale_order

WHERE status=2

ORDER BY create_time DESC

LIMIT 20;
```


索引：

```sql
(status,create_time)
```


---

# 案例3：分页+JOIN


问题：

订单关联客户。


不要：

先JOIN全部数据再分页。


推荐：

先分页主表。


例如：

```sql
SELECT *

FROM

(

SELECT id

FROM sale_order

ORDER BY id

LIMIT 20

)t

JOIN sale_order o

ON t.id=o.id;
```


---

# 九、分页性能优化


## 1.必须有排序索引


如果：

```sql
ORDER BY create_time
```


建立：

```sql
CREATE INDEX idx_time
ON sale_order(create_time);
```


---

## 2.避免SELECT *


错误：

```sql
SELECT *

FROM sale_order;
```


原因：

增加IO。


---

## 3.合理限制最大页数


例如：

禁止：

查询第10000页。


---

# 十、MyBatis应用


## 普通分页


```xml
<select id="pageList">


SELECT

*

FROM sale_order

ORDER BY create_time DESC

LIMIT #{offset},#{size}


</select>
```


问题：

深分页慢。


---

## 游标分页


```xml
<select id="cursorPage">


SELECT *

FROM sale_order

WHERE id &lt; #{lastId}

ORDER BY id DESC

LIMIT #{size}


</select>
```


适合：

大数据列表。


---

# 十一、练习题


## 基础


1. 实现订单分页查询。


2. 实现客户分页查询。


3. 实现时间倒序分页。


---

## 进阶


4. 优化LIMIT 100000分页。


5. 使用主键游标分页。


6. 设计订单列表索引。


---

## 高级


7. 设计百万订单分页方案。


8. 对比LIMIT和游标分页EXPLAIN。


9. 优化订单+客户分页查询。


---

# 十二、面试问题


1. 为什么LIMIT深分页慢？

2. 如何优化大数据分页？

3. 什么是游标分页？

4. 为什么分页需要排序索引？

5. MyBatis分页插件有什么问题？


---

# 十三、最终实战任务


设计：

企业订单管理列表。


要求：

支持：

- 条件查询
- 排序
- 分页
- 百万数据访问


输出：

SQL + 索引设计方案。


---

# 十四、总结


掌握：

✅ LIMIT分页

✅ 深分页问题

✅ ID游标分页

✅ 时间分页

✅ 分页索引优化


下一章节：

Day10：SQL综合报表实战

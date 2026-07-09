# SQL进阶 Day13：联合索引设计（完整版学习文档）

# 一、学习目标

Day13深入学习企业SQL优化核心。

重点：

- 什么是联合索引
- 联合索引结构
- 最左匹配原则
- 索引字段顺序设计
- 覆盖索引
- 回表问题
- 索引下推


完成后能够：

1. 根据业务SQL设计联合索引
2. 判断索引是否生效
3. 优化多条件查询
4. 分析EXPLAIN执行计划


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务场景设计


模拟订单管理系统。


查询需求：

1. 根据客户查询订单

2. 根据客户+状态查询

3. 根据状态+时间查询

4. 根据时间排序


数据量：

生产：

千万级订单。


---

# 四、创建订单表


```sql
DROP TABLE IF EXISTS sale_order;


CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 status TINYINT,

 amount DECIMAL(12,2),

 create_time DATETIME,

 order_no VARCHAR(50)

);
```


插入测试数据：


```sql
INSERT INTO sale_order
(customer_id,status,amount,create_time,order_no)

VALUES

(1,1,1000,'2026-01-01','SO001'),

(1,2,2000,'2026-01-02','SO002'),

(2,1,3000,'2026-01-03','SO003');
```


---

# 五、知识点详细讲解


# 1.什么是联合索引


联合索引：

多个字段组成一个索引。


例如：


```sql
CREATE INDEX idx_customer_status

ON sale_order(customer_id,status);
```


结构：

```
customer_id

    |

 status

    |

 数据地址
```


---

# 2.为什么需要联合索引


查询：


```sql
SELECT *

FROM sale_order

WHERE customer_id=1

AND status=2;
```


单字段索引：

需要多个判断。


联合索引：

一次定位。


---

# 3.最左匹配原则


索引：

```sql
(customer_id,status,create_time)
```


有效：

```sql
WHERE customer_id=1
```


有效：

```sql
WHERE customer_id=1

AND status=2
```


有效：

```sql
WHERE customer_id=1

AND status=2

AND create_time>'2026-01-01'
```


无效：

```sql
WHERE status=2
```


原因：

跳过第一个字段。


---

# 4.字段顺序设计


原则：

高频查询字段放前面。


例如：

经常：

```sql
WHERE customer_id=?

AND status=?
```


设计：

```sql
(customer_id,status)
```


---

# 5.覆盖索引


概念：

查询字段全部存在索引中。


例如：


索引：

```sql
(customer_id,status)
```


SQL：

```sql
SELECT

customer_id,

status

FROM sale_order;
```


不需要回表。


---

# 6.回表问题


普通索引：

找到索引数据。


然后：

根据主键查询完整数据。


过程：


```
普通索引

↓

主键ID

↓

聚簇索引

↓

数据
```


这叫：

回表。


---

# 六、企业案例


# 案例1：订单列表


SQL：

```sql
SELECT *

FROM sale_order

WHERE customer_id=100

AND status=2

ORDER BY create_time DESC;
```


推荐索引：


```sql
CREATE INDEX idx_order_query

ON sale_order
(customer_id,status,create_time);
```


---

# 案例2：分页查询优化


SQL：


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

# 七、EXPLAIN分析


执行：


```sql
EXPLAIN

SELECT *

FROM sale_order

WHERE customer_id=1

AND status=2;
```


关注：

## key

是否使用联合索引。


## rows

扫描数量。


---

# 八、索引下推


ICP：

Index Condition Pushdown。


作用：

减少回表。


例如：

```sql
WHERE name LIKE '张%'

AND age=20;
```


索引阶段提前过滤。


---

# 九、索引设计原则


## 1.避免重复索引


已有：

```sql
(a,b)
```


通常不需要：

```sql
(a)
```


---

## 2.区分度


优先：

用户ID

订单号


不优先：

性别。


---

## 3.控制索引数量


索引：

提高查询。


但是：

降低写入。


---

# 十、Java + MyBatis应用


订单列表：


```xml
<select id="pageOrder">


SELECT *

FROM sale_order

WHERE customer_id=#{customerId}

AND status=#{status}

ORDER BY create_time DESC


</select>
```


对应索引：

(customer_id,status,create_time)


---

# 十一、练习题


## 基础


1. 创建联合索引。


2. 判断SQL是否命中索引。


3. 使用EXPLAIN分析。


---

## 进阶


4. 设计订单查询索引。


5. 优化客户列表SQL。


6. 分析字段顺序。


---

## 高级


7. 设计千万订单索引方案。


8. 判断覆盖索引场景。


9. 优化分页查询。


---

# 十二、面试问题


1. 什么是联合索引？

2. 最左匹配为什么存在？

3. 为什么字段顺序重要？

4. 什么是覆盖索引？

5. 什么是回表？


---

# 十三、最终实战任务


设计：

销售订单查询模块索引。


支持：

- 客户查询
- 状态筛选
- 时间排序
- 分页


输出：

SQL + 索引方案 + EXPLAIN分析。


---

# 十四、总结


掌握：

✅ 联合索引

✅ 最左匹配

✅ 覆盖索引

✅ 回表

✅ 索引下推


下一章节：

Day14：索引失效分析

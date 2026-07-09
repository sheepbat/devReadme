# SQL进阶 Day40：SQL综合项目实战（完整版学习文档）

# 一、学习目标

Day40通过完整项目综合应用前39天知识。

项目：

企业订单交易系统。


重点掌握：

- 需求分析
- 数据库设计
- 表结构设计
- 索引规划
- SQL开发
- 查询优化
- 事务设计
- 缓存结合
- 性能优化


完成后能够：

1. 独立完成数据库项目设计
2. 根据业务设计表结构
3. 编写复杂业务SQL
4. 输出数据库技术方案


---

# 二、项目背景


企业电商平台。


业务：

用户购买商品。


流程：

```
用户

↓

商品浏览

↓

创建订单

↓

支付

↓

库存扣减

↓

订单完成
```


---

# 三、需求分析


核心功能：

## 用户管理


保存：

- 用户信息
- 登录信息


---

## 商品管理


保存：

- 商品
- 分类
- 库存


---

## 订单管理


保存：

- 订单
- 明细
- 状态


---

## 支付管理


保存：

- 支付记录


---

# 四、数据库设计


数据库：

```sql
CREATE DATABASE ecommerce;
```


核心表：


```
user

product

product_stock

orders

order_item

payment
```


---

# 五、用户表设计


```sql
CREATE TABLE user
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 username VARCHAR(50),

 phone VARCHAR(20),

 create_time DATETIME
);
```


---

# 六、商品表设计


```sql
CREATE TABLE product
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 name VARCHAR(100),

 price DECIMAL(10,2),

 status TINYINT
);
```


---

# 七、库存表设计


```sql
CREATE TABLE product_stock
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 product_id BIGINT,

 stock INT,

 version INT
);
```


---

# 八、订单表设计


```sql
CREATE TABLE orders
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_no VARCHAR(50),

 user_id BIGINT,

 status TINYINT,

 amount DECIMAL(12,2),

 create_time DATETIME
);
```


---

# 九、订单明细表


```sql
CREATE TABLE order_item
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_id BIGINT,

 product_id BIGINT,

 quantity INT,

 price DECIMAL(10,2)
);
```


---

# 十、索引规划


用户查询：

```sql
(username)
```


订单查询：

```sql
(user_id,create_time)
```


库存查询：

```sql
(product_id)
```


---

# 十一、业务SQL开发


## 查询用户订单


```sql
SELECT

o.order_no,

o.amount


FROM orders o

WHERE o.user_id=100;
```


---

## 查询订单金额统计


```sql
SELECT

user_id,

SUM(amount)

FROM orders

GROUP BY user_id;
```


---

# 十二、订单支付事务


流程：


```
订单状态更新

↓

库存扣减

↓

支付记录
```


使用：

事务。


---

# 十三、库存扣减优化


悲观锁：


```sql
SELECT *

FROM product_stock

WHERE product_id=1

FOR UPDATE;
```


乐观锁：


```sql
UPDATE product_stock

SET stock=stock-1,

version=version+1

WHERE product_id=1

AND version=1;
```


---

# 十四、缓存设计


热点：

商品详情。


缓存：


```
product:1001
```


流程：

```
Redis

↓

MySQL
```


---

# 十五、性能优化


优化：

## SQL


避免：

SELECT *


---

## 索引


建立：

联合索引。


---

## 分页


使用：

游标分页。


---

# 十六、项目架构


```
用户服务

商品服务

订单服务

支付服务


↓

MySQL

↓

Redis

↓

MQ
```


---

# 十七、练习任务


完成：

1. 设计ER图。

2. 创建全部表。

3. 插入测试数据。

4. 编写订单SQL。

5. 优化查询。


---

# 十八、面试问题


1. 如何设计订单表？

2. 如何保证库存一致？

3. 如何优化订单查询？

4. 如何设计索引？

5. 如何处理高并发订单？


---

# 十九、最终项目任务


完成：

企业订单系统数据库设计。


输出：

- ER模型
- SQL脚本
- 索引方案
- 性能优化方案
- 事务方案


---

# 二十、Day05-Day40阶段总结


已经掌握：


SQL：

✅ 高级查询

✅ 优化


数据库：

✅ 设计

✅ 架构

✅ 运维


分布式：

✅ 缓存

✅ MQ

✅ 事务


下一阶段：

Day41：数据库高级项目实战

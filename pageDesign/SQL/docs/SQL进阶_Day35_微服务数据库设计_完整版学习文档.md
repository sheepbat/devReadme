# SQL进阶 Day35：微服务数据库设计（完整版学习文档）

# 一、学习目标

Day35学习微服务架构下数据库设计。

重点掌握：

- 微服务数据库拆分原则
- 每服务独立数据库
- 数据边界设计
- 聚合根设计
- 数据同步方案
- 分库思想
- 服务间数据访问
- 订单系统微服务数据库案例


完成后能够：

1. 根据微服务拆分数据库
2. 避免跨服务直接访问数据库
3. 设计服务数据边界
4. 解决服务间数据同步问题


---

# 二、环境准备


学习环境：

- MySQL
- 微服务架构思想


创建示例数据库：


```sql
CREATE DATABASE order_service;

CREATE DATABASE stock_service;

CREATE DATABASE user_service;
```


---

# 三、为什么微服务需要独立数据库


单体：

```
应用

↓

一个数据库
```


优点：

简单。


缺点：

服务耦合。


---

微服务：

```
订单服务

↓

订单数据库


库存服务

↓

库存数据库
```


每个服务：

管理自己的数据。


---

# 四、微服务数据库拆分原则


## 原则1：业务边界拆分


例如：


订单：

负责订单。


库存：

负责库存。


---

## 原则2：数据库独立


禁止：

订单服务直接查询库存表。


---

## 原则3：通过接口通信


服务之间：

API。

MQ。


---

# 五、DDD聚合设计


DDD：

领域驱动设计。


核心概念：

聚合。


例如订单：


```
订单

 |

订单明细

 |

支付信息
```


作为一个业务整体。


---

# 六、订单服务数据库设计


数据库：

order_service。


订单表：


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

订单明细：


```sql
CREATE TABLE order_item
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_id BIGINT,

 product_id BIGINT,

 quantity INT
);
```


---

# 七、库存服务数据库设计


数据库：

stock_service。


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

# 八、用户服务数据库设计


数据库：

user_service。


```sql
CREATE TABLE user
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 username VARCHAR(50),

 phone VARCHAR(20)
);
```


---

# 九、知识点详细讲解


# 1.为什么不能跨库查询


错误：

订单服务：

直接JOIN库存数据库。


问题：

- 强耦合
- 无法独立部署
- 数据库压力集中


---

# 2.服务数据同步


方式：


## API同步


订单调用库存接口。


适合：

实时场景。


---

## MQ异步同步


例如：

订单创建事件。


库存消费。


适合：

最终一致。


---

# 十、数据冗余设计


微服务允许：

适当冗余。


例如：

订单保存：

```
商品名称

商品价格
```


原因：

历史数据保持。


---

# 十一、分库思想


当单库压力过大：


拆分：

```
订单库

库存库

用户库
```


进一步：

订单分片。


---

# 十二、企业案例


## 电商系统


服务：


```
用户服务

商品服务

库存服务

订单服务

支付服务
```


数据库：


每个服务独立。


---

# 十三、MyBatis应用


每个服务：

自己的Mapper。


例如：

订单服务：


```xml
SELECT *

FROM orders

WHERE id=#{id}
```


不能访问：

stock_service。


---

# 十四、练习题


## 基础


1. 为什么微服务需要独立数据库？

2. 什么是数据边界？


---

## 进阶


3. 拆分电商数据库。

4. 设计订单服务。


---

## 高级


5. 设计大型交易系统。

6. 设计数据同步方案。


---

# 十五、面试问题


1. 微服务为什么数据库独立？

2. 服务之间如何共享数据？

3. 什么是DDD聚合？

4. 什么情况下需要数据冗余？

5. 如何保证最终一致？


---

# 十六、最终实战任务


设计：

大型电商微服务数据库。


要求：

包含：

- 用户服务
- 商品服务
- 库存服务
- 订单服务
- 支付服务


输出：

数据库拆分方案。


---

# 十七、总结


掌握：

✅ 微服务数据库拆分

✅ 数据边界

✅ DDD思想

✅ 数据同步

✅ 分库思想


下一章节：

Day36：分库分表设计

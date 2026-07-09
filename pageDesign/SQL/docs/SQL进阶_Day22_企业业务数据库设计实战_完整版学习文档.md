# SQL进阶 Day22：企业业务数据库设计实战（完整版学习文档）

# 一、学习目标

Day22进入真实企业项目数据库设计。

以CRM销售系统为案例。

重点掌握：

- 企业业务分析
- 数据模型设计
- 客户模型
- 商机模型
- 跟进记录模型
- 订单模型
- 合同模型
- 表关系设计
- 索引规划


完成后能够：

1. 根据业务设计数据库
2. 拆分核心业务表
3. 建立合理关联关系
4. 设计企业级业务模型


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS crm_learning;

USE crm_learning;
```


---

# 三、CRM业务分析


企业销售流程：


```
客户线索

↓

客户

↓

商机

↓

报价

↓

订单

↓

合同

↓

回款
```


核心对象：

- 客户
- 联系人
- 销售人员
- 商机
- 订单
- 合同


---

# 四、数据库整体设计


核心表：


```
customer

customer_contact

sales_opportunity

follow_record

sale_order

contract
```


关系：


```
customer

  |

  |---contact


customer

  |

  |---opportunity


opportunity

  |

  |---order


order

  |

  |---contract

```


---

# 五、客户表设计


```sql
CREATE TABLE customer
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_name VARCHAR(100),

 level TINYINT,

 owner_id BIGINT,

 status TINYINT,

 create_time DATETIME,


 INDEX idx_owner(owner_id)

);
```


字段说明：

|字段|说明|
|-|-|
|id|客户ID|
|customer_name|客户名称|
|level|客户等级|
|owner_id|负责人|
|status|状态|


---

# 六、联系人表


```sql
CREATE TABLE customer_contact
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 name VARCHAR(50),

 phone VARCHAR(20),

 email VARCHAR(100),


 INDEX idx_customer(customer_id)

);
```


关系：

一个客户：

多个联系人。


---

# 七、商机表设计


```sql
CREATE TABLE sales_opportunity
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 name VARCHAR(100),

 amount DECIMAL(12,2),

 stage TINYINT,

 owner_id BIGINT,


 INDEX idx_customer(customer_id)

);
```


阶段：

```
1 初始

2 沟通

3 报价

4 成交

5 丢失
```


---

# 八、跟进记录设计


```sql
CREATE TABLE follow_record
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 content TEXT,

 follow_user BIGINT,

 follow_time DATETIME,


 INDEX idx_customer_time(customer_id,follow_time)

);
```


用途：

记录：

- 电话
- 拜访
- 邮件
- 沟通结果


---

# 九、订单设计


```sql
CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 order_no VARCHAR(50),

 amount DECIMAL(12,2),

 status TINYINT,

 create_time DATETIME,


 UNIQUE KEY uk_order_no(order_no)

);
```


---

# 十、合同设计


```sql
CREATE TABLE contract
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_id BIGINT,

 contract_no VARCHAR(50),

 amount DECIMAL(12,2),

 sign_time DATETIME

);
```


---

# 十一、知识点详细讲解


# 1.为什么拆表


错误：

客户表保存：

```
客户

联系人1

联系人2

订单1

订单2
```


问题：

数据重复。


正确：

独立表。


---

# 2.一对多设计


例如：

客户：

联系人。


实现：

联系人保存：

customer_id。


---

# 3.状态字段设计


推荐：


```sql
status TINYINT
```


原因：

查询快。


---

# 4.金额设计


必须：

```sql
DECIMAL
```


避免：

float精度问题。


---

# 十二、业务查询案例


## 查询客户订单金额


```sql
SELECT

c.customer_name,

SUM(o.amount)


FROM customer c

JOIN sale_order o

ON c.id=o.customer_id


GROUP BY c.id;
```


---

## 查询客户最近跟进


```sql
SELECT *

FROM follow_record

WHERE customer_id=1

ORDER BY follow_time DESC

LIMIT 1;
```


---

# 十三、索引设计


客户查询：

```sql
(owner_id,status)
```


跟进查询：

```sql
(customer_id,follow_time)
```


订单查询：

```sql
(customer_id,create_time)
```


---

# 十四、Java + MyBatis应用


客户详情接口：


```
CustomerController

↓

CustomerService

↓

CustomerMapper

↓

customer表
```


DTO：

```java
class CustomerDetailDTO{

Customer customer;

List<Contact> contacts;

List<Order> orders;

}
```


---

# 十五、练习题


## 基础


1. 设计用户管理系统。

2. 设计客户表。


---

## 进阶


3. 设计CRM核心表。

4. 设计客户订单关系。


---

## 高级


5. 设计销售管理数据库。

6. 设计索引方案。


---

# 十六、面试问题


1. 为什么需要数据库建模？

2. 一对多如何设计？

3. 如何避免数据冗余？

4. 为什么金额使用DECIMAL？

5. 状态字段如何设计？


---

# 十七、最终实战任务


设计：

企业销售管理数据库。


包含：

- 客户
- 联系人
- 商机
- 跟进
- 订单
- 合同


输出：

ER关系图 + SQL设计。


---

# 十八、总结


掌握：

✅ 企业业务建模

✅ CRM数据库设计

✅ 表关系设计

✅ 字段设计

✅ 索引规划


下一章节：

Day23：权限系统数据库设计

# SQL进阶 Day21：数据库设计基础（完整版学习文档）

# 一、学习目标

Day21进入数据库设计阶段。

前20天重点：

- SQL编写
- SQL优化
- MySQL原理
- 事务并发


Day21开始学习：

如何设计一个企业级数据库。


重点掌握：

- 数据库设计流程
- 业务建模
- ER模型
- 三大范式
- 反范式设计
- 主键设计
- 字段设计规范
- 索引规划


完成后能够：

1. 根据业务设计数据库
2. 判断表结构是否合理
3. 设计企业系统核心表
4. 避免后期数据结构问题


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS design_learning;

USE design_learning;
```


---

# 三、数据库设计流程


企业数据库设计通常分为：


```
需求分析

↓

概念设计

↓

逻辑设计

↓

物理设计

↓

SQL实现

↓

优化维护
```


---

# 四、业务建模


模拟：

CRM客户管理系统。


业务对象：

```
客户

联系人

销售人员

订单

合同
```


关系：

```
客户

|

联系人


客户

|

订单


销售人员

|

订单
```


---

# 五、ER模型


ER：

Entity Relationship。


包含：

## 实体


例如：

客户。


## 属性


例如：

客户名称。


## 关系


例如：

客户拥有订单。


---

# 六、创建基础表


# 1.客户表


```sql
CREATE TABLE customer
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_name VARCHAR(100),

 level VARCHAR(20),

 create_time DATETIME
);
```


---

# 2.联系人表


```sql
CREATE TABLE customer_contact
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 name VARCHAR(50),

 phone VARCHAR(20),

 INDEX idx_customer(customer_id)
);
```


---

# 3.订单表


```sql
CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 order_no VARCHAR(50),

 amount DECIMAL(12,2),

 create_time DATETIME,


 INDEX idx_customer(customer_id)
);
```


---

# 七、知识点详细讲解


# 1.数据库三大范式


## 第一范式 1NF


要求：

字段不可再拆分。


错误：

```
地址：

广东深圳南山区
```


正确：

```
省

市

区
```


---

## 第二范式 2NF


要求：

非主键字段完全依赖主键。


避免：

部分依赖。


---

## 第三范式 3NF


要求：

非主键字段不能传递依赖。


例如：

错误：

订单表：

```
订单ID

客户ID

客户名称
```


问题：

客户名称属于客户。


应该拆分。


---

# 八、反范式设计


完全遵守范式：

查询可能复杂。


所以企业会适当冗余。


例如：


订单表保存：

```
customer_name
```


原因：

报表查询更快。


---

# 九、主键设计


常见方案：


## 自增ID


优点：

简单。


缺点：

分布式困难。


---

## UUID


优点：

唯一。


缺点：

索引空间大。


---

## 雪花ID


企业常用。


特点：

- 趋势递增
- 分布式唯一


---

# 十、字段设计规范


## 时间字段


推荐：


```sql
create_time DATETIME
```


记录：

创建时间。


---

## 状态字段


例如：


```sql
status TINYINT
```


不要：

varchar存状态。


---

## 金额字段


不要：

float。


推荐：

```sql
DECIMAL
```


---

# 十一、企业案例


## CRM系统设计


核心表：


```
customer

contact

customer_follow

sale_order

contract
```


设计原则：

- 主业务独立
- 关联关系清晰
- 查询方便


---

# 十二、索引规划


设计索引前：

先分析业务。


例如：


查询：

客户订单。


索引：


```sql
(customer_id,create_time)
```


---

# 十三、Java + MyBatis应用


实体设计：


```java
class CustomerDTO{

private Long id;

private String customerName;

}
```


Mapper：

```xml
<select id="findCustomer">

SELECT *

FROM customer

WHERE id=#{id}

</select>
```


---

# 十四、练习题


## 基础


1. 设计学生管理系统表。

2. 设计用户表。


---

## 进阶


3. 将订单系统进行范式拆分。

4. 设计CRM核心表。


---

## 高级


5. 设计销售管理数据库。

6. 判断哪些字段应该冗余。


---

# 十五、面试问题


1. 什么是数据库范式？

2. 为什么需要反范式？

3. 主键如何选择？

4. UUID有什么问题？

5. 为什么金额使用DECIMAL？


---

# 十六、最终实战任务


设计：

企业销售管理系统。


要求：

包含：

- 客户
- 联系人
- 商机
- 订单
- 合同


输出：

ER模型 + 表结构设计。


---

# 十七、总结


掌握：

✅ 数据库设计流程

✅ ER模型

✅ 三大范式

✅ 反范式

✅ 主键设计

✅ 字段规范


下一章节：

Day22：企业业务数据库设计实战

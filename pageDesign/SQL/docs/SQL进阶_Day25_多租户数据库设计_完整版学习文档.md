# SQL进阶 Day25：多租户数据库设计（完整版学习文档）

# 一、学习目标

Day25学习企业SaaS系统的重要数据库设计能力：

多租户架构。


重点掌握：

- 什么是多租户
- SaaS系统数据隔离
- tenant设计
- 字段隔离
- Schema隔离
- 数据库隔离
- 租户权限控制
- MyBatis租户实现


完成后能够：

1. 设计SaaS数据库模型
2. 理解企业租户隔离方案
3. 防止租户数据泄露
4. 实现多租户查询控制


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS tenant_learning;

USE tenant_learning;
```


---

# 三、多租户业务场景


SaaS系统：

一个系统服务多个企业。


例如：

```
平台

 |

租户A公司

 |

租户B公司

 |

租户C公司
```


要求：

不同企业：

只能访问自己的数据。


---

# 四、多租户模型


常见三种方案：


## 方案一：字段隔离


所有表增加：

```text
tenant_id
```


例如：

```
customer

id

tenant_id

name
```


优点：

简单。


缺点：

需要所有SQL过滤。


---

## 方案二：Schema隔离


每个租户：

独立schema。


例如：

```
tenant_a.customer

tenant_b.customer
```


优点：

隔离强。


缺点：

维护复杂。


---

## 方案三：数据库隔离


每个租户：

独立数据库。


优点：

最高隔离。


缺点：

成本高。


---

# 五、推荐企业方案


中大型SaaS：

通常：

字段隔离。


所有业务表：

增加：

tenant_id。


---

# 六、创建租户表


```sql
CREATE TABLE tenant
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 tenant_name VARCHAR(100),

 status TINYINT,

 create_time DATETIME
);
```


---

# 七、创建用户表


```sql
CREATE TABLE sys_user
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 tenant_id BIGINT,

 username VARCHAR(50),

 password VARCHAR(100),


 INDEX idx_tenant(tenant_id)

);
```


---

# 八、创建客户表


```sql
CREATE TABLE customer
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 tenant_id BIGINT,

 customer_name VARCHAR(100),

 create_time DATETIME,


 INDEX idx_tenant_time(tenant_id,create_time)

);
```


---

# 九、知识点详细讲解


# 1.为什么需要tenant_id


没有：

tenant_id。


查询：

```sql
SELECT *

FROM customer;
```


可能：

返回所有企业数据。


存在：

```sql
WHERE tenant_id=100;
```


实现隔离。


---

# 2.租户隔离原则


任何业务表：

必须包含：


```text
tenant_id
```


例如：

- 用户
- 订单
- 客户
- 商品


---

# 3.索引设计


多租户查询：


```sql
WHERE tenant_id=1

AND create_time>'2026-01-01'
```


索引：


```sql
(tenant_id,create_time)
```


---

# 十、企业案例


# 案例1：CRM多租户


客户表：


```
customer

tenant_id

customer_name
```


查询：


```sql
SELECT *

FROM customer

WHERE tenant_id=100;
```


---

# 案例2：订单系统


订单：

```sql
sale_order
```


增加：


```sql
tenant_id
```


查询：

```sql
WHERE tenant_id=#{tenantId}
```


---

# 十一、MyBatis多租户实现


## 方式1：手动传递


Mapper：


```xml
<select id="listCustomer">


SELECT *

FROM customer

WHERE tenant_id=#{tenantId}


</select>
```


---

## 方式2：SQL拦截器


自动追加：


```sql
tenant_id=当前租户
```


优点：

避免遗漏。


---

# 十二、数据权限设计


租户内：

还需要权限。


结构：


```
租户

↓

部门

↓

用户

↓

数据
```


---

# 十三、练习题


## 基础


1. 什么是多租户？

2. tenant_id作用是什么？


---

## 进阶


3. 设计SaaS用户表。

4. 设计订单租户隔离。


---

## 高级


5. 比较三种隔离方案。

6. 设计百万租户系统。


---

# 十四、面试问题


1. SaaS为什么需要多租户？

2. 三种租户隔离方式区别？

3. tenant_id应该放在哪里？

4. 如何防止租户数据泄露？

5. MyBatis如何实现租户隔离？


---

# 十五、最终实战任务


设计：

企业SaaS销售系统。


要求：

支持：

- 多公司
- 用户隔离
- 客户隔离
- 订单隔离


输出：

数据库设计方案。


---

# 十六、总结


掌握：

✅ 多租户模型

✅ tenant设计

✅ 数据隔离

✅ 租户索引

✅ MyBatis租户控制


下一章节：

Day26：数据库安全设计

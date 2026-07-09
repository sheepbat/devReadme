# SQL进阶 Day03：多表 JOIN 深入与企业关联查询实战

## 一、学习目标

今天掌握企业开发中最常用的关联查询能力：

- INNER JOIN
- LEFT JOIN
- 多表 JOIN
- ON 与 WHERE 区别
- JOIN 性能优化
- 关联字段索引设计

应用场景：

- CRM客户列表
- 销售订单查询
- 权限菜单查询
- 流程审批记录


---

# 二、环境准备（直接执行）


## 1. 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS sql_learning
DEFAULT CHARACTER SET utf8mb4;

USE sql_learning;
```


## 2. 创建客户表


```sql
DROP TABLE IF EXISTS sale_order;
DROP TABLE IF EXISTS contact;
DROP TABLE IF EXISTS customer;


CREATE TABLE customer
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '客户名称',
    level VARCHAR(20) COMMENT '客户等级',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```


插入数据：

```sql
INSERT INTO customer(name,level)
VALUES
('华东科技有限公司','A级'),
('北方贸易有限公司','B级'),
('未来数据有限公司','A级'),
('测试客户有限公司','C级');
```


---

## 3. 创建联系人表


```sql
CREATE TABLE contact
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    name VARCHAR(50),
    phone VARCHAR(20),

    INDEX idx_contact_customer(customer_id)
);
```


插入数据：

```sql
INSERT INTO contact(customer_id,name,phone)
VALUES
(1,'张经理','13800000001'),
(1,'李主管','13800000002'),
(2,'王经理','13800000003'),
(3,'赵经理','13800000004');
```


---

## 4. 创建订单表


```sql
CREATE TABLE sale_order
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    order_no VARCHAR(50),
    amount DECIMAL(12,2),
    status TINYINT,

    INDEX idx_order_customer(customer_id)
);
```


插入数据：

```sql
INSERT INTO sale_order
(customer_id,order_no,amount,status)
VALUES
(1,'SO001',120000,2),
(1,'SO002',50000,1),
(2,'SO003',80000,2),
(3,'SO004',30000,3);
```


---

# 三、JOIN知识讲解


## 1. INNER JOIN


作用：

只返回两个表都有的数据。


示例：

```sql
SELECT
    c.name,
    o.order_no,
    o.amount
FROM customer c
INNER JOIN sale_order o
ON c.id=o.customer_id;
```


结果：

只有存在订单的客户。


---

## 2. LEFT JOIN


作用：

保留左表全部数据。


示例：

```sql
SELECT
    c.name,
    o.order_no,
    o.amount
FROM customer c
LEFT JOIN sale_order o
ON c.id=o.customer_id;
```


结果：

没有订单的客户也会显示。


---

# 四、ON和WHERE区别


## 写法1


```sql
SELECT *
FROM customer c
LEFT JOIN sale_order o
ON c.id=o.customer_id
AND o.status=2;
```


含义：

保留全部客户，只关联已支付订单。


---

## 写法2


```sql
SELECT *
FROM customer c
LEFT JOIN sale_order o
ON c.id=o.customer_id
WHERE o.status=2;
```


问题：

没有订单的客户会被过滤。


总结：

|位置|作用|
|-|-|
|ON|控制关联|
|WHERE|过滤结果|


---

# 五、多表JOIN


客户 + 联系人 + 订单：


```sql
SELECT
    c.name customer_name,
    ct.name contact_name,
    o.order_no,
    o.amount
FROM customer c
LEFT JOIN contact ct
ON c.id=ct.customer_id
LEFT JOIN sale_order o
ON c.id=o.customer_id;
```


执行过程：

```
customer

↓

contact

↓

sale_order
```


---

# 六、企业项目案例


## 1. 销售系统


查询客户销售额：


```sql
SELECT
    c.name,
    COUNT(o.id) order_count,
    SUM(o.amount) total_amount
FROM customer c
LEFT JOIN sale_order o
ON c.id=o.customer_id
GROUP BY c.id,c.name;
```


---

## 2. 权限系统


典型结构：


```
user

role

permission
```


通过JOIN查询：

用户拥有的菜单权限。


---

# 七、性能优化


## 1. 关联字段建立索引


例如：

```sql
CREATE INDEX idx_order_customer
ON sale_order(customer_id);
```


原因：

JOIN本质需要快速定位关联数据。


---

## 2. 使用EXPLAIN分析


```sql
EXPLAIN
SELECT
*
FROM customer c
LEFT JOIN sale_order o
ON c.id=o.customer_id;
```


关注：

- type
- key
- rows


---

# 八、每日练习题


## 练习1

查询：

客户名称

订单编号

订单金额


要求：

INNER JOIN。


---

## 练习2

查询：

所有客户以及订单信息。


要求：

LEFT JOIN。


---

## 练习3

查询：

没有订单的客户。


提示：

```sql
LEFT JOIN + IS NULL
```


---

## 练习4

查询：

客户名称

联系人姓名

手机号。


---

## 练习5

统计每个客户：

- 订单数量
- 销售总金额


要求：

JOIN + GROUP BY。


---

## 练习6（重点）


查询：

所有客户和已支付订单。


思考：

条件应该放ON还是WHERE？


---

# 九、Java + MyBatis应用


典型Mapper：


```xml
<select id="customerList">

SELECT
 c.name,
 o.order_no,
 o.amount

FROM customer c

LEFT JOIN sale_order o

ON c.id=o.customer_id

WHERE c.level=#{level}

</select>
```


应用：

- 分页列表
- 数据统计
- 导出报表


---

# 十、验收标准


完成后能够回答：


1. INNER JOIN和LEFT JOIN区别？

2. 为什么后台列表常用LEFT JOIN？

3. ON和WHERE有什么区别？

4. 如何查询没有关联数据？

5. JOIN字段为什么需要索引？

6. 三张业务表如何设计关联查询？

# SQL进阶 Day18：事务基础（完整版学习文档）

# 一、学习目标

Day18进入数据库事务核心。

重点掌握：

- 什么是事务
- ACID特性
- 事务生命周期
- COMMIT
- ROLLBACK
- MySQL事务控制
- Spring事务关系
- 业务事务设计


完成后能够：

1. 正确设计业务事务
2. 理解数据库一致性
3. 排查事务问题
4. 编写安全的数据操作流程


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、事务业务场景


经典案例：

订单支付。


流程：

```
用户支付

↓

订单状态修改

↓

扣减库存

↓

增加账户余额

```


要求：

全部成功。

或者：

全部失败。


---

# 四、创建测试表


## 订单表


```sql
CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_no VARCHAR(50),

 status TINYINT,

 amount DECIMAL(12,2)

);
```


数据：


```sql
INSERT INTO sale_order
(order_no,status,amount)

VALUES

('SO001',1,1000);
```


---

## 库存表


```sql
CREATE TABLE product_stock
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 product_id BIGINT,

 stock INT
);
```


数据：


```sql
INSERT INTO product_stock
(product_id,stock)

VALUES

(1001,10);
```


---

# 五、知识点详细讲解


# 1.什么是事务


事务：

一组不可分割的数据库操作。


例如：

支付：


```text
扣库存

+

修改订单状态

```


必须同时成功。


---

# 2.ACID


事务四大特性。


---

# 原子性 Atomicity


全部成功。

全部失败。


例如：

扣库存成功。

订单失败。

不能存在。


---

# 一致性 Consistency


事务前后：

数据符合业务规则。


例如：

库存不能负数。


---

# 隔离性 Isolation


多个事务互不影响。


例如：

两个用户同时购买。


---

# 持久性 Durability


提交后：

数据永久保存。


---

# 六、事务基本操作


开启事务：


```sql
START TRANSACTION;
```


修改：


```sql
UPDATE sale_order

SET status=2

WHERE id=1;
```


提交：


```sql
COMMIT;
```


回滚：


```sql
ROLLBACK;
```


---

# 七、企业案例


# 案例1：订单支付


错误流程：


```sql
UPDATE sale_order
SET status=2;


UPDATE product_stock
SET stock=stock-1;
```


问题：

第二步失败。

第一步已经提交。


---

正确：


```sql
START TRANSACTION;


UPDATE sale_order

SET status=2

WHERE id=1;


UPDATE product_stock

SET stock=stock-1

WHERE product_id=1001;


COMMIT;
```


失败：

```sql
ROLLBACK;
```


---

# 八、事务隔离级别


MySQL支持：


## READ UNCOMMITTED


最低隔离。


可能：

脏读。


---

## READ COMMITTED


避免脏读。


---

## REPEATABLE READ


MySQL默认。


避免不可重复读。


---

## SERIALIZABLE


最高隔离。


性能最低。


---

# 九、事务生命周期


流程：


```
BEGIN

↓

执行SQL

↓

成功

↓

COMMIT


失败

↓

ROLLBACK
```


---

# 十、Spring事务结合


Java：


```java
@Transactional
public void pay(){

 updateOrder();

 updateStock();

}
```


作用：

自动控制：

提交。

回滚。


---

# 十一、事务注意事项


## 1.事务不要过大


错误：

一次事务处理10万条。


问题：

锁时间长。


---

## 2.不要在事务中调用远程接口


例如：

事务内：

调用支付服务。


可能：

长时间占用锁。


---

## 3.合理控制事务范围


原则：

越短越好。


---

# 十二、练习题


## 基础


1. 创建事务更新订单。


2. 测试ROLLBACK。


3. 测试COMMIT。


---

## 进阶


4. 设计支付事务。


5. 分析事务失败场景。


6. 设置隔离级别。


---

## 高级


7. 设计库存扣减事务。

8. 分析大事务问题。

9. 设计Spring事务方案。


---

# 十三、面试问题


1. 什么是事务？

2. ACID分别是什么？

3. 为什么需要事务？

4. MySQL默认隔离级别是什么？

5. Spring事务如何实现？


---

# 十四、最终实战任务


设计：

订单支付流程。


要求：

包含：

- 修改订单
- 扣减库存
- 记录支付


保证：

数据一致。


---

# 十五、总结


掌握：

✅ 事务概念

✅ ACID

✅ COMMIT

✅ ROLLBACK

✅ 隔离级别

✅ Spring事务


下一章节：

Day19：锁机制

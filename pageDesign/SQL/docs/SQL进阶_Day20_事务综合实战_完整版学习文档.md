# SQL进阶 Day20：事务综合实战（完整版学习文档）

# 一、学习目标

Day20对前20天数据库核心知识进行综合应用。

重点掌握：

- 事务设计
- 锁与事务结合
- 订单支付流程
- 库存一致性
- 乐观锁实践
- 悲观锁实践
- Spring事务边界设计
- 高并发业务处理


完成后能够：

1. 设计企业级事务流程
2. 处理订单支付一致性问题
3. 分析并发更新风险
4. 编写可靠业务SQL


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、综合业务场景


模拟电商订单支付。


业务流程：

```
用户提交订单

↓

冻结库存

↓

支付成功

↓

修改订单状态

↓

记录支付流水
```


要求：

所有步骤保持一致。


---

# 四、数据库设计


# 1.订单表


```sql
CREATE TABLE orders
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_no VARCHAR(50),

 status TINYINT,

 amount DECIMAL(12,2),

 create_time DATETIME
);
```


状态：

```
1 待支付

2 已支付

3 已取消
```


---

# 2.库存表


```sql
CREATE TABLE product_stock
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 product_id BIGINT,

 stock INT,

 version INT DEFAULT 0
);
```


---

# 3.支付流水表


```sql
CREATE TABLE payment_record
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 order_id BIGINT,

 amount DECIMAL(12,2),

 status TINYINT,

 create_time DATETIME
);
```


---

# 五、事务综合知识


# 1.订单支付为什么需要事务


支付包含多个操作：


```
订单修改

+

库存扣减

+

支付记录
```


任何一步失败：

必须回滚。


---

# 2.事务边界设计


错误：


```
Controller

开启事务

调用多个服务
```


问题：

事务范围过大。


推荐：


```
Service层

@Transactional

业务操作
```


---

# 六、案例一：悲观锁实现库存扣减


## 问题


多个用户同时购买。


库存：

10


两个请求：

同时扣减。


可能：

库存异常。


---

## 方案


先锁库存。


SQL：


```sql
SELECT *

FROM product_stock

WHERE product_id=1001

FOR UPDATE;
```


然后：

```sql
UPDATE product_stock

SET stock=stock-1

WHERE product_id=1001;
```


---

# 七、案例二：乐观锁实现库存扣减


增加版本号：


```sql
UPDATE product_stock

SET

stock=stock-1,

version=version+1


WHERE product_id=1001

AND version=10;
```


判断：

影响行数。


如果：

0


说明：

并发冲突。


---

# 八、订单支付完整流程


伪代码：


```java
@Transactional
public void pay(Long orderId){


 //修改订单状态

 updateOrder();


 //扣减库存

 updateStock();


 //保存支付记录

 savePayment();


}
```


失败：

自动回滚。


---

# 九、事务问题分析


# 1.大事务问题


错误：

一次处理：

几十万数据。


影响：

- 锁时间长
- 回滚成本高


---

# 2.事务中调用远程服务


错误：

事务中调用：

支付接口。


原因：

网络不可控。


---

# 3.事务传播问题


Spring：

不同Service调用。


需要明确：

事务是否共享。


---

# 十、企业案例


# 案例1：秒杀库存


要求：

高并发扣库存。


方案：

- 乐观锁
- Redis预扣库存
- 数据库最终校验


---

# 案例2：订单重复支付


问题：

用户重复点击。


解决：


```sql
UPDATE orders

SET status=2

WHERE id=1

AND status=1;
```


保证：

只能成功一次。


---

# 十一、MyBatis应用


订单支付Mapper：


```xml
<update id="payOrder">


UPDATE orders

SET status=2

WHERE id=#{id}

AND status=1


</update>
```


库存：


```xml
<update id="reduceStock">


UPDATE product_stock

SET stock=stock-1

WHERE product_id=#{id}

AND stock>0


</update>
```


---

# 十二、练习题


## 基础


1. 创建订单事务。

2. 测试回滚。

3. 测试提交。


---

## 进阶


4. 实现库存扣减。

5. 实现乐观锁。

6. 分析并发问题。


---

## 高级


7. 设计秒杀方案。

8. 设计支付一致性方案。

9. 设计事务边界。


---

# 十三、面试问题


1. 为什么订单支付需要事务？

2. 事务范围应该如何设计？

3. 乐观锁和悲观锁区别？

4. 如何防止重复支付？

5. 如何解决库存超卖？


---

# 十四、最终实战任务


设计：

完整订单支付系统。


要求：

包含：

- 订单
- 库存
- 支付流水
- 事务
- 锁


输出：

数据库设计 + SQL + Java事务方案。


---

# 十五、Day05-Day20阶段总结


已掌握：


SQL能力：

✅ 聚合查询

✅ 窗口函数

✅ CTE

✅ 分页优化


MySQL能力：

✅ 架构

✅ 索引

✅ EXPLAIN

✅ 慢SQL

✅ 大表优化


事务能力：

✅ ACID

✅ 锁

✅ 并发控制


下一阶段：

Day21：数据库设计基础

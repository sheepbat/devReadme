# SQL进阶 Day19：锁机制（完整版学习文档）

# 一、学习目标

Day19学习数据库并发控制核心。

重点掌握：

- 为什么需要锁
- MySQL锁分类
- 表锁
- 行锁
- 共享锁
- 排他锁
- 乐观锁
- 悲观锁
- 间隙锁
- 临键锁
- 死锁分析


完成后能够：

1. 分析并发更新问题
2. 设计安全更新方案
3. 排查锁等待
4. 优化高并发业务


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务场景设计


模拟：

订单库存系统。


并发场景：

```
用户A购买商品

       ↓

扣减库存


用户B同时购买

       ↓

同时修改库存
```


问题：

库存可能变负。


---

# 四、创建库存表


```sql
DROP TABLE IF EXISTS product_stock;


CREATE TABLE product_stock
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 product_id BIGINT,

 stock INT,

 version INT DEFAULT 0,


 UNIQUE KEY uk_product(product_id)

);
```


插入数据：


```sql
INSERT INTO product_stock
(product_id,stock)

VALUES

(1001,10);
```


---

# 五、知识点详细讲解


# 1.为什么需要锁


没有锁：

两个事务同时修改。


初始：

```
库存10
```


事务A：

扣5。


事务B：

扣8。


可能结果：

库存错误。


锁保证：

数据一致。


---

# 2.MySQL锁分类


按照范围：


## 表锁


锁整张表。


优点：

简单。


缺点：

并发低。


---

## 行锁


锁具体数据行。


InnoDB主要使用。


优点：

并发高。


---

# 3.共享锁


Shared Lock。


读取锁。


SQL：


```sql
SELECT *

FROM product_stock

WHERE product_id=1001

LOCK IN SHARE MODE;
```


多个事务：

可以同时读。


不能修改。


---

# 4.排他锁


Exclusive Lock。


修改锁。


SQL：


```sql
SELECT *

FROM product_stock

WHERE product_id=1001

FOR UPDATE;
```


特点：

其他事务等待。


---

# 5.悲观锁


思想：

认为一定冲突。


提前加锁。


例如：


```sql
SELECT *

FROM product_stock

WHERE product_id=1001

FOR UPDATE;
```


适合：

库存扣减。


---

# 6.乐观锁


思想：

认为冲突少。


通过版本号控制。


表字段：

```sql
version
```


更新：


```sql
UPDATE product_stock

SET stock=stock-1,

version=version+1

WHERE product_id=1001

AND version=0;
```


如果影响行数：

0。


说明：

版本变化。


---

# 六、间隙锁


Gap Lock。


作用：

防止范围插入。


例如：

```sql
WHERE id BETWEEN 10 AND 20;
```


锁住：

范围。


---

# 七、临键锁


Next-Key Lock。


= 行锁 + 间隙锁。


InnoDB默认解决幻读。


---

# 八、死锁


## 什么是死锁


两个事务互相等待。


例如：


事务A：

锁订单。


等待库存。


事务B：

锁库存。


等待订单。


形成循环。


---

# 九、死锁案例


事务A：


```sql
UPDATE order_table

SET status=2

WHERE id=1;
```


事务B：


```sql
UPDATE stock

SET stock=stock-1

WHERE id=2;
```


如果互相等待：

死锁。


---

# 十、死锁解决方案


## 1.固定加锁顺序


所有业务：

先锁库存。

再锁订单。


---

## 2.缩短事务


减少锁持有时间。


---

## 3.捕获异常重试


业务层：

重新执行。


---

# 十一、企业案例


# 案例1：库存扣减


错误：


```sql
UPDATE stock

SET stock=stock-1

WHERE product_id=1001;
```


可能：

库存负数。


优化：


```sql
UPDATE stock

SET stock=stock-1

WHERE product_id=1001

AND stock>0;
```


---

# 案例2：订单状态更新


避免：

重复支付。


```sql
UPDATE order_table

SET status=2

WHERE id=1

AND status=1;
```


---

# 十二、Spring + MyBatis应用


悲观锁：


Mapper：

```xml
<select id="lockStock">


SELECT *

FROM product_stock

WHERE product_id=#{id}

FOR UPDATE


</select>
```


乐观锁：


```xml
<update id="updateStock">


UPDATE product_stock

SET version=version+1

WHERE id=#{id}

AND version=#{version}


</update>
```


---

# 十三、练习题


## 基础


1. 什么是行锁？

2. 什么是共享锁？


---

## 进阶


3. 实现库存扣减。

4. 实现乐观锁更新。

5. 分析死锁。


---

## 高级


6. 设计秒杀库存方案。

7. 设计订单支付锁方案。

8. 优化高并发更新。


---

# 十四、面试问题


1. InnoDB为什么支持行锁？

2. 什么是悲观锁？

3. 什么是乐观锁？

4. 什么是死锁？

5. 如何解决死锁？


---

# 十五、最终实战任务


设计：

高并发订单支付。


要求：

包含：

- 库存扣减
- 订单更新
- 锁设计
- 事务设计


---

# 十六、总结


掌握：

✅ 行锁

✅ 表锁

✅ 共享锁

✅ 排他锁

✅ 乐观锁

✅ 悲观锁

✅ 死锁处理


下一章节：

Day20：事务综合实战

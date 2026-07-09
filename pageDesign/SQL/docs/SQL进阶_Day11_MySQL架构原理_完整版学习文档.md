# SQL进阶 Day11：MySQL架构原理（完整版学习文档）

# 一、学习目标

Day11进入MySQL底层原理阶段。

重点掌握：

- MySQL整体架构
- SQL执行流程
- Server层
- 存储引擎
- InnoDB架构
- Buffer Pool
- Redo Log
- Undo Log
- Binlog


完成后能够：

1. 理解SQL从输入到执行全过程
2. 判断SQL性能问题来源
3. 理解事务和日志机制
4. 为后续索引优化打基础


---

# 二、环境准备


## MySQL环境


要求：

- MySQL 8.0+
- DataGrip


查看版本：


```sql
SELECT VERSION();
```


---

# 三、MySQL整体架构


MySQL主要分层：


```
客户端

↓

连接层

↓

SQL解析层

↓

优化器

↓

执行器

↓

存储引擎

↓

磁盘数据
```


---

# 四、连接层


作用：

管理客户端连接。


负责：

- 用户认证
- 权限检查
- 连接管理


例如：


Java应用：

```
SpringBoot

↓

MyBatis

↓

JDBC

↓

MySQL
```


---

# 五、Server层


Server层负责：

## 1.SQL解析


例如：

```sql
SELECT *
FROM employee;
```


解析：

- SELECT是什么
- FROM哪个表
- 是否存在权限


---

## 2.语法检查


错误：

```sql
SELECT FROM employee;
```


解析阶段报错。


---

## 3.优化器


优化器决定：

- 使用哪个索引
- 表连接顺序
- 执行方式


例如：

SQL：

```sql
SELECT *
FROM user
WHERE id=10;
```


可能选择：

主键索引。


---

# 六、执行器


执行器：

真正执行SQL。


流程：


```
调用存储引擎

↓

读取数据

↓

返回结果
```


---

# 七、InnoDB存储引擎


InnoDB特点：

- 支持事务
- 支持行锁
- 支持MVCC
- 支持崩溃恢复


企业系统：

订单、支付、库存：

基本使用InnoDB。


---

# 八、InnoDB核心结构


## 1.Buffer Pool


内存缓存。


作用：

减少磁盘IO。


流程：

```
查询数据

↓

Buffer Pool

↓

没有

↓

磁盘读取
```


---

## 2.Redo Log


作用：

保证事务持久性。


例如：

提交订单。


数据修改：

先写Redo Log。


数据库崩溃：

恢复数据。


---

## 3.Undo Log


作用：

事务回滚。


例如：

```sql
ROLLBACK;
```


恢复修改前数据。


---

## 4.Binlog


作用：

MySQL Server日志。


用途：

- 主从复制
- 数据恢复


---

# 九、SQL执行完整流程


SQL：

```sql
SELECT name
FROM employee
WHERE id=1;
```


流程：

## 第一步

客户端发送SQL。


## 第二步

连接认证。


## 第三步

SQL解析。


## 第四步

优化器选择执行计划。


## 第五步

执行器调用InnoDB。


## 第六步

返回结果。


---

# 十、企业案例


## 案例：订单查询慢


问题：

订单列表越来越慢。


排查：


1. SQL是否合理？

2. 是否走索引？

3. Buffer Pool是否命中？

4. 数据量是否增长？


使用：

```sql
EXPLAIN SQL;
```


---

# 十一、练习环境


创建测试表：


```sql
CREATE TABLE employee
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 name VARCHAR(50),

 salary DECIMAL(10,2)
);
```


插入：


```sql
INSERT INTO employee(name,salary)

VALUES

('张三',10000),

('李四',15000);
```


执行：

```sql
SELECT *
FROM employee
WHERE id=1;
```


思考：

数据从哪里读取？


---

# 十二、性能理解


## 为什么索引快？


因为：

索引减少磁盘扫描。


## 为什么SQL慢？


可能原因：

- 全表扫描
- 索引失效
- 数据量过大
- IO压力


---

# 十三、Java + MyBatis应用


一次查询流程：


```
Controller

↓

Service

↓

Mapper

↓

JDBC

↓

MySQL Server

↓

InnoDB
```


理解底层：

有助于：

- SQL优化
- 排查接口慢


---

# 十四、练习题


## 基础


1. 描述MySQL执行流程。


2. InnoDB作用是什么？


3. Redo Log作用？


4. Undo Log作用？


---

## 进阶


5. 为什么查询会访问Buffer Pool？


6. SQL优化器作用？


7. Binlog有什么用途？


---

## 高级


8. 数据库崩溃如何恢复？


9. MySQL为什么默认InnoDB？


10. Java接口慢如何定位数据库问题？


---

# 十五、面试问题


1. 一条SQL如何执行？

2. Redo Log和Binlog区别？

3. Buffer Pool有什么作用？

4. 为什么InnoDB支持事务？

5. SQL优化应该从哪里开始？


---

# 十六、最终实战任务


模拟：

订单查询接口慢。


分析：

1. SQL执行流程

2. 是否走索引

3. 是否存在IO问题

4. 如何优化


---

# 十七、总结


掌握：

✅ MySQL架构

✅ SQL执行流程

✅ InnoDB

✅ Buffer Pool

✅ Redo Log

✅ Undo Log

✅ Binlog


下一章节：

Day12：索引基础

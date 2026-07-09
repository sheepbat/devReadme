# SQL进阶 Day30：MySQL性能调优综合实战（完整版学习文档）

# 一、学习目标

Day30对MySQL性能优化进行综合总结。

重点掌握：

- MySQL性能优化体系
- SQL优化流程
- 索引优化复盘
- 慢SQL治理
- 参数优化
- 连接池优化
- 应用与数据库协同优化
- 企业性能问题分析


完成后能够：

1. 建立完整SQL优化思路
2. 定位接口性能瓶颈
3. 输出数据库优化方案
4. 进行企业级性能治理


---

# 二、性能优化体系


数据库性能：

不是单点问题。


整体链路：


```
用户请求

↓

接口服务

↓

连接池

↓

SQL

↓

MySQL

↓

磁盘/内存
```


任何环节都有可能成为瓶颈。


---

# 三、环境准备


```sql
CREATE DATABASE IF NOT EXISTS performance_learning;

USE performance_learning;
```


---

# 四、性能测试表


```sql
CREATE TABLE order_info
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 status TINYINT,

 amount DECIMAL(12,2),

 create_time DATETIME,


 INDEX idx_customer(customer_id),

 INDEX idx_status_time(status,create_time)

);
```


---

# 五、SQL优化完整流程


标准流程：


```
发现慢

↓

定位SQL

↓

EXPLAIN分析

↓

优化SQL

↓

调整索引

↓

压力测试

↓

上线观察
```


---

# 六、SQL优化复盘


# 1.避免SELECT *


错误：

```sql
SELECT *

FROM order_info;
```


问题：

增加IO。


优化：


```sql
SELECT id,amount

FROM order_info;
```


---

# 2.优化条件查询


错误：


```sql
WHERE DATE(create_time)=?
```


优化：


```sql
WHERE create_time>=?

AND create_time<?
```


---

# 3.合理设计索引


例如：


查询：

```sql
WHERE customer_id=1

AND status=2
```


索引：

```sql
(customer_id,status)
```


---

# 七、慢SQL治理


## 发现方式


- 慢查询日志
- APM监控
- 数据库监控


---

## 治理流程


```
SQL采集

↓

排序

↓

分析

↓

优化

↓

复查
```


---

# 八、MySQL参数优化


常见参数：


## max_connections


最大连接数。


---

## innodb_buffer_pool_size


InnoDB缓存大小。


作用：

缓存数据和索引。


---

## slow_query_log


慢查询日志。


---

# 九、连接池优化


Java应用：

通常使用：

HikariCP。


关注：

- 最大连接数
- 最小空闲连接
- 超时时间


---

# 十、应用与数据库协同优化


## 1.分页优化


避免：


```sql
LIMIT 100000,20;
```


推荐：

游标分页。


---

## 2.缓存


热点数据：

使用Redis。


减少数据库压力。


---

## 3.批量处理


避免：

循环单条SQL。


推荐：

批量insert。


---

# 十一、企业案例


## 案例1：订单接口3秒优化


问题：

SQL：

全表扫描。


优化：

1. 增加索引。

2. 减少字段。

3. 优化分页。


结果：

秒级降低。


---

## 案例2：报表查询慢


问题：

大数据统计。


方案：

- 汇总表
- 定时任务
- 读库


---

# 十二、性能优化报告模板


内容：


## 问题描述


接口：

xxx


## SQL分析


EXPLAIN结果。


## 原因分析


索引失效。


## 优化方案


SQL修改。


索引调整。


## 优化结果


耗时变化。


---

# 十三、MyBatis优化


## 避免N+1


错误：

循环查询。


优化：

JOIN。


---

## 合理使用缓存


一级缓存。

二级缓存。


---

# 十四、练习题


## 基础


1. 优化SELECT *。

2. 分析慢SQL。


---

## 进阶


3. 输出SQL优化报告。

4. 设计索引方案。


---

## 高级


5. 优化百万订单查询。

6. 设计性能治理流程。


---

# 十五、面试问题


1. SQL慢如何排查？

2. 如何优化数据库性能？

3. Buffer Pool作用？

4. 索引什么时候失效？

5. 如何治理慢SQL？


---

# 十六、最终实战任务


模拟：

订单系统性能优化。


要求：

分析：

- SQL
- 索引
- 参数
- 架构


输出：

完整优化报告。


---

# 十七、Day05-Day30阶段总结


完成能力：


SQL：

✅ 高级查询

✅ 窗口函数

✅ 报表开发


MySQL：

✅ 原理

✅ 索引

✅ 性能优化


架构：

✅ 主从

✅ 高可用

✅ 设计


下一阶段：

Day31：Redis与数据库结合

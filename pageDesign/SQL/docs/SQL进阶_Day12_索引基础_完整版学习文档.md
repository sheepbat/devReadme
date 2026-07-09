# SQL进阶 Day12：索引基础（完整版学习文档）

# 一、学习目标

Day12进入MySQL性能优化核心。

重点掌握：

- 为什么需要索引
- 索引工作原理
- B+Tree结构
- 聚簇索引
- 非聚簇索引
- 主键索引
- 普通索引
- 唯一索引
- 索引创建原则


完成后能够：

1. 判断SQL是否需要索引
2. 设计基础索引结构
3. 使用EXPLAIN分析索引
4. 优化企业列表查询


---

# 二、环境准备


## MySQL环境


```sql
SELECT VERSION();
```


数据库：

```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务场景设计


模拟：

企业员工查询系统。


需求：

- 根据员工编号查询
- 根据部门查询
- 根据姓名查询
- 根据工资排序


数据量：

生产环境：

可能：

百万员工。


---

# 四、创建测试表


```sql
DROP TABLE IF EXISTS employee;


CREATE TABLE employee
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 name VARCHAR(50),

 dept VARCHAR(50),

 salary DECIMAL(10,2),

 create_time DATETIME

);
```


插入数据：


```sql
INSERT INTO employee
(name,dept,salary,create_time)

VALUES

('张三','研发部',15000,'2026-01-01'),

('李四','销售部',12000,'2026-01-02'),

('王五','研发部',18000,'2026-01-03');
```


---

# 五、知识点详细讲解


# 1.什么是索引


索引：

帮助数据库快速找到数据的数据结构。


类似：

书籍目录。


没有索引：

```
第一页查

第二页查

第三页查
```


有索引：

```
目录

↓

目标页
```


---

# 2.为什么需要索引


SQL：


```sql
SELECT *

FROM employee

WHERE id=100;
```


没有索引：

扫描全部数据。


有索引：

快速定位。


---

# 3.B+Tree原理


MySQL主要使用：

B+Tree。


结构：


```
        根节点

          |

      中间节点

          |

       叶子节点
```


特点：

## 1

高度低。


## 2

查询稳定。


## 3

叶子节点有顺序。


适合：

范围查询。


---

# 4.聚簇索引


InnoDB：

主键就是聚簇索引。


特点：

数据存储在索引叶子节点。


例如：


```sql
PRIMARY KEY(id)
```


查询：

```sql
WHERE id=10
```


直接找到数据。


---

# 5.普通索引


例如：


```sql
CREATE INDEX idx_name

ON employee(name);
```


结构：

索引保存：

name + 主键id。


查询：

先找到id。

再回表。


---

# 6.唯一索引


保证数据唯一。


例如：

手机号。


```sql
CREATE UNIQUE INDEX uk_phone

ON employee(phone);
```


---

# 六、创建索引案例


## 根据部门查询


SQL：

```sql
SELECT *

FROM employee

WHERE dept='研发部';
```


创建：

```sql
CREATE INDEX idx_dept

ON employee(dept);
```


---

## 根据姓名查询


```sql
CREATE INDEX idx_name

ON employee(name);
```


---

# 七、EXPLAIN分析


执行：


```sql
EXPLAIN

SELECT *

FROM employee

WHERE dept='研发部';
```


关注：


## type

访问类型。


## key

实际使用索引。


## rows

扫描行数。


---

# 八、企业案例


## 案例1：订单列表慢


SQL：


```sql
SELECT *

FROM sale_order

WHERE customer_id=100;
```


优化：


```sql
CREATE INDEX idx_customer

ON sale_order(customer_id);
```


---

## 案例2：时间查询


SQL：


```sql
SELECT *

FROM sale_order

WHERE create_time>'2026-01-01';
```


索引：


```sql
CREATE INDEX idx_time

ON sale_order(create_time);
```


---

# 九、索引设计原则


## 1.高频查询字段建立索引


例如：

用户ID。


---

## 2.区分度高字段优先


例如：

身份证号。


不推荐：

性别。


---

## 3.避免大量索引


索引越多：

写入越慢。


---

# 十、Java + MyBatis应用


Mapper：

```xml
<select id="getEmployee">

SELECT *

FROM employee

WHERE id=#{id}

</select>
```


如果id是主键：

自动使用索引。


---

# 十一、练习题


## 基础


1. 创建员工表索引。


2. 查询索引信息。


```sql
SHOW INDEX FROM employee;
```


3. 使用EXPLAIN分析SQL。


---

## 进阶


4. 为订单表设计查询索引。


5. 判断哪些字段需要索引。


6. 删除无效索引。


---

## 高级


7. 设计百万订单索引方案。


8. 分析索引数量影响。


9. 优化员工列表SQL。


---

# 十二、面试问题


1. 为什么MySQL使用B+Tree？

2. 聚簇索引是什么？

3. 普通索引查询为什么需要回表？

4. 索引越多越好吗？

5. 什么字段适合建立索引？


---

# 十三、最终实战任务


设计：

订单查询模块。


要求：

支持：

- 按客户查询
- 按时间查询
- 按状态查询


输出：

SQL + 索引设计方案。


---

# 十四、总结


掌握：

✅ 索引作用

✅ B+Tree

✅ 聚簇索引

✅ 普通索引

✅ 唯一索引

✅ 基础索引设计


下一章节：

Day13：联合索引设计

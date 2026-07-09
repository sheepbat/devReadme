# SQL进阶 Day06：窗口函数基础（完整版学习文档）

# 一、学习目标

Day06进入SQL高级分析能力。

今天重点学习：

- 什么是窗口函数
- 窗口函数执行逻辑
- ROW_NUMBER()
- RANK()
- DENSE_RANK()
- PARTITION BY
- ORDER BY窗口排序
- TopN业务查询


完成后能够：

1. 实现复杂排名需求
2. 替代部分子查询
3. 编写销售排行SQL
4. 处理数据分析场景


---

# 二、环境准备


## 1. 创建数据库


```sql
CREATE DATABASE IF NOT EXISTS sql_learning
DEFAULT CHARACTER SET utf8mb4;

USE sql_learning;
```


---

# 三、业务模型设计


模拟销售人员业绩分析：

```
employee

员工

    |

    |

sale_order

订单

    |

    |

customer

客户
```


业务需求：

- 查询销售冠军
- 每部门工资排名
- 每客户订单Top3
- 销售人员排名


---

# 四、创建测试表


## 1.employee员工表


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

('李四','研发部',12000,'2026-01-02'),

('王五','研发部',10000,'2026-01-03'),

('赵六','销售部',18000,'2026-01-04'),

('陈七','销售部',13000,'2026-01-05'),

('孙八','销售部',9000,'2026-01-06');
```


---

## 2.sale_order订单表


```sql
CREATE TABLE sale_order
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 customer_id BIGINT,
 salesman_id BIGINT,
 order_no VARCHAR(50),
 amount DECIMAL(12,2),
 create_time DATETIME,

 INDEX idx_salesman(salesman_id)
);
```


插入：

```sql
INSERT INTO sale_order
(customer_id,salesman_id,order_no,amount,create_time)
VALUES

(1,1,'SO001',10000,'2026-01-01'),

(2,1,'SO002',20000,'2026-01-02'),

(3,2,'SO003',15000,'2026-01-03'),

(4,4,'SO004',50000,'2026-01-04'),

(5,4,'SO005',30000,'2026-01-05'),

(6,5,'SO006',10000,'2026-01-06');
```


---

# 五、知识点详细讲解


# 1. 什么是窗口函数


窗口函数：

在不改变数据行数量的情况下，对数据进行计算。


普通GROUP BY：

会合并数据。


例如：

```sql
SELECT
dept,
AVG(salary)
FROM employee
GROUP BY dept;
```


结果：

每个部门一行。


窗口函数：

保留原始数据，同时增加计算结果。


例如：

```sql
SELECT
name,
dept,
salary,
AVG(salary)
OVER(PARTITION BY dept)
FROM employee;
```


结果：

每个员工都有部门平均工资。


---

# 2. 窗口函数语法


```sql
函数()
OVER(
PARTITION BY 分组字段
ORDER BY 排序字段
)
```


组成：

## PARTITION BY

类似GROUP BY。


## ORDER BY

决定窗口排序。


---

# 3. ROW_NUMBER()


作用：

生成连续排名。


示例：

工资排名：

```sql
SELECT
name,
salary,

ROW_NUMBER()
OVER(
ORDER BY salary DESC
) rank_no

FROM employee;
```


结果：

```
赵六 18000 1

张三 15000 2

陈七 13000 3
```


特点：

没有并列。


---

# 4. RANK()


存在并列排名。


```sql
SELECT

name,

salary,

RANK()
OVER(
ORDER BY salary DESC
)

FROM employee;
```


例如：

工资：

```
10000
10000
9000
```


排名：

```
1
1
3
```


会跳号。


---

# 5. DENSE_RANK()


不会跳号。


结果：

```
1
1
2
```


---

# 六、企业案例


# 案例1：销售人员排行榜


需求：

查询销售人员销售金额排名。


SQL：


```sql
SELECT

salesman_id,

SUM(amount) total_amount,


RANK()
OVER(
ORDER BY SUM(amount) DESC
) rank_no


FROM sale_order

GROUP BY salesman_id;
```


---

# 案例2：每部门工资前三名


需求：

每个部门取前三员工。


SQL：


```sql
SELECT *
FROM
(
SELECT

name,

dept,

salary,


ROW_NUMBER()
OVER(
PARTITION BY dept
ORDER BY salary DESC
) rn


FROM employee

)t

WHERE rn<=3;
```


这是企业非常高频SQL。


---

# 案例3：客户订单Top3


需求：

每个客户金额最高三个订单。


SQL：

```sql
SELECT *
FROM
(
SELECT

customer_id,

order_no,

amount,


ROW_NUMBER()
OVER(
PARTITION BY customer_id
ORDER BY amount DESC
) rn


FROM sale_order

)t

WHERE rn<=3;
```


---

# 七、窗口函数与GROUP BY区别


|GROUP BY|窗口函数|
|-|-|
|减少行数|保留行|
|统计|分析|
|报表汇总|排名分析|


---

# 八、性能优化


## 1. 窗口函数排序成本


例如：

```sql
ORDER BY salary DESC
```


大量数据：

需要排序。


---

## 2. 添加过滤条件


不要：

```sql
SELECT *
FROM employee;
```


推荐：

```sql
WHERE dept='销售部'
```


减少窗口计算数据。


---

# 九、练习题


## 基础练习


### 1

查询员工工资排名。


要求：

ROW_NUMBER。


---

### 2

查询员工部门工资排名。


要求：

PARTITION BY dept。


---

## 进阶练习


### 3

查询每个部门工资前三员工。


---

### 4

查询销售人员业绩排行。


---

### 5

查询每个客户最高金额订单。


---

## 高级练习


### 6

查询：

每个月销售额排名前三客户。


要求：

窗口函数 + 聚合。


---

# 十、Java + MyBatis应用


应用场景：

- 首页排行榜
- 销售大屏
- 数据分析


Mapper：

```xml
<select id="rankList">

SELECT *

FROM
(
 SELECT
 name,
 amount,
 RANK()
 OVER(
 ORDER BY amount DESC
 ) rank_no

 FROM sale_order

)t

</select>
```


---

# 十一、面试问题


1. 什么是窗口函数？

2. GROUP BY和窗口函数区别？

3. ROW_NUMBER和RANK区别？

4. 为什么窗口函数可能慢？

5. 如何实现每组TopN？


---

# 十二、最终实战任务


完成：

销售排行榜模块。


要求返回：

- 销售人员
- 销售金额
- 排名


扩展：

增加：

- 月排名
- 部门排名


---

# 十三、今日总结


掌握：

✅ 窗口函数概念

✅ ROW_NUMBER

✅ RANK

✅ DENSE_RANK

✅ PARTITION BY

✅ TopN查询


下一章节：

Day07：窗口函数进阶

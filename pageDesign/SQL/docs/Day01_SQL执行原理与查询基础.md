# SQL进阶 Day 1：SQL执行原理与查询基础

## 今日学习目标

完成今天学习后，你应该能够：

1.  理解 SQL 从提交到返回结果的大致过程
2.  掌握 SQL 逻辑执行顺序
3.  理解 WHERE、GROUP BY、HAVING、ORDER BY 的区别
4.  能分析简单 SQL 的执行逻辑
5.  为后续索引优化、执行计划学习打基础

学习时间建议：

-   理论：40分钟
-   实践：50分钟
-   总结：10分钟

------------------------------------------------------------------------

# 一、数据库查询整体流程

## 1. 用户提交SQL

示例：

``` sql
SELECT 
    name,
    age
FROM user
WHERE age > 20;
```

数据库执行过程：

    客户端
      |
    SQL发送
      |
    SQL解析器
      |
    查询优化器
      |
    执行计划
      |
    存储引擎
      |
    返回结果

------------------------------------------------------------------------

## 2. MySQL核心组件

    MySQL Server

    ├── 连接层
    │
    ├── SQL层
    │   ├── Parser SQL解析
    │   ├── Optimizer 优化器
    │   └── Executor 执行器
    │
    └── Storage Engine
        └── InnoDB

重点：

SQL优化本质是在影响优化器生成更好的执行计划。

------------------------------------------------------------------------

# 二、SQL逻辑执行顺序

写SQL时通常：

``` sql
SELECT
FROM
WHERE
GROUP BY
ORDER BY
```

但是数据库逻辑执行顺序：搞清楚来源（FROM)后连（JOIN)表查询去WHERE（过滤）、GROUP BY（分组）、HAVING（过滤组）、SELECT(返回）ORDER BY（排序）后 LIMIT（限制）数量

    1. FROM
    2. JOIN
    3. WHERE
    4. GROUP BY
    5. HAVING
    6. SELECT
    7. ORDER BY
    8. LIMIT

------------------------------------------------------------------------

## 示例

员工表：

  id   name   dept   salary
  ---- ------ ------ --------
  1    张三   研发   10000
  2    李四   研发   12000
  3    王五   销售   8000
  4    赵六   销售   9000

SQL：

``` sql
SELECT
    dept,
    AVG(salary)
FROM employee
WHERE salary > 8000
GROUP BY dept
HAVING AVG(salary)>9000
ORDER BY AVG(salary);
```

执行流程：

1.  FROM 找到 employee 表
2.  WHERE 过滤 salary \> 8000
3.  GROUP BY 按部门分组
4.  HAVING 过滤统计结果
5.  SELECT 返回字段
6.  ORDER BY 排序

------------------------------------------------------------------------

# 三、WHERE 和 HAVING 区别

## WHERE

作用：

过滤原始数据。

执行阶段：

    GROUP BY之前

示例：

``` sql
SELECT *
FROM employee
WHERE salary > 10000;
```

------------------------------------------------------------------------

## HAVING

作用：

过滤分组后的统计结果。

执行阶段：

    GROUP BY之后

示例：

``` sql
SELECT
 dept,
 AVG(salary)
FROM employee
GROUP BY dept
HAVING AVG(salary)>10000;
```

记忆：

    WHERE → 过滤数据行

    HAVING → 过滤统计结果

------------------------------------------------------------------------

# 四、SELECT字段执行问题

错误：

``` sql
SELECT
name,
COUNT(*)
FROM user;
```

原因：

name存在多个值，无法确定返回哪一个。

正确：

``` sql
SELECT
dept,
COUNT(*)
FROM user
GROUP BY dept;
```

------------------------------------------------------------------------

# 五、练习环境准备

数据库：

MySQL 8.0

工具：

DataGrip

创建数据库：

``` sql
CREATE DATABASE sql_learning;

USE sql_learning;
```

创建员工表：

``` sql
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

``` sql
INSERT INTO employee
(name,dept,salary,create_time)
VALUES
('张三','研发',10000,NOW()),
('李四','研发',12000,NOW()),
('王五','销售',8000,NOW()),
('赵六','销售',9000,NOW()),
('陈七','市场',7000,NOW());
```

------------------------------------------------------------------------

# 六、今日SQL练习题

## 练习1

查询所有员工：

返回：

-   姓名
-   部门
-   工资
-   

``` sql
SELECT 
  name,
  dept,
  salary 
FROM employee
```

## 练习2

查询工资大于9000员工。

``` sql
  SELECT
    name,
    dept,
    salary
FROM employee
WHERE salary > 9000;
```

## 练习3

统计每个部门人数。

``` sql
SELECT
  dept,
  COUNT(*)  AS user_count,
  SUM(salary) AS total_salary
FROM employee
GROUP BY dept;
```

## 练习4

统计每个部门平均工资。

``` sql
SELECT
  dept,
  AVG(salary) AS avg_salary
  FROM employee
  GROUP BY dept;

## 练习5

查询平均工资超过9000的部门。

``` sql
SELECT
  dept,
  AVG(salary) AS avg_salary
  FROM employee
  GROUP BY dept
  HAVING AVG(salary)>9000;
  ```

要求使用：

``` sql
GROUP BY
HAVING
```

------------------------------------------------------------------------

# 七、Java开发结合练习

分析MyBatis SQL：

``` xml
<select id="selectUserList">

SELECT
*
FROM user

WHERE status=#{status}

</select>
```

思考：

1.  FROM什么时候执行？
2.  WHERE什么时候过滤？
3.  如果数据量达到100万，会有什么问题？

------------------------------------------------------------------------

# 八、学习笔记模板

    SQL进阶笔记

    Day01 SQL执行模型

    1. SQL执行流程

    2. SQL逻辑顺序

    3. WHERE/HAVING区别

    4. 今日SQL练习

    5. 遇到的问题

------------------------------------------------------------------------

# 今日验收标准

完成后应该能回答：

-   SQL为什么不能直接按照SELECT顺序执行？
-   WHERE为什么不能使用COUNT？
-   HAVING为什么必须配合GROUP BY？
-   GROUP BY产生的数据是什么？
-   一条SQL从提交到返回经历哪些阶段？

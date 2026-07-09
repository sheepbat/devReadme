# SQL进阶 Day14：索引失效分析（完整版学习文档）

# 一、学习目标

Day14学习索引优化中的核心问题：

为什么创建了索引，SQL仍然很慢？

重点掌握：

- 索引失效原因
- 函数导致索引失效
- 隐式类型转换
- LIKE查询优化
- OR导致索引问题
- NULL条件查询
- 范围查询影响
- EXPLAIN定位问题


完成后能够：

1. 判断索引为什么没有使用
2. 修改SQL让索引生效
3. 优化企业慢查询
4. 分析执行计划


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务模型设计


模拟用户查询系统。


业务需求：

- 手机号查询用户
- 姓名查询用户
- 时间范围查询用户
- 状态筛选用户


生产环境：

用户表可能：

千万级。


---

# 四、创建用户表


```sql
DROP TABLE IF EXISTS user_info;


CREATE TABLE user_info
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 username VARCHAR(50),

 phone VARCHAR(20),

 age INT,

 status TINYINT,

 create_time DATETIME,


 INDEX idx_phone(phone),

 INDEX idx_name(username),

 INDEX idx_status_time(status,create_time)

);
```


---

# 五、插入测试数据


```sql
INSERT INTO user_info
(username,phone,age,status,create_time)

VALUES

('zhangsan','13800000001',20,1,'2026-01-01'),

('lisi','13800000002',30,1,'2026-01-02'),

('wangwu','13800000003',25,0,'2026-01-03');
```


---

# 六、知识点详细讲解


# 1.函数导致索引失效


错误：


```sql
SELECT *

FROM user_info

WHERE DATE(create_time)='2026-01-01';
```


原因：

对字段进行函数计算。

索引无法直接定位。


优化：


```sql
SELECT *

FROM user_info

WHERE create_time>='2026-01-01'

AND create_time<'2026-01-02';
```


---

# 2.隐式类型转换


例如：

字段：

```sql
phone VARCHAR(20)
```


错误：

```sql
WHERE phone=13800000001;
```


数据库需要转换类型。


正确：


```sql
WHERE phone='13800000001';
```


---

# 3.LIKE导致索引失效


有效：


```sql
WHERE username LIKE '张%';
```


原因：

前缀固定。


无效：


```sql
WHERE username LIKE '%张';
```


原因：

无法确定开始位置。


---

# 4.OR导致索引问题


SQL：


```sql
SELECT *

FROM user_info

WHERE phone='13800000001'

OR age=20;
```


可能：

无法有效利用索引。


优化：

拆分：


```sql
SELECT *

FROM user_info

WHERE phone='13800000001'


UNION


SELECT *

FROM user_info

WHERE age=20;
```


---

# 5.IS NULL查询


例如：


```sql
WHERE phone IS NULL;
```


是否使用索引：

取决于：

- 数据分布
- 索引情况


---

# 6.范围查询


例如：

```sql
WHERE age>20
```


范围查询后：

后续字段可能无法充分利用。


联合索引：

```
(a,b,c)
```


查询：

```sql
WHERE a=1

AND b>10

AND c=5
```


c可能无法使用。


---

# 七、EXPLAIN分析


示例：


```sql
EXPLAIN

SELECT *

FROM user_info

WHERE DATE(create_time)='2026-01-01';
```


关注：

## key

是否使用索引。


## rows

扫描数量。


## type

访问方式。


---

# 八、企业案例


# 案例1：订单查询变慢


原SQL：


```sql
SELECT *

FROM sale_order

WHERE DATE(create_time)=CURDATE();
```


问题：

索引失效。


优化：


```sql
WHERE create_time>=CURDATE()

AND create_time<CURDATE()+INTERVAL 1 DAY;
```


---

# 案例2：用户搜索


需求：

手机号查询。


错误：


```sql
WHERE CAST(phone AS SIGNED)=13800000001;
```


优化：

保持字段原类型。


---

# 九、优化原则


## 1.不要操作索引字段


避免：

- 函数
- 类型转换
- 运算


---

## 2.保持字段类型一致


Java：

String

对应：

VARCHAR


不要：

数字比较。


---

## 3.提前分析执行计划


优化流程：

```
慢SQL

↓

EXPLAIN

↓

发现问题

↓

调整SQL/索引
```


---

# 十、Java + MyBatis应用


错误：


```xml
<select id="query">

SELECT *

FROM user_info

WHERE DATE(create_time)=#{date}

</select>
```


优化：


```xml
<select id="query">

SELECT *

FROM user_info

WHERE create_time>=#{start}

AND create_time&lt;#{end}

</select>
```


---

# 十一、练习题


## 基础


1. 找出索引失效SQL。

2. 优化时间查询。


---

## 进阶


3. 优化LIKE查询。

4. 优化OR查询。

5. 分析隐式转换。


---

## 高级


6. 设计用户搜索索引。

7. 优化订单查询接口。

8. 使用EXPLAIN验证。


---

# 十二、面试问题


1. 为什么函数会导致索引失效？

2. 什么是隐式类型转换？

3. LIKE什么时候走索引？

4. 为什么OR可能导致全表扫描？

5. 联合索引范围查询有什么影响？


---

# 十三、最终实战任务


优化：

用户列表接口。


原需求：

支持：

- 手机号搜索
- 状态筛选
- 时间范围


要求：

输出：

SQL优化方案 + 索引方案。


---

# 十四、总结


掌握：

✅ 索引失效原因

✅ SQL改写

✅ EXPLAIN分析

✅ 企业慢SQL优化


下一章节：

Day15：EXPLAIN执行计划

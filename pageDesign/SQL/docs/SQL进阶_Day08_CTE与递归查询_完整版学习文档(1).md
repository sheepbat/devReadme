# SQL进阶 Day08：CTE与递归查询（完整版学习文档）

# 一、学习目标

Day08学习企业系统中非常常见的层级数据查询。

重点掌握：

- CTE(Common Table Expression)
- WITH语法
- 普通CTE
- 递归CTE
- 树形结构查询
- 组织架构查询
- 菜单权限树查询


完成后能够：

1. 查询部门层级关系
2. 查询权限菜单树
3. 处理父子结构数据
4. 使用SQL解决递归问题


---

# 二、环境准备


## 创建数据库


```sql
CREATE DATABASE IF NOT EXISTS sql_learning;

USE sql_learning;
```


---

# 三、业务模型设计


企业系统常见树结构：


```
公司

 |

部门

 |

子部门

 |

员工
```


例如：

```
总部

├── 技术部

│   ├── 前端组

│   └── 后端组

└── 销售部

    └── 华东销售组
```


---

# 四、创建部门表


```sql
DROP TABLE IF EXISTS department;


CREATE TABLE department
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 name VARCHAR(100),

 parent_id BIGINT DEFAULT 0,

 sort_no INT,

 INDEX idx_parent(parent_id)
);
```


插入数据：


```sql
INSERT INTO department
(name,parent_id,sort_no)
VALUES

('总部',0,1),

('技术部',1,2),

('前端组',2,3),

('后端组',2,4),

('销售部',1,5),

('华东销售组',5,6);
```


---

# 五、知识点详细讲解


# 1.什么是CTE


CTE：

Common Table Expression。


作用：

先定义一个临时结果集，然后在后续SQL中使用。


语法：


```sql
WITH temp AS
(
 SELECT ...
)

SELECT *

FROM temp;
```


特点：

- SQL更清晰
- 方便复杂查询拆分
- 支持递归


---

# 2.普通CTE


例如：

查询高薪员工：

```sql
WITH high_salary AS
(
 SELECT *
 FROM employee
 WHERE salary>10000
)

SELECT *

FROM high_salary;
```


执行：

第一步：

生成临时结果。


第二步：

查询临时结果。


---

# 3.递归CTE


递归CTE包含两部分：


## 初始查询


找到根节点。


## 递归查询


不断查询子节点。


结构：


```sql
WITH RECURSIVE temp AS
(

初始查询

UNION ALL

递归查询

)

SELECT *

FROM temp;
```


---

# 六、企业案例


# 案例1：查询全部部门树


SQL：


```sql
WITH RECURSIVE dept_tree AS
(

SELECT

id,

name,

parent_id,

1 level

FROM department

WHERE parent_id=0


UNION ALL


SELECT

d.id,

d.name,

d.parent_id,

t.level+1

FROM department d

JOIN dept_tree t

ON d.parent_id=t.id

)

SELECT *

FROM dept_tree;
```


结果：


```
总部 level=1

技术部 level=2

前端组 level=3
```


---

# 案例2：查询某部门所有子部门


需求：

查询技术部下面所有组织。


```sql
WITH RECURSIVE dept_tree AS
(

SELECT *

FROM department

WHERE id=2


UNION ALL


SELECT d.*

FROM department d

JOIN dept_tree t

ON d.parent_id=t.id

)

SELECT *

FROM dept_tree;
```


---

# 案例3：菜单权限树


权限表：


```
menu

id

parent_id

name
```


查询：

用户拥有的全部菜单。


应用：

- 后台管理系统
- 权限系统
- 菜单管理


---

# 七、CTE与子查询区别


|CTE|子查询|
|-|-|
|结构清晰|嵌套复杂|
|支持递归|不支持递归|
|适合复杂SQL|适合简单查询|


---

# 八、性能优化


## 1.递归层级控制


风险：

无限递归。


建议：

增加层级字段。


例如：

```sql
level
```


限制：

```sql
WHERE level<10
```


---

## 2.父子字段建立索引


必须：

```sql
CREATE INDEX idx_parent
ON department(parent_id);
```


否则：

每层递归扫描全部数据。


---

# 九、练习题


## 基础


1. 查询所有一级部门。


2. 查询所有子部门。


3. 查询部门层级。


---

## 进阶


4. 查询某部门所有下级组织。


5. 查询组织树结构。


6. 增加level显示层级。


---

## 高级


7. 设计权限菜单树查询。


8. 查询用户拥有菜单。


9. 优化百万级菜单查询。


---

# 十、Java + MyBatis应用


典型场景：

后台菜单加载。


Mapper：


```xml
<select id="menuTree">

WITH RECURSIVE menu_tree AS

(
 SELECT *
 FROM menu
 WHERE parent_id=0
)

SELECT *

FROM menu_tree

</select>
```


返回：

Tree结构DTO。


---

# 十一、面试问题


1. 什么是CTE？

2. CTE和临时表区别？

3. 如何实现树形查询？

4. 递归SQL如何避免死循环？

5. 菜单权限树如何设计？


---

# 十二、最终实战任务


实现：

企业权限菜单查询。


要求：

数据：

- 菜单表
- 用户表
- 角色表


输出：

```
系统管理

 ├ 用户管理

 ├ 角色管理

业务管理

 ├ 客户管理
```


---

# 十三、总结


掌握：

✅ WITH

✅ WITH RECURSIVE

✅ 树结构查询

✅ 组织架构查询

✅ 权限菜单查询


下一章节：

Day09：分页查询优化

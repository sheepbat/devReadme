# SQL进阶 Day23：权限系统数据库设计（完整版学习文档）

# 一、学习目标

Day23学习企业后台系统最常见的权限模型。

重点掌握：

- RBAC权限模型
- 用户设计
- 角色设计
- 菜单权限设计
- 用户角色关系
- 角色菜单关系
- 数据权限设计
- 权限查询SQL


完成后能够：

1. 设计企业权限数据库
2. 实现用户-角色-权限关系
3. 编写权限查询SQL
4. 理解后台管理系统权限结构


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS auth_learning;

USE auth_learning;
```


---

# 三、权限业务模型


企业后台权限：


```
用户

 |

角色

 |

权限

 |

菜单/API
```


例如：


管理员：

拥有全部权限。


销售人员：

只能访问销售模块。


---

# 四、RBAC模型


RBAC：

Role Based Access Control。


核心思想：

用户通过角色获得权限。


结构：


```
User

 |

User_Role

 |

Role

 |

Role_Permission

 |

Permission

```


---

# 五、用户表设计


```sql
CREATE TABLE sys_user
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 username VARCHAR(50),

 password VARCHAR(100),

 status TINYINT,

 create_time DATETIME
);
```


---

# 六、角色表设计


```sql
CREATE TABLE sys_role
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 role_name VARCHAR(50),

 code VARCHAR(50),

 status TINYINT
);
```


示例：


```
ADMIN

SALE_MANAGER

SALE_USER
```


---

# 七、权限菜单表


```sql
CREATE TABLE sys_menu
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 parent_id BIGINT DEFAULT 0,

 menu_name VARCHAR(50),

 path VARCHAR(100),

 type TINYINT,


 INDEX idx_parent(parent_id)

);
```


支持树结构：


```
系统管理

 |

用户管理

 |

角色管理
```


---

# 八、关系表设计


# 用户角色关系


```sql
CREATE TABLE sys_user_role
(
 user_id BIGINT,

 role_id BIGINT,


PRIMARY KEY(user_id,role_id)

);
```


---

# 角色菜单关系


```sql
CREATE TABLE sys_role_menu
(
 role_id BIGINT,

 menu_id BIGINT,


PRIMARY KEY(role_id,menu_id)

);
```


---

# 九、知识点详细讲解


# 1.为什么需要RBAC


错误设计：

用户表保存：

```
user_id

权限1

权限2

权限3
```


问题：

权限变化困难。


RBAC：

用户关联角色。

角色关联权限。


---

# 2.多对多关系设计


用户：

多个角色。


角色：

多个用户。


使用中间表。


---

# 3.菜单树设计


字段：

```sql
parent_id
```


表示：

父菜单。


查询：

使用：

递归CTE。


---

# 十、权限查询案例


# 案例1：查询用户角色


```sql
SELECT

r.role_name

FROM sys_user_role ur

JOIN sys_role r

ON ur.role_id=r.id

WHERE ur.user_id=1;
```


---

# 案例2：查询用户菜单


```sql
SELECT

m.menu_name

FROM sys_role_menu rm

JOIN sys_menu m

ON rm.menu_id=m.id

WHERE rm.role_id=1;
```


---

# 案例3：查询用户全部权限


```sql
SELECT

DISTINCT m.id,

m.menu_name


FROM sys_user_role ur

JOIN sys_role_menu rm

ON ur.role_id=rm.role_id

JOIN sys_menu m

ON rm.menu_id=m.id

WHERE ur.user_id=1;
```


---

# 十一、数据权限设计


除了菜单权限：

还有数据权限。


例如：

销售只能查看自己的客户。


字段：

```text
data_scope
```


类型：

```
全部数据

本人数据

部门数据
```


---

# 十二、索引设计


用户查询：

```sql
(username)
```


角色查询：

```sql
(code)
```


权限查询：

```sql
(role_id,menu_id)
```


---

# 十三、Java + MyBatis应用


登录流程：


```
用户登录

↓

查询用户

↓

查询角色

↓

查询权限

↓

生成Token
```


Mapper：


```xml
<select id="findUserPermission">

SELECT *

FROM sys_menu

WHERE user_id=#{id}

</select>
```


---

# 十四、练习题


## 基础


1. 创建用户表。

2. 创建角色表。


---

## 进阶


3. 实现用户角色查询。

4. 实现菜单权限查询。


---

## 高级


5. 设计数据权限。

6. 设计多租户权限。


---

# 十五、面试问题


1. 什么是RBAC？

2. 为什么使用中间表？

3. 用户权限如何查询？

4. 菜单树如何设计？

5. 数据权限如何实现？


---

# 十六、最终实战任务


设计：

企业后台权限系统。


要求：

支持：

- 用户管理
- 角色管理
- 菜单管理
- 数据权限


输出：

完整表结构设计。


---

# 十七、总结


掌握：

✅ RBAC模型

✅ 权限表设计

✅ 多对多关系

✅ 菜单树

✅ 数据权限


下一章节：

Day24：工作流系统数据库设计

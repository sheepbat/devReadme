# SQL进阶 Day48：数据库安全与权限综合实战（完整版学习文档）

# 一、学习目标

Day48学习企业后台系统数据库安全设计。

重点掌握：

- 数据库安全体系
- RBAC权限模型
- 数据权限设计
- 字段级权限
- 行级权限
- 敏感数据保护
- 审计日志
- 企业后台系统权限案例


完成后能够：

1. 设计企业权限数据库
2. 实现角色权限控制
3. 保护敏感业务数据
4. 建立数据库审计体系


---

# 二、数据库安全体系


安全目标：


```
身份认证

↓

权限控制

↓

数据保护

↓

行为审计
```


---

# 三、RBAC权限模型


RBAC：

Role Based Access Control。


核心关系：


```
用户

↓

角色

↓

权限
```


---

# 四、权限数据库设计


核心表：


```
sys_user

sys_role

sys_permission

user_role

role_permission
```


---

# 五、用户表设计


```sql
CREATE TABLE sys_user
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 username VARCHAR(50),

 password VARCHAR(100),

 status TINYINT
);
```


---

# 六、角色表设计


```sql
CREATE TABLE sys_role
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 role_name VARCHAR(50),

 code VARCHAR(50)
);
```


---

# 七、权限表设计


```sql
CREATE TABLE sys_permission
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 name VARCHAR(100),

 permission_code VARCHAR(100)
);
```


---

# 八、关系表设计


用户角色：


```sql
CREATE TABLE user_role
(
 user_id BIGINT,

 role_id BIGINT
);
```


角色权限：


```sql
CREATE TABLE role_permission
(
 role_id BIGINT,

 permission_id BIGINT
);
```


---

# 九、权限查询SQL


查询用户权限：


```sql
SELECT

p.permission_code

FROM sys_user u

JOIN user_role ur

ON u.id=ur.user_id

JOIN role_permission rp

ON ur.role_id=rp.role_id

JOIN sys_permission p

ON rp.permission_id=p.id;
```


---

# 十、数据权限设计


权限类型：


## 功能权限


能不能操作。


例如：

新增客户。


---

## 数据权限


能看到哪些数据。


例如：

销售只能查看自己的客户。


---

# 十一、行级权限


例如：

客户表：


```sql
owner_id
```


查询：


```sql
WHERE owner_id=#{userId}
```


---

# 十二、字段级权限


敏感字段：


例如：

身份证。


普通用户：

隐藏。


管理员：

显示。


---

# 十三、敏感数据保护


保护：

- 手机号
- 身份证
- 银行信息


方式：

- 加密
- 脱敏
- 访问控制


---

# 十四、审计日志设计


记录：

- 用户
- 操作
- 时间
- 数据


表：


```sql
CREATE TABLE audit_log
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 user_id BIGINT,

 action VARCHAR(50),

 create_time DATETIME
);
```


---

# 十五、企业案例


## 后台管理系统


权限：

```
管理员

销售经理

销售人员

财务人员
```


数据范围：

不同角色不同。


---

# 十六、安全开发规范


禁止：

- 明文密码
- SQL拼接
- 无权限查询


推荐：

- 参数绑定
- 加密存储
- 权限校验


---

# 十七、练习题


## 基础


1. 设计RBAC模型。

2. 创建权限表。


---

## 进阶


3. 查询用户权限。

4. 设计数据权限。


---

## 高级


5. 设计企业后台权限系统。

6. 设计审计方案。


---

# 十八、面试问题


1. RBAC是什么？

2. 如何设计权限系统？

3. 行级权限如何实现？

4. 如何保护敏感数据？

5. 为什么需要审计日志？


---

# 十九、最终实战任务


设计：

企业后台权限系统。


要求：

包含：

- 用户
- 角色
- 权限
- 数据范围
- 审计


输出：

完整权限数据库方案。


---

# 二十、总结


掌握：

✅ RBAC

✅ 数据权限

✅ 字段权限

✅ 敏感数据保护

✅ 审计体系


下一章节：

Day49：数据库迁移与版本管理

# SQL进阶 Day26：数据库安全设计（完整版学习文档）

# 一、学习目标

Day26学习企业数据库安全设计。

重点掌握：

- 数据库安全体系
- 用户权限管理
- 最小权限原则
- SQL注入防护
- 敏感数据加密
- 数据脱敏
- 审计日志设计
- MyBatis安全实践


完成后能够：

1. 设计安全数据库访问方案
2. 防止常见SQL安全问题
3. 保护敏感业务数据
4. 建立数据库审计机制


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS security_learning;

USE security_learning;
```


---

# 三、数据库安全场景


企业系统数据：

- 用户信息
- 手机号
- 身份信息
- 订单金额
- 财务数据


需要保护：

```
谁可以访问

↓

访问什么数据

↓

什么时候访问

↓

是否记录
```


---

# 四、数据库用户权限设计


MySQL用户：


```sql
CREATE USER 'app_user'

IDENTIFIED BY 'password';
```


授权：


```sql
GRANT SELECT,INSERT,UPDATE

ON security_learning.*

TO 'app_user';
```


---

# 五、最小权限原则


原则：

只给需要的权限。


错误：


```sql
GRANT ALL PRIVILEGES;
```


问题：

风险扩大。


推荐：


查询服务：

SELECT。


写服务：

INSERT、UPDATE。


---

# 六、业务表设计


## 用户信息表


```sql
CREATE TABLE user_info
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 username VARCHAR(50),

 phone VARCHAR(20),

 id_card VARCHAR(50),

 create_time DATETIME
);
```


---

# 七、知识点详细讲解


# 1.SQL注入


危险：


用户输入：


```
' OR 1=1
```


拼接SQL：


```sql
SELECT *

FROM user

WHERE username='输入内容';
```


可能绕过条件。


---

# 2.防SQL注入


不要：

字符串拼接。


错误：


```java
"select * from user where name='"+name+"'"
```


正确：

参数绑定。


MyBatis：


```xml
<select id="findUser">

SELECT *

FROM user_info

WHERE username=#{username}

</select>
```


---

# 3.敏感数据加密


敏感字段：

- 手机号
- 身份证
- 银行账号


方案：

应用层加密。


例如：

AES。


数据库保存：

密文。


---

# 4.数据脱敏


展示：

手机号：

```
138****0000
```


SQL：

```sql
CONCAT(
LEFT(phone,3),
'****',
RIGHT(phone,4)
)
```


---

# 八、审计日志设计


记录：

- 谁访问
- 什么操作
- 时间
- 数据


表：


```sql
CREATE TABLE operation_log
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 user_id BIGINT,

 action VARCHAR(50),

 create_time DATETIME
);
```


---

# 九、企业案例


# 案例1：后台用户查询


要求：

普通员工：

只能查看客户名称。


管理员：

查看全部。


方案：

数据权限控制。


---

# 案例2：手机号保护


数据库：

保存加密。


展示：

脱敏。


---

# 十、MyBatis安全实践


## 1.参数绑定


推荐：

```xml
#{param}
```


避免：

```xml
${param}
```


区别：

#{}

预编译。


${}

字符串替换。


---

# 十一、索引与安全


安全字段查询：

例如：

用户手机号。


建立：

```sql
INDEX(phone)
```


但是：

敏感查询需要权限控制。


---

# 十二、练习题


## 基础


1. 创建数据库用户。

2. 分配权限。


---

## 进阶


3. 防止SQL注入。

4. 设计脱敏方案。


---

## 高级


5. 设计数据库审计系统。

6. 设计敏感数据保护方案。


---

# 十三、面试问题


1. 如何防止SQL注入？

2. #{ }和${ }区别？

3. 什么是最小权限？

4. 数据脱敏如何实现？

5. 为什么需要审计日志？


---

# 十四、最终实战任务


设计：

企业CRM数据库安全方案。


要求：

包含：

- 用户权限
- 数据脱敏
- 审计日志
- SQL安全


输出：

数据库安全设计文档。


---

# 十五、总结


掌握：

✅ 数据库权限

✅ SQL注入防护

✅ 数据加密

✅ 数据脱敏

✅ 审计设计


下一章节：

Day27：数据库备份恢复

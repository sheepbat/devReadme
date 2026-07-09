# SQL进阶 Day41：数据库高级项目实战（CRM系统）（完整版学习文档）

# 一、学习目标

Day41进入企业级数据库项目设计。

项目：

CRM客户管理系统。


重点掌握：

- 企业CRM数据库设计
- 客户360视图
- 销售流程建模
- 商机管理
- 跟进记录
- 权限结合
- 多租户设计
- 数据统计报表


完成后能够：

1. 设计企业CRM数据库
2. 建立复杂业务关系模型
3. 支撑销售管理场景
4. 输出企业级数据库方案


---

# 二、项目背景


CRM系统用于管理：

- 客户
- 联系人
- 销售机会
- 跟进记录
- 合同
- 回款


业务流程：


```
线索

↓

客户

↓

商机

↓

报价

↓

合同

↓

回款
```


---

# 三、数据库整体设计


核心表：


```
customer

contact

opportunity

follow_record

contract

payment_record
```


---

# 四、租户设计


SaaS场景：

多个企业使用。


所有业务表：

增加：


```sql
tenant_id
```


---

# 五、客户表设计


```sql
CREATE TABLE customer
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 tenant_id BIGINT,

 customer_name VARCHAR(100),

 level TINYINT,

 owner_id BIGINT,

 status TINYINT,

 create_time DATETIME,


 INDEX idx_tenant(tenant_id)

);
```


---

# 六、联系人表设计


```sql
CREATE TABLE contact
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 name VARCHAR(50),

 phone VARCHAR(20),

 email VARCHAR(100),


 INDEX idx_customer(customer_id)

);
```


---

# 七、商机表设计


```sql
CREATE TABLE opportunity
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 name VARCHAR(100),

 amount DECIMAL(12,2),

 stage TINYINT,

 owner_id BIGINT
);
```


阶段：

```
初始

沟通

报价

成交

失败
```


---

# 八、跟进记录设计


```sql
CREATE TABLE follow_record
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 content TEXT,

 follow_user BIGINT,

 create_time DATETIME
);
```


---

# 九、合同表设计


```sql
CREATE TABLE contract
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 customer_id BIGINT,

 contract_no VARCHAR(50),

 amount DECIMAL(12,2),

 status TINYINT
);
```


---

# 十、客户360视图设计


客户详情需要展示：

- 基本信息
- 联系人
- 商机
- 跟进记录
- 合同


查询：

多表关联。


---

# 十一、统计报表设计


销售统计：

例如：

销售额排行。


SQL：


```sql
SELECT

owner_id,

SUM(amount)

FROM contract

GROUP BY owner_id;
```


---

# 十二、权限结合


CRM权限：


```
用户

↓

角色

↓

数据范围

↓

客户数据
```


例如：

销售只能查看自己的客户。


---

# 十三、多租户结合


查询必须：


```sql
WHERE tenant_id=#{tenantId}
```


防止：

数据泄露。


---

# 十四、索引设计


客户：

```sql
(tenant_id,owner_id)
```


跟进：

```sql
(customer_id,create_time)
```


商机：

```sql
(customer_id,stage)
```


---

# 十五、练习任务


## 基础


1. 创建CRM核心表。

2. 插入测试数据。


---

## 进阶


3. 查询客户360信息。

4. 查询销售业绩。


---

## 高级


5. 设计CRM多租户。

6. 设计数据权限。


---

# 十六、面试问题


1. CRM数据库如何设计？

2. 客户和联系人如何关联？

3. 如何实现数据权限？

4. 多租户如何隔离？

5. 如何设计销售报表？


---

# 十七、最终实战任务


设计：

企业CRM平台数据库。


要求：

支持：

- 多租户
- 权限
- 客户管理
- 商机管理
- 合同管理
- 报表分析


输出：

完整数据库设计方案。


---

# 十八、总结


掌握：

✅ CRM业务建模

✅ 客户360

✅ 商机模型

✅ 多租户

✅ 数据权限

✅ 企业报表


下一章节：

Day42：数据仓库与ETL设计

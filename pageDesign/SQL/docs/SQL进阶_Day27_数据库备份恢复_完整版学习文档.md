# SQL进阶 Day27：数据库备份恢复（完整版学习文档）

# 一、学习目标

Day27学习数据库运维核心能力：

备份与恢复。


重点掌握：

- 为什么需要备份
- 备份策略
- 逻辑备份
- 物理备份
- mysqldump
- binlog恢复
- 全量备份
- 增量备份
- 灾备方案设计


完成后能够：

1. 制定企业数据库备份方案
2. 完成数据库恢复
3. 理解binlog恢复机制
4. 处理数据误删除事故


---

# 二、环境准备


查看MySQL版本：

```sql
SELECT VERSION();
```


创建测试数据库：


```sql
CREATE DATABASE backup_learning;

USE backup_learning;
```


---

# 三、为什么需要备份


数据库风险：


## 1.误操作


例如：

```sql
DELETE FROM customer;
```


## 2.程序错误


批量更新错误。


## 3.服务器故障


磁盘损坏。


## 4.安全事件


数据破坏。


---

# 四、备份分类


# 1.逻辑备份


特点：

导出SQL。


例如：

```
CREATE TABLE

INSERT DATA
```


工具：

mysqldump。


优点：

简单。


缺点：

恢复慢。


---

# 2.物理备份


直接复制数据文件。


优点：

恢复快。


缺点：

依赖环境。


---

# 五、创建测试表


```sql
CREATE TABLE employee
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 name VARCHAR(50),

 salary DECIMAL(10,2)
);
```


插入数据：


```sql
INSERT INTO employee
(name,salary)

VALUES

('张三',10000),

('李四',15000);
```


---

# 六、mysqldump备份


备份数据库：


```bash
mysqldump

-u root

-p

backup_learning

> backup.sql
```


生成：

```
backup.sql
```


包含：

- 表结构
- 数据


---

# 七、恢复数据库


创建数据库：


```sql
CREATE DATABASE backup_restore;
```


执行：


```bash
mysql

-u root

-p

backup_restore

< backup.sql
```


---

# 八、binlog日志


binlog：

记录数据库变化。


记录：

- INSERT
- UPDATE
- DELETE


用途：

1. 主从复制

2. 数据恢复


---

# 九、误删除恢复案例


场景：

上午10点：

误删除订单。


目标：

恢复到删除之前。


流程：


```
全量备份

+

binlog

↓

恢复
```


---

# 十、全量备份


特点：

备份全部数据。


例如：

每天凌晨：

```
02:00
```


执行全备。


---

# 十一、增量备份


只备份变化。


优点：

空间小。


缺点：

恢复复杂。


---

# 十二、企业备份策略


推荐：


```
每天全量备份

+

binlog持续保存

+

定期恢复测试
```


例如：


生产：

保留30天。


---

# 十三、恢复演练


步骤：


1. 创建测试库。


2. 导入备份。


3. 验证数据。


4. 模拟恢复。


注意：

备份必须验证。


---

# 十四、企业案例


## 案例1：订单误删除


处理：

1. 停止写入。

2. 找最近备份。

3. 使用binlog恢复。

4. 验证数据。


---

## 案例2：数据库服务器故障


方案：

- 主库
- 备库
- 自动切换


---

# 十五、MySQL主从基础


结构：


```
Master

 |

Binlog

 |

Slave
```


作用：

- 读写分离
- 故障备用


---

# 十六、练习题


## 基础


1. 使用mysqldump备份数据库。

2. 恢复数据库。


---

## 进阶


3. 设计每日备份策略。

4. 分析误删除恢复流程。


---

## 高级


5. 设计企业灾备方案。

6. 设计主从复制方案。


---

# 十七、面试问题


1. 为什么需要备份？

2. mysqldump是什么？

3. binlog有什么作用？

4. 如何恢复误删除数据？

5. 全量和增量备份区别？


---

# 十八、最终实战任务


设计：

企业订单数据库灾备方案。


要求：

包含：

- 备份周期
- 恢复流程
- binlog策略
- 主从方案


---

# 十九、总结


掌握：

✅ 逻辑备份

✅ 物理备份

✅ mysqldump

✅ binlog

✅ 数据恢复

✅ 灾备设计


下一章节：

Day28：MySQL主从复制

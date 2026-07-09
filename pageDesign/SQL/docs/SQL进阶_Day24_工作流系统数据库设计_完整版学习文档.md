# SQL进阶 Day24：工作流系统数据库设计（完整版学习文档）

# 一、学习目标

Day24学习企业系统中的流程数据库设计。

典型场景：

- 请假审批
- 报销审批
- 合同审批
- 项目审批


重点掌握：

- 工作流数据模型
- 流程定义
- 流程节点
- 流程实例
- 任务表设计
- 审批记录
- 状态流转


完成后能够：

1. 设计简单流程引擎数据库
2. 理解流程运行数据结构
3. 编写审批查询SQL
4. 支撑企业审批系统开发


---

# 二、环境准备


```sql
CREATE DATABASE IF NOT EXISTS workflow_learning;

USE workflow_learning;
```


---

# 三、工作流业务分析


审批流程：


```
提交申请

↓

部门负责人审批

↓

财务审批

↓

结束
```


系统需要保存：

- 流程模板
- 当前节点
- 审批人
- 审批结果


---

# 四、整体数据模型


核心表：


```
process_definition

process_node

process_instance

task

approve_record
```


关系：


```
流程定义

 |

流程实例

 |

任务

 |

审批记录
```


---

# 五、流程定义表


保存：

流程模板。


```sql
CREATE TABLE process_definition
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 name VARCHAR(100),

 code VARCHAR(50),

 version INT,

 status TINYINT,

 create_time DATETIME
);
```


示例：

```
费用报销流程

合同审批流程
```


---

# 六、流程节点表


```sql
CREATE TABLE process_node
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 process_id BIGINT,

 node_name VARCHAR(100),

 node_type TINYINT,

 sort_no INT,


 INDEX idx_process(process_id)

);
```


节点：

```
开始

审批

结束
```


---

# 七、流程实例表


保存：

一次真实流程。


```sql
CREATE TABLE process_instance
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 process_id BIGINT,

 business_id BIGINT,

 status TINYINT,

 current_node BIGINT,

 create_time DATETIME,


 INDEX idx_business(business_id)

);
```


状态：

```
1运行中

2完成

3拒绝

4撤销
```


---

# 八、任务表设计


当前待处理任务。


```sql
CREATE TABLE task
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 instance_id BIGINT,

 node_id BIGINT,

 assignee BIGINT,

 status TINYINT,


 INDEX idx_assignee(assignee)

);
```


---

# 九、审批记录表


记录历史。


```sql
CREATE TABLE approve_record
(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 task_id BIGINT,

 user_id BIGINT,

 result TINYINT,

 remark VARCHAR(500),

 create_time DATETIME
);
```


---

# 十、知识点详细讲解


# 1.为什么流程需要拆表


错误：

一个审批表保存所有信息。


问题：

- 无法扩展
- 历史记录混乱


正确：

模板数据。

运行数据。

历史数据。

分离。


---

# 2.流程定义和实例区别


流程定义：

模板。


例如：

请假审批流程。


流程实例：

一次具体申请。


例如：

张三2026年请假。


---

# 3.状态机设计


流程本质：

状态变化。


例如：


```
待审批

↓

审批中

↓

通过

↓

完成
```


---

# 十一、业务查询案例


## 查询用户待审批任务


```sql
SELECT *

FROM task

WHERE assignee=1001

AND status=1;
```


---

## 查询流程审批历史


```sql
SELECT *

FROM approve_record

WHERE task_id=10

ORDER BY create_time;
```


---

## 查询当前流程状态


```sql
SELECT

status,

current_node

FROM process_instance

WHERE id=100;
```


---

# 十二、索引设计


任务查询：

```sql
(assignee,status)
```


流程查询：

```sql
(business_id)
```


审批记录：

```sql
(task_id,create_time)
```


---

# 十三、Java + MyBatis应用


审批列表：


```xml
<select id="todoList">


SELECT *

FROM task

WHERE assignee=#{userId}

AND status=1


</select>
```


返回：

TodoTaskDTO。


---

# 十四、练习题


## 基础


1. 设计审批流程表。

2. 创建任务表。


---

## 进阶


3. 查询待审批任务。

4. 查询审批历史。


---

## 高级


5. 设计多节点审批。

6. 设计会签流程。


---

# 十五、面试问题


1. 流程定义和实例有什么区别？

2. 为什么需要审批记录？

3. 流程状态如何设计？

4. 如何查询待办任务？

5. 如何支持流程版本？


---

# 十六、最终实战任务


设计：

企业合同审批系统。


要求：

支持：

- 流程配置
- 节点审批
- 审批记录
- 状态流转


输出：

完整数据库设计。


---

# 十七、总结


掌握：

✅ 工作流模型

✅ 流程定义

✅ 流程实例

✅ 任务设计

✅ 审批记录


下一章节：

Day25：多租户数据库设计

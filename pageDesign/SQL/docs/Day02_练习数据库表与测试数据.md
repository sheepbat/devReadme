# SQL进阶 Day02：练习数据库表与测试数据

## 一、使用说明

本文件用于配合 Day02 学习内容：

- `CASE WHEN`
- `IF`
- `NULL` 判断
- `COALESCE`
- `COUNT(*)` 与 `COUNT(column)`
- 业务状态转换
- 部门统计

建议数据库环境：

- MySQL 8.0
- DataGrip

执行顺序：

1. 创建数据库
2. 切换数据库
3. 创建表
4. 插入测试数据
5. 执行验证SQL
6. 完成练习题

---

# 二、创建练习数据库

```sql
CREATE DATABASE IF NOT EXISTS sql_learning
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE sql_learning;
```

---

# 三、删除旧表

```sql
DROP TABLE IF EXISTS sale_order;
DROP TABLE IF EXISTS employee;
```

---

# 四、员工表 employee

## 1. 表结构说明

| 字段名 | 类型 | 是否允许NULL | 说明 |
|---|---|---:|---|
| id | BIGINT | 否 | 主键，自增 |
| name | VARCHAR(50) | 否 | 员工姓名 |
| dept | VARCHAR(50) | 否 | 所属部门 |
| salary | DECIMAL(10,2) | 是 | 工资，允许为空 |
| phone | VARCHAR(20) | 是 | 手机号，允许为空 |
| status | TINYINT | 否 | 状态：1正常，0禁用 |
| create_time | DATETIME | 否 | 创建时间 |

## 2. 创建员工表

```sql
CREATE TABLE employee
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '员工ID',
    name        VARCHAR(50)  NOT NULL COMMENT '员工姓名',
    dept        VARCHAR(50)  NOT NULL COMMENT '所属部门',
    salary      DECIMAL(10,2) NULL COMMENT '工资',
    phone       VARCHAR(20)   NULL COMMENT '手机号',
    status      TINYINT       NOT NULL DEFAULT 1 COMMENT '状态：1正常，0禁用',
    create_time DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '员工表';
```

## 3. 插入员工测试数据

```sql
INSERT INTO employee
(
    name,
    dept,
    salary,
    phone,
    status,
    create_time
)
VALUES
('张三', '研发部', 12000.00, '13800000001', 1, '2026-07-01 09:00:00'),
('李四', '研发部', 15000.00, NULL,          1, '2026-07-01 09:10:00'),
('王五', '研发部', NULL,     '13800000003', 0, '2026-07-01 09:20:00'),
('赵六', '销售部', 9000.00,  '13800000004', 1, '2026-07-02 10:00:00'),
('陈七', '销售部', 11000.00, NULL,          1, '2026-07-02 10:10:00'),
('孙八', '销售部', 7000.00,  '13800000006', 0, '2026-07-02 10:20:00'),
('周九', '市场部', 8000.00,  NULL,          1, '2026-07-03 11:00:00'),
('吴十', '市场部', 8500.00,  '13800000008', 1, '2026-07-03 11:10:00');
```

---

# 五、销售订单表 sale_order

## 1. 表结构说明

| 字段名 | 类型 | 是否允许NULL | 说明 |
|---|---|---:|---|
| id | BIGINT | 否 | 主键，自增 |
| order_no | VARCHAR(50) | 否 | 订单编号 |
| customer_name | VARCHAR(100) | 否 | 客户名称 |
| amount | DECIMAL(12,2) | 否 | 订单金额 |
| status | TINYINT | 否 | 订单状态 |
| remark | VARCHAR(255) | 是 | 备注，允许为空 |
| create_time | DATETIME | 否 | 创建时间 |

状态定义：

| status | 含义 |
|---:|---|
| 1 | 待支付 |
| 2 | 已支付 |
| 3 | 已关闭 |
| 4 | 已退款 |

## 2. 创建销售订单表

```sql
CREATE TABLE sale_order
(
    id            BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no      VARCHAR(50)   NOT NULL COMMENT '订单编号',
    customer_name VARCHAR(100)  NOT NULL COMMENT '客户名称',
    amount        DECIMAL(12,2) NOT NULL COMMENT '订单金额',
    status        TINYINT       NOT NULL COMMENT '订单状态：1待支付，2已支付，3已关闭，4已退款',
    remark        VARCHAR(255)  NULL COMMENT '备注',
    create_time   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_sale_order_order_no (order_no)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '销售订单表';
```

## 3. 插入订单测试数据

```sql
INSERT INTO sale_order
(
    order_no,
    customer_name,
    amount,
    status,
    remark,
    create_time
)
VALUES
('SO20260701001', '华东科技有限公司', 120000.00, 2, '重点客户订单', '2026-07-01 10:00:00'),
('SO20260701002', '北方贸易有限公司',  65000.00, 1, NULL,           '2026-07-01 11:00:00'),
('SO20260702001', '远景软件有限公司',  48000.00, 2, '正常订单',     '2026-07-02 09:30:00'),
('SO20260702002', '创新制造有限公司',  10000.00, 3, NULL,           '2026-07-02 14:00:00'),
('SO20260703001', '海港物流有限公司',   8000.00, 2, '首次合作',     '2026-07-03 09:00:00'),
('SO20260703002', '新城服务有限公司',   5000.00, 4, NULL,           '2026-07-03 15:00:00'),
('SO20260704001', '启航咨询有限公司',   3000.00, 1, NULL,           '2026-07-04 10:00:00'),
('SO20260704002', '未来数据有限公司',  99999.00, 2, '接近A级客户', '2026-07-04 16:00:00');
```

---

# 六、基础验证SQL

## 1. CASE WHEN转换员工状态

```sql
SELECT
    id,
    name,
    status,
    CASE
        WHEN status = 1 THEN '正常'
        WHEN status = 0 THEN '禁用'
        ELSE '未知状态'
    END AS status_name
FROM employee;
```

## 2. 使用IF转换状态

```sql
SELECT
    id,
    name,
    IF(status = 1, '正常', '禁用') AS status_name
FROM employee;
```

## 3. 查询手机号为空的员工

```sql
SELECT id, name, phone
FROM employee
WHERE phone IS NULL;
```

## 4. 使用COALESCE处理空手机号

```sql
SELECT
    id,
    name,
    COALESCE(phone, '暂无手机号') AS phone
FROM employee;
```

## 5. 比较COUNT(*)与COUNT(salary)

```sql
SELECT
    COUNT(*) AS employee_count,
    COUNT(salary) AS salary_count
FROM employee;
```

预期：

```text
employee_count = 8
salary_count   = 7
```

---

# 七、Day02练习题

## 练习1：员工状态转换

查询员工姓名、部门、原始状态和中文状态。

要求使用 `CASE WHEN`。

## 练习2：IF状态转换

查询员工姓名和中文状态。

要求使用 `IF`。

## 练习3：手机号默认值

手机号为 `NULL` 时显示“暂无手机号”。

要求使用 `COALESCE`。

## 练习4：查询未填写手机号的员工

要求使用 `IS NULL`。

## 练习5：订单状态转换

将订单状态转换为中文状态。

## 练习6：订单金额分级

规则：

| 金额范围 | 等级 |
|---|---|
| 大于等于100000 | A级 |
| 大于等于50000且小于100000 | B级 |
| 大于等于10000且小于50000 | C级 |
| 小于10000 | D级 |

## 练习7：订单备注处理

备注为空时显示“暂无备注”。

## 练习8：部门统计

统计每个部门：

- 员工总数
- 已填写工资人数
- 平均工资
- 最高工资
- 最低工资

## 练习9：正常与禁用员工统计

统计每个部门的正常员工数量和禁用员工数量。

提示：

```sql
SUM(
    CASE
        WHEN 条件 THEN 1
        ELSE 0
    END
)
```

## 练习10：订单状态数量统计

按订单状态统计数量，并显示中文状态。

---

# 八、参考答案

## 练习1

```sql
SELECT
    name,
    dept,
    status,
    CASE
        WHEN status = 1 THEN '正常'
        WHEN status = 0 THEN '禁用'
        ELSE '未知'
    END AS status_name
FROM employee;
```

## 练习2

```sql
SELECT
    name,
    IF(status = 1, '正常', '禁用') AS status_name
FROM employee;
```

## 练习3

```sql
SELECT
    name,
    dept,
    COALESCE(phone, '暂无手机号') AS phone
FROM employee;
```

## 练习4

```sql
SELECT name, dept, phone
FROM employee
WHERE phone IS NULL;
```

## 练习5

```sql
SELECT
    order_no,
    customer_name,
    amount,
    status,
    CASE
        WHEN status = 1 THEN '待支付'
        WHEN status = 2 THEN '已支付'
        WHEN status = 3 THEN '已关闭'
        WHEN status = 4 THEN '已退款'
        ELSE '未知状态'
    END AS status_name
FROM sale_order;
```

## 练习6

```sql
SELECT
    order_no,
    customer_name,
    amount,
    CASE
        WHEN amount >= 100000 THEN 'A级'
        WHEN amount >= 50000 THEN 'B级'
        WHEN amount >= 10000 THEN 'C级'
        ELSE 'D级'
    END AS order_level
FROM sale_order;
```

## 练习7

```sql
SELECT
    order_no,
    customer_name,
    COALESCE(remark, '暂无备注') AS remark
FROM sale_order;
```

## 练习8

```sql
SELECT
    dept,
    COUNT(*) AS employee_count,
    COUNT(salary) AS salary_count,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary,
    MIN(salary) AS min_salary
FROM employee
GROUP BY dept;
```

## 练习9

```sql
SELECT
    dept,
    COUNT(*) AS employee_count,
    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS enabled_count,
    SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS disabled_count
FROM employee
GROUP BY dept;
```

## 练习10

```sql
SELECT
    CASE
        WHEN status = 1 THEN '待支付'
        WHEN status = 2 THEN '已支付'
        WHEN status = 3 THEN '已关闭'
        WHEN status = 4 THEN '已退款'
        ELSE '未知状态'
    END AS status_name,
    COUNT(*) AS order_count
FROM sale_order
GROUP BY status
ORDER BY status;
```

---

# 九、Day02验收标准

完成后应能说明：

1. 为什么不能使用 `= NULL`
2. `COUNT(*)` 与 `COUNT(column)` 的区别
3. `COALESCE` 的作用
4. `CASE WHEN` 为什么要注意条件顺序
5. 如何使用条件聚合统计不同状态的数据

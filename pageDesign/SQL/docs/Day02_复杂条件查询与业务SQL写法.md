# SQL进阶 Day02：复杂条件查询与业务SQL写法

## 今日学习目标

掌握企业项目中高频使用的SQL能力：

1.  CASE WHEN 条件转换
2.  IF 条件判断
3.  NULL数据处理
4.  COALESCE默认值处理
5.  业务状态转换SQL

------------------------------------------------------------------------

# 一、CASE WHEN

## 语法

``` sql
CASE
    WHEN 条件1 THEN 返回值1
    WHEN 条件2 THEN 返回值2
    ELSE 默认值
END
```

## 示例：订单状态转换

``` sql
SELECT
    id,
    CASE
        WHEN status = 1 THEN '待支付'
        WHEN status = 2 THEN '已支付'
        WHEN status = 3 THEN '已关闭'
        ELSE '未知状态'
    END AS status_name
FROM orders;
```

应用场景：

-   订单状态
-   审批状态
-   用户状态
-   流程节点状态

------------------------------------------------------------------------

# 二、IF函数

MySQL语法：

``` sql
IF(condition,true_value,false_value)
```

示例：

``` sql
SELECT
    name,
    IF(status=1,'正常','停用') AS status_name
FROM employee;
```

建议：

业务SQL优先使用 CASE WHEN，因为它是标准SQL。

------------------------------------------------------------------------

# 三、NULL处理

NULL表示未知值，不等于空字符串。

错误：

``` sql
WHERE name = NULL
```

正确：

``` sql
WHERE name IS NULL
```

非NULL：

``` sql
WHERE name IS NOT NULL
```

------------------------------------------------------------------------

# 四、COALESCE函数

作用：

返回第一个非NULL值。

语法：

``` sql
COALESCE(value1,value2,value3)
```

示例：

``` sql
SELECT
name,
COALESCE(phone,'暂无电话')
FROM employee;
```

------------------------------------------------------------------------

# 五、COUNT与NULL

COUNT字段：

``` sql
COUNT(salary)
```

会忽略NULL。

统计行数：

``` sql
COUNT(*)
```

不会忽略NULL。

推荐：

统计数量使用：

``` sql
COUNT(*)
```

------------------------------------------------------------------------

# 六、业务案例练习

## 案例1：订单等级

规则：

-   =10000 大订单

-   =5000 普通订单

-   其他 小订单

SQL：

``` sql
SELECT
order_no,
CASE
WHEN amount >=10000 THEN '大订单'
WHEN amount >=5000 THEN '普通订单'
ELSE '小订单'
END AS order_level
FROM orders;
```

------------------------------------------------------------------------

## 案例2：手机号处理

要求：

手机号为空显示：

暂无手机号

使用：

``` sql
COALESCE(phone,'暂无手机号')
```

------------------------------------------------------------------------

# 七、今日练习题

## 练习1

查询员工姓名和中文状态：

status:

1 正常

0 禁用

## 练习2

订单金额分类：

> =100000 A级

> =50000 B级

其他 C级

## 练习3

查询员工手机号：

NULL显示：

暂无手机号

## 练习4

统计部门：

-   员工数量
-   平均工资
-   最高工资

------------------------------------------------------------------------

# 八、Java项目结合

MyBatis中常见：

``` sql
SELECT
id,
name,
CASE status
WHEN 1 THEN '启用'
WHEN 0 THEN '禁用'
END status_name
FROM user;
```

应用：

-   权限系统
-   销售系统
-   审批流程
-   订单系统

------------------------------------------------------------------------

# 今日验收

完成后应该能回答：

1.  为什么不能使用 name=NULL？
2.  COUNT(\*)和COUNT(column)有什么区别？
3.  CASE WHEN解决什么问题？
4.  COALESCE有什么作用？
5.  企业项目为什么经常需要状态转换？

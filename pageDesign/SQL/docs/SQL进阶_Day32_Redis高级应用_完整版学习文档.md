# SQL进阶 Day32：Redis高级应用（完整版学习文档）

# 一、学习目标

Day32深入学习Redis企业应用。

重点掌握：

- Redis数据结构
- String
- List
- Hash
- Set
- ZSet
- 分布式锁
- Redis过期策略
- 淘汰策略
- 热点Key
- Redis事务
- Lua脚本


完成后能够：

1. 根据业务选择Redis结构
2. 设计分布式锁
3. 处理缓存高并发问题
4. 开发企业级缓存方案


---

# 二、环境准备


启动Redis：


```bash
redis-server
```


测试：


```bash
redis-cli ping
```


结果：

```
PONG
```


---

# 三、Redis核心特点


Redis：

基于内存的数据存储。


特点：

- 高性能
- 支持丰富数据结构
- 支持持久化
- 支持分布式场景


---

# 四、Redis数据结构


# 1.String


最基础类型。


场景：

- 缓存对象
- 计数器


示例：


```bash
SET user:1:name zhangsan
```


查询：

```bash
GET user:1:name
```


---

# 2.Hash


适合对象。


例如：

用户信息。


```bash
HSET user:1 name zhangsan
```


结构：

```
user:1

name

age
```


---

# 3.List


特点：

有序列表。


场景：

- 消息队列
- 最新记录


示例：


```bash
LPUSH message hello
```


---

# 4.Set


无序集合。


场景：

标签。


```bash
SADD tag java
```


---

# 5.ZSet


有序集合。


场景：

排行榜。


例如：

商品销量排行。


```bash
ZADD sale_rank 100 product1
```


---

# 五、企业业务设计


## 商品排行榜


使用：

ZSet。


数据：


```
商品ID

销量分数

```


查询TOP：


```bash
ZREVRANGE sale_rank 0 10
```


---

# 六、Redis过期策略


Redis数据：

可以设置TTL。


```bash
SET token abc EX 3600
```


查看：

```bash
TTL token
```


---

# 七、内存淘汰策略


当内存不足：

Redis删除数据。


常见：

- noeviction
- allkeys-lru
- volatile-lru


企业常用：

LRU。


---

# 八、分布式锁


问题：

多个服务同时执行。


例如：

订单重复提交。


---

# 九、Redis实现分布式锁


加锁：


```bash
SET lock_key value NX EX 30
```


含义：

NX：

不存在才创建。


EX：

过期时间。


---

# 十、分布式锁注意事项


## 1.必须设置过期时间


防止死锁。


---

## 2.释放锁需要校验


避免删除别人锁。


---

## 3.锁粒度合理


不要锁整个业务。


---

# 十一、Redis事务


命令：


```bash
MULTI

SET a 1

SET b 2

EXEC
```


特点：

批量执行。


---

# 十二、Lua脚本


作用：

保证多个操作原子执行。


例如：

库存扣减。


流程：


```
判断库存

↓

扣减

```


一次完成。


---

# 十三、热点Key问题


问题：

大量请求访问一个Key。


例如：

热门商品。


解决：


- 本地缓存
- 分散Key
- 预热缓存


---

# 十四、企业案例


## 秒杀系统


流程：


```
用户请求

↓

Redis库存

↓

成功

↓

异步写MySQL
```


优势：

减少数据库压力。


---

# 十五、Java应用


RedisTemplate：


```java
redisTemplate.opsForValue()
.set(key,value);
```


获取：


```java
redisTemplate.opsForValue()
.get(key);
```


---

# 十六、练习题


## 基础


1. String适合什么场景？

2. Hash和String区别？


---

## 进阶


3. 设计排行榜。

4. 实现分布式锁。


---

## 高级


5. 设计秒杀库存。

6. 解决热点Key问题。


---

# 十七、面试问题


1. Redis为什么快？

2. Redis有哪些数据结构？

3. 如何实现分布式锁？

4. Redis如何淘汰数据？

5. Lua为什么适合Redis？


---

# 十八、最终实战任务


设计：

高并发商品系统。


要求：

包含：

- 商品缓存
- 排行榜
- 分布式锁
- 秒杀库存


输出：

Redis架构设计。


---

# 十九、总结


掌握：

✅ Redis数据结构

✅ 分布式锁

✅ 过期策略

✅ 淘汰策略

✅ Lua脚本

✅ 高并发应用


下一章节：

Day33：消息队列与数据库一致性

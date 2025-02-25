# <center>ES6模块</center>
## <center>概述</center>
    在ES6以前，实现模块化使用的是RequiredJs或者sealJS（分别是基于AMD和CMD规范的模块化库）。

    ES6引入了模块化，其设计思想是在编译时就能确定模块的依赖关系，以及输入和输出的变量。

    ES6模块化分为导入（important）和导出（export）两个模块。
## <center>特点</center>
    ES6 的模块自动开启严格模式，不管你有没有在模块头部加上 use strict;。

    模块中可以导入和导出各种类型的变量，如函数，对象，字符串，数字，布尔值，类等。  

    每个模块都有自己的上下文，每一个模块内声明的变量都是局部变量，不会污染全局作用域。

    每一个模块只加载一次（是单例的）， 若再去加载同目录下同文件，直接从内存中读取。
## <center>export与 import</center>
### 导出（export）
```javascript
// export.js
1、 导出变量
export let name = 'zhangsan';
export function sayName() {}
export class Person {}
export  {name, sayName, Person}
2、导出接口
// export default 默认导出，只能有一个,default后面跟的是接口变量（变量名称）,默认导出的可以是常量、函数、类、对象等。
export default sayName; 
export default function fav() {}
export default class Person {}
export default {name, sayName, Person}
```
### 导入（import）
```javascript
 // 通过export导出的变量 neme=zhangsan   syaName=function Person=class
    import {name, sayName, Person} from './export.js';

    // 导入的变量重命名 
    import {fav as favarite, syName as name} from './export.js';

     // 默认导出的接口（export default导出的内容）
    import defaultExport from './export.js'; 
    // 默认导出的接口重命名
    import * as obj from './export.js';  // default导出的接口重命名
   
```
### export default
```javascript
    1. 在一个文件或模块中，export、import 可以有多个，export default 仅有一个。
    2. export default 中的 default 是对应的导出接口变量。
    3. 通过 export 方式导出，在导入时要加{ }，export default 则不需要。
    4. export default 向外暴露的成员，可以使用任意变量来接收。
```



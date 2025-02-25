const myName = '赵传洋'
let myAge = 18;
export const myFav = function(){
    return `My name is ${myName} and I am ${myAge} years old.`
}
 class Person{  
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    say(){
        return `My name is ${this.name} and I am ${this.age} years old.`
    }
}
const dog = '旺财'
const cat = '大毛'

export {dog,cat,myAge, Person}
export default myName
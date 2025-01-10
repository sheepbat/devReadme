const myName = '赵传洋'
let myAge = 18;
export const myFav = function(){
    return `My name is ${myName} and I am ${myAge} years old.`
}
let myClass = class Person{  
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    say(){
        return `My name is ${this.name} and I am ${this.age} years old.`
    }
}

export {myName,myAge,myClass}
export default myName
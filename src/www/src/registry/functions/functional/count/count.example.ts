import count from "."

const add =(a:number, b:number)=>{
    return a+b;
    }

const countAddFn =  count(add);
countAddFn(1,2);
// Expected Output: Original function called 1 times
countAddFn(3,4);
// Expected Output: Original function called 2 times
console.log(countAddFn.getCount());
// Expected Output: 2
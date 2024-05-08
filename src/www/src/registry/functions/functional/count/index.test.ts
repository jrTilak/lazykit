import { expect, test, describe } from 'vitest'
import count from "."

describe('count', () => {
    //Test case 1: Testing the wrapper function 
    test('calls the function passed and returns the result', ()=>{
        const mockFunction = (a: number, b: number): number => {
            return a + b;
        };
        const countedFunction = count(mockFunction);
        expect(countedFunction(1,2)).toBe(3);
    })

    
    // Test case 2: Testing the getCount function
    test('resturns the count of function calls', ()=>{
        const mockFunction = (a: number, b: number): number => {
            return Math.abs(a - b);
        };
        const countedFunction = count(mockFunction);
        countedFunction(4,6);
        countedFunction(10,6);
        countedFunction(4,5);
        countedFunction(4,13);
        countedFunction(155,6);
        countedFunction(109,126);

        //test the getCount method
        expect(countedFunction.getCount()).toBe(6)
    })
    

})

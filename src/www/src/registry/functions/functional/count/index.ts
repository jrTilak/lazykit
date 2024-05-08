/***
 *  Invokes the function passed with args and counts how many times the function is excueted.
 * 
 *  @param {fn:Function} - The function to be called.
 *  @returns - A new function that excutes the given function and returns the result.
 *  @returns {getCount:Function} - A method that returns the count of exceution of the passed function. 
 ***/





const count = <T>(fn: (...args: any[]) => T) => {
  let callCount = 0;

  const wrapper= (...args: any[]): T  => {
    callCount++;
    console.log(`Original function called ${callCount} times`);
    const result = fn(...args);
    return result;
  };
  
  const getCount : ()=> number =()=>callCount;

  wrapper.getCount = getCount;

  return wrapper;
};

export default count;
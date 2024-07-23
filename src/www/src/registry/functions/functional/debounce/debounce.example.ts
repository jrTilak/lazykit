import debounce from ".";

const handleButtonClick = () => {
  console.log("Button Clicked");
};

const debouncedHandleButtonClick = debounce(handleButtonClick);

debouncedHandleButtonClick();

// this will prevent a user clicking a button repeatedly giving some delay between each funtion call
debouncedHandleButtonClick();
debouncedHandleButtonClick();

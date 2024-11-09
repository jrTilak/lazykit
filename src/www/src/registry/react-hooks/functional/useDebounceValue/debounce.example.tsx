import React, { useState } from "react";
import useDebouncedValue from ".";

const DebounceExample = () => {
  const [inputValue, setInputValue] = useState<string>("");

  // Using the custom debounce hook
  const debouncedValue = useDebouncedValue(inputValue, 500);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  return (
    <div className="w-full max-w-md m-auto my-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Debounce Value Example</h2>

      <div className="mb-4">
        <label htmlFor="input" className="block text-foreground mb-2">
          Type something:
        </label>
        <input
          type="text"
          id="input"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-2 border border-muted-foreground rounded-md"
        />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-foreground">
            <strong>Original Value:</strong> {inputValue}
          </p>
        </div>

        <div>
          <p className="text-foreground">
            <strong>Debounced Value:</strong> {debouncedValue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebounceExample;

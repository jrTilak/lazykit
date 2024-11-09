import React, { useState } from "react";
import useDebounce from ".";

const DebounceExample = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [originalChanges, setOriginalChanges] = useState<number>(0);
  const [debouncedChanges, setDebouncedChanges] = useState<number>(0);

  // Using the custom debounce hook
  const debouncedUpdate = useDebounce((value: string) => {
    setDebouncedValue(value);
    setDebouncedChanges((prev) => prev + 1);
  }, 500);

  const [debouncedValue, setDebouncedValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setOriginalChanges((prev) => prev + 1);
    debouncedUpdate(newValue); // Debounce the value
  };

  return (
    <div className="w-full max-w-md m-auto my-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Debounce Example</h2>

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
          <p className="text-muted-foreground">
            Changes: {originalChanges} times
          </p>
        </div>

        <div>
          <p className="text-foreground">
            <strong>Debounced Value:</strong> {debouncedValue}
          </p>
          <p className="text-muted-foreground">
            Changes: {debouncedChanges} times
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebounceExample;

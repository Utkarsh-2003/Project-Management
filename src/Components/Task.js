import React, { useState } from "react";
import Select from "react-select";

const Task = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  const handleAddOption = () => {
    if (inputValue.trim() !== "") {
      const newOption = { value: inputValue, label: inputValue };
      setSelectedOptions([...selectedOptions, newOption]);
      setInputValue("");
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ced4da",
      borderRadius: "4px",
      minHeight: "38px",
    }),
  };

  return (
    <div>
      <Select
        isClearable
        isSearchable
        placeholder="Select or type..."
        options={selectedOptions}
        isMulti
        styles={customStyles}
        onChange={setSelectedOptions}
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Type here..."
      />
      <button onClick={handleAddOption}>Add</button>
    </div>
  );
};

export default Task;

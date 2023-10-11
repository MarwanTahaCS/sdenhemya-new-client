import React from 'react';

function SelectInput({index, inputField, handleSelectChange, handleMouseEnter, handleMouseLeave, hoveredIndex, windowWidth, pageHeight, pageWidth }) {
    return (
      <>
      <select
        style={{
          opacity: `${hoveredIndex === index || inputField.editor.state ? 0.8 : 1}`,
          position: 'absolute', top: inputField.y * (windowWidth) * ((pageHeight) / pageWidth), left: inputField.x * (windowWidth),
          width: `${(windowWidth * inputField.editor.width / 1.5)}px`,
          height: `${windowWidth * inputField.editor.height / 40}px`,
          fontSize: `${windowWidth / 60}px`,
          border: `${inputField.valid? '1px solid #ccc':'2px solid red'}`
        }}
        value={inputField.value}
        onChange={(event) => handleSelectChange(event, index)}
        displayEmpty
        onMouseEnter={(event) => handleMouseEnter(event, index)}
        onMouseLeave={handleMouseLeave}
      >
        <option value="" style={{ fontSize: `${windowWidth / 60}px` }} disabled>
          -- בחר אופציה --
        </option>
        {inputField.options.map((input, inputIndex) => (
          <option style={{ fontSize: `${windowWidth / 60}px` }} key={inputIndex} value={input}>
            {input || 'בחר אופציה'} {/* Display 'Empty Input' if the input is an empty string */}
          </option>
        ))}
      </select>
    </>
    );
}

export default SelectInput;

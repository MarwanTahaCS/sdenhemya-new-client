import React from 'react';

function DateInput({ index, inputField, handleInputChange, handleMouseEnter, handleMouseLeave, hoveredIndex, windowWidth, pageHeight, pageWidth }) {
  return (
    <>
      <input
        key={index}
        type="date"
        value={inputField.value}
        onChange={(event) => handleInputChange(event, index)}
        style={{
          opacity: `${hoveredIndex === index || inputField.editor.state ? 0.8 : 1}`,
          position: 'absolute', top: inputField.y * (windowWidth) * ((pageHeight) / pageWidth), left: inputField.x * (windowWidth),
          width: `${(windowWidth * inputField.editor.width / 1.5)}px`,
          height: `${windowWidth * inputField.editor.height / 40}px`,
          fontSize: `${windowWidth / 60}px`,
          padding: '4px',
          border: `${inputField.valid? '':'2px solid red'}`
        }}
        onMouseEnter={(event) => handleMouseEnter(event, index)}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
}

export default DateInput;

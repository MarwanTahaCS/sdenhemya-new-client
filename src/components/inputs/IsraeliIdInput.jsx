import React, { useState } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';

function IsraeliIdInput({ index, inputField, handleInputChange, handleMouseEnter, handleMouseLeave, hoveredIndex, windowWidth, pageHeight, pageWidth }) {
  const [error, setError] = useState('');

  function isValidIsraeliID(id) {
    // Remove any non-digit characters
    id = id.replace(/\D/g, '');

    // Check if the ID number is 9 digits long
    if (id.length !== 9) {
      return false;
    }

    // Calculate the checksum
    const idArray = id.split('').map(Number);
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      let digit = idArray[i] * weights[i];
      if (digit > 9) {
        digit = digit - 9;
      }
      sum += digit;
    }

    return sum % 10 === 0;
  }

  const validateInput = (value) => {
    // Implement your validation logic here
    // Return an error message if validation fails, or an empty string if it's valid
    if (!isValidIsraeliID(value)) {
      return 'זה לא מספר תעודת זהות ישראלית חוקי';
    }
    return '';
  };

  function handleLocalInputChange(event, index) {
    const value = event.target.value;
    const validationError = validateInput(value);
    setError(validationError); // Set the error message

    // Call the parent's input change handler if there are no errors
    handleInputChange(event, index);
  }

  return (
    <>
      <input
        key={index}
        type="text"
        value={inputField.value}
        onChange={(event) => handleLocalInputChange(event, index)}
        style={{
          opacity: `${hoveredIndex === index || inputField.editor.state ? 0.8 : 1}`,
          position: 'absolute', top: inputField.y * (windowWidth) * ((pageHeight) / pageWidth), left: inputField.x * (windowWidth),
          width: `${(windowWidth * inputField.editor.width / 1.5)}px`,
          height: `${windowWidth * inputField.editor.height / 40}px`,
          fontSize: `${windowWidth / 60}px`,
          padding: '4px',
        }}
        onMouseEnter={(event) => handleMouseEnter(event, index)}
        onMouseLeave={handleMouseLeave}
      />
      {/* {error && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{error}</div>
      )} */}
      {error && (
        <div style={{
          color: 'red',
          display: 'flex', alignItems: 'center',
          position: 'absolute', top: inputField.y * (windowWidth) * ((pageHeight) / pageWidth), left: inputField.x * (windowWidth) ,
        }}>
          <Tooltip title={error}>
            <ErrorOutlineIcon style={{ height: `${windowWidth / 40}px`, width: `${windowWidth / 40}px` }} />
          </Tooltip>
        </div>)}
    </>
  );
}

export default IsraeliIdInput;

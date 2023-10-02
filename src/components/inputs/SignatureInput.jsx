import React from 'react';

import SignatureModal from "../SignatureModal.jsx";


function SignatureInput({ index, inputField, setHoveredIndex, setSignatureOpen, updateSignature, handleMouseEnter, handleMouseLeave, hoveredIndex, windowWidth, pageHeight, pageWidth }) {
  return (
    <div key={index}
      style={{
        opacity: `${hoveredIndex === index || inputField.editor.state ? 0.8 : 1}`,
        position: 'absolute', top: inputField.y * (windowWidth) * ((pageHeight) / pageWidth), left: inputField.x * (windowWidth),
        fontSize: `${windowWidth / 40}px`,
        width: `${(windowWidth * inputField.editor.width / 1.5)}px`,
        padding: '4px',
      }}
      onMouseEnter={(event) => handleMouseEnter(event, index)}
      onMouseLeave={handleMouseLeave}
    >

      <SignatureModal key={index} windowWidth={windowWidth} setHoveredIndex={setHoveredIndex} setSignatureOpen={setSignatureOpen} updateSignature={updateSignature} url={inputField.value} index={index} signer={"חתימה ראשונה"} />

    </div>
  );
}

export default SignatureInput;

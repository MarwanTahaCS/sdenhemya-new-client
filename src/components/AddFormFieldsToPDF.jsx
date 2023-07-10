import React, { useState, useEffect } from "react";
import { PDFDocument, rgb  } from 'pdf-lib';

import pdfDocument from '../parents_agreement.pdf';

export default async function AddFormFieldsToPDF(props) {
    const [documentBytes, setDocumentBytes] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(pdfDocument);
        const blob = await response.blob();

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const arrayBuffer = fileReader.result;
          const bytes = new Uint8Array(arrayBuffer);
          setDocumentBytes(bytes);
        };
        fileReader.readAsArrayBuffer(blob);
      } catch (error) {
        console.error('Error loading document:', error);
      }
    };

    fetchDocument();
  }, []);

  if (documentBytes === null) {
    return <div>Loading document...</div>;
  }

  //-------------------------------------------------------------------------------
  
  let selectedPosition = null;

  const handlePageClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    selectedPosition = { x: offsetX, y: offsetY };
  };



  const existingPdfBytes = documentBytes; // Load the existing PDF as bytes (from file or API)
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const page = pdfDoc.getPages()[0];
  page.on('click', handlePageClick); // Attach the click event listener

  const addFieldToPDF = async () => {
    const textField = pdfDoc.createTextField('myField');
    textField.setText('Default Value');
    textField.addToPage(page, {
      x: selectedPosition.x,
      y: selectedPosition.y,
      width: 200,
      height: 20,
      textColor: rgb(0, 0, 0),
      backgroundColor: rgb(1, 1, 1),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

     // Save and download the modified PDF
     const modifiedPdfBytes = await pdfDoc.save();

     // Download the modified PDF
     const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.download = 'modified.pdf';
     link.click();
  };

  // Use the documentBytes as needed, e.g., display the PDF
  return (
    <div>
        <h1> add form field </h1>
      Document loaded! Total bytes: {documentBytes.length}


      <button onClick={addFieldToPDF}>Add Field</button>
    </div>
  );
  
}
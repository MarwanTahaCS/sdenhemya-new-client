import React, { useState } from 'react';
import { Box, Button, Input, Typography } from '@mui/material';

function RequestedFilesList(props) {

  const handleFileChange = (index, event) => {
    const { files } = event.target;

    const file = files[0];

    if (file) {
      const fileType = file.type;
      const validFileTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // for .xlsx
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // for .docx
        'application/msword', // for .doc
        'image/jpeg',
        'image/png',
        'image/heic',
        'image/heif',
        // ... any other image formats you want to support
      ];

      if (validFileTypes.includes(fileType)) {
        props.setFiles((prevFiles) => ({
          ...prevFiles,
          [index]: files[0],
        }));
      } else {
        alert('סוג הקובץ אינו נתמך, אנא העלה קובץ מסוג תמונה,PDF, Word או Excel.');
        event.target.value = ''; // Clear the input field
      }

      const maxFileSize = 5 * 1024 * 1024;

      // Check the file size against the maximum limit
      if (file.size > maxFileSize) {
        alert('גודל הקובץ חורג מהמגבלה של 5MB. נא להעלות קובץ קטן יותר.');
        event.target.value = ''; // Clear the input field
        return;
      }
    }

  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>מסמכים דרושים</Typography>
      {props.requestedFiles.map((description, index) => (
        <Box key={index} mb={2}>
          <Typography variant="h6">{description}</Typography>
          <Input
            type="file"
            accept=".pdf, .xlsx, image/*, .heic, .heif"
            onChange={(event) => handleFileChange(index, event)}
          />
        </Box>
      ))}
    </Box>
  );
}

export default RequestedFilesList;

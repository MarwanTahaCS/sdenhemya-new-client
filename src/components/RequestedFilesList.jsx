import React, { useState } from 'react';
import { Box, Button, Input, Typography, Divider, Paper, } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

import '../index.css';

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

    <div className="david" >
      {props.requestedFiles.length > 0 &&<Box >
        <Typography variant="h4" mb={2}>מסמכים דרושים</Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px', margin: '8px' }}>
          {props.requestedFiles.map((description, index) => (
            <React.Fragment key={index}>
              <Typography variant="h6" align="right" style={{ marginTop: '8px' }}>{description.description} {description.mandatory && <span className="david text-danger">(חובה*)</span>}</Typography>
              <Box key={index} mb={2} display="flex" alignItems="center" justifyContent="space-between">

                <Input
                  type="file"
                  accept=".pdf, .xlsx, image/*, .heic, .heif"
                  onChange={(event) => handleFileChange(index, event)}
                  fullWidth
                />
              </Box>
              {index !== props.requestedFiles.length - 1 && <Divider style={{ margin: '8px 0' }} />}
            </React.Fragment>
          ))}
        </Paper>
      </Box>}

      {!props.requestedFiles.length > 0 && <Box >
        <Typography variant="h5" mb={2}><div className="david mt-5" > לא נדרש צירוף מסמכים עם הגשה זו. <DoneIcon/> </div>  </Typography>
      </Box> }
    </div>
  );
}

export default RequestedFilesList;

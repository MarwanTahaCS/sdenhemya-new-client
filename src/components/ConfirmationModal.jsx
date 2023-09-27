import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const paperStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Adjust the alpha value to control darkness
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px', // Adjust the margin value to control the spacing
  };

const ConfirmationModal = ({ show, onHide, onConfirm, templateID }) => {
  return (
    <Modal open={show}  onClose={onHide} style={modalStyle}>
      <Box sx={paperStyle}>
        <h2>אשר מחיקה</h2>
        <p>האם אתה בטוח שאתה רוצה למחוק מסמך זה?</p>
        <Box sx={buttonContainerStyle}>
        <Button className="mx-1" variant="contained" color="error" onClick={()=>onConfirm(templateID)}>
          מחק
        </Button>
        <Button className="mx-1" variant="outlined"  onClick={onHide}>
          ביטול
        </Button>
        </Box>
        </Box>
    </Modal>
  );
};

export default ConfirmationModal;

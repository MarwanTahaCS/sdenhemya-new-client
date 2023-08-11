import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function SimpleSnackbar(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);


        navigator.clipboard.writeText(props.templateLink);
  
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Update windowWidth whenever the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const calculateFontSize = () => {
    // Calculate the font size based on the window width
    // You can customize the formula according to your preference
    // Here, we set the font size to be 1% of the window width
    return Math.max(windowWidth * 0.015, 10); // Minimum font size of 12px
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', direction: 'ltr' }} >
      <Button onClick={handleClick} style={{ fontSize: calculateFontSize(), flex: '1 1 100px', textTransform: 'none' }}>{props.name}</Button>
      <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Copied to Clipboard"
        action={action}
      />
    </div>
  );
}
import React, { useState } from 'react';
import {
  Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Done as DoneIcon, Cancel as CancelIcon } from '@mui/icons-material';

function FileRequestForm(props) {
  // const [requestedFiles, setRequestedFiles] = useState([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [showInput, setShowInput] = useState(false); // Control whether to show the input field

  const handleAddFileRequest = () => {
    if (currentDescription.trim() !== '') {
      props.setRequestedFiles([
        ...props.requestedFiles,
        currentDescription,
      ]);
      setCurrentDescription('');
      setShowInput(false); // Hide the input field after adding a file
    }
  };

  const handleEditFileRequest = (index) => {
    setEditingIndex(index);
    setCurrentDescription(props.requestedFiles[index]);
    setShowInput(true); // Show the input field when editing
  };

  const handleSaveEdit = () => {
    if (currentDescription.trim() !== '') {
      const updatedFiles = [...props.requestedFiles];
      updatedFiles[editingIndex] = currentDescription;
      props.setRequestedFiles(updatedFiles);
      setCurrentDescription('');
      setEditingIndex(null);
      setShowInput(false); // Hide the input field after saving edit
    }
  };

  const handleCancelEdit = () => {
    setCurrentDescription('');
    setEditingIndex(null);
    setShowInput(false); // Hide the input field after canceling edit
  };

  const handleDeleteFileRequest = (index) => {
    const updatedFiles = [...props.requestedFiles];
    updatedFiles.splice(index, 1);
    props.setRequestedFiles(updatedFiles);
  };

  return (
    <div>
      <h2>מסמכים דרושים</h2>
      {!showInput && (
        <div dir="ltr">
          <Button variant="contained" endIcon={<AddIcon />} onClick={() => setShowInput(true)}>
            הוספת מסמכך דרוש
          </Button>
        </div>
      )}
      {showInput && (
        <div>
          <TextField
            label="תיאור המסמך (max 100 characters)"
            variant="outlined"
            fullWidth
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
          />
          {editingIndex !== null ? (
            <div dir="ltr">
              <Button variant="contained" endIcon={<DoneIcon />} onClick={handleSaveEdit}>
                סיום
              </Button>
              <Button variant="contained" endIcon={<CancelIcon />} onClick={handleCancelEdit}>
                ביטול
              </Button>
            </div>
          ) : (
            <div dir="ltr">
              <Button variant="contained" endIcon={<AddIcon />} onClick={handleAddFileRequest}>
                הוספה
              </Button>
              <Button variant="contained" endIcon={<CancelIcon />} onClick={() => setShowInput(false)}>
                ביטול
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div>
        <List>
          <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            {props.requestedFiles.map((file, index) => (
              <React.Fragment key={index}>
                <ListItem key={index}>
                  <ListItemText primary={file} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditFileRequest(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteFileRequest(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index !== props.requestedFiles.length - 1 && <Divider style={{ margin: '8px 0' }} />}
              </React.Fragment>
            ))}
          </Paper>
        </List>
      </div>
    </div>
  );
}

export default FileRequestForm;

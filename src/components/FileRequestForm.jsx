import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
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
      <h2>Request Files</h2>
      {!showInput && (
        <div>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowInput(true)}>
            Request File
          </Button>
        </div>
      )}
      {showInput && (
        <div>
          <TextField
            label="File Description (max 100 characters)"
            variant="outlined"
            fullWidth
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
          />
          {editingIndex !== null ? (
            <div>
              <Button variant="contained" startIcon={<DoneIcon />} onClick={handleSaveEdit}>
                Done
              </Button>
              <Button variant="contained" startIcon={<CancelIcon />} onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddFileRequest}>
                Add
              </Button>
              <Button variant="contained" startIcon={<CancelIcon />} onClick={() => setShowInput(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
      <div>
        <List>
          {props.requestedFiles.map((file, index) => (
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
          ))}
        </List>
      </div>
    </div>
  );
}

export default FileRequestForm;

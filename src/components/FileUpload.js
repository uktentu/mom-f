import React, { useState } from 'react';
import { uploadTranscript } from '../services/api';
import { Typography, TextField, Button, Box, Container, LinearProgress } from '@mui/material';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [uploadStatus, setUploadStatus] = useState(''); // Track status of upload (pending, success, or failed)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the upload starts
    setUploadStatus('pending'); // Mark as pending during the upload
    setUploadProgress(0); // Reset the progress bar

    try {
      // Use the callback to handle progress updates
      await uploadTranscript(file, title, duration, (progress) => {
        setUploadProgress(progress);
      });

      setUploadStatus('success'); // Update status to success on successful upload
      alert('File uploaded successfully!');
    } catch (error) {
      setUploadStatus('failed'); // Update status to failed if there's an error
      alert('Upload failed: ' + error.message);
    } finally {
      setLoading(false); // Set loading to false when the upload completes
    }
  };

  return (
    <>
      {/* Form */}
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: '#f9f9f9',
            padding: 3,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" textAlign="center">
            Upload Meeting Transcript
          </Typography>
          <TextField
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            inputProps={{ accept: '.txt,.doc,.docx,.pdf' }}
            required
          />
          <TextField
            label="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Upload Transcript
          </Button>

          {/* Loading bar */}
          {loading && (
            <Box sx={{ marginTop: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              {uploadStatus === 'pending' && <Typography>Uploading...</Typography>}
              {uploadStatus === 'success' && <Typography>Upload Successful!</Typography>}
              {uploadStatus === 'failed' && <Typography>Upload Failed</Typography>}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default FileUpload;

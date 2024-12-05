import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MeetingList from './components/MeetingList'; // Adjust the path as needed
import FileUpload from './components/FileUpload'; // Adjust the path as needed
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material';

const App = () => {
  return (
    <Router>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Meeting Manager
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/allmeetings">
            All meeting
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/allmeetings" element={<MeetingList />} />
          <Route path="/" element={<FileUpload />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

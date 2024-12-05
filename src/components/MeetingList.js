import React, { useEffect, useState } from 'react';
import { getAllMeetings } from '../services/api';
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const API_BASE_URL = "http://localhost:8080/api/meetings";

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await getAllMeetings();
        setMeetings(response.data);
        setFilteredMeetings(response.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };
    fetchMeetings();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = meetings;

    // Filter by title
    if (searchTitle) {
      filtered = filtered.filter((meeting) =>
        meeting.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(
        (meeting) =>
          new Date(meeting.meetingDate).toDateString() ===
          new Date(filterDate).toDateString()
      );
    }

    setFilteredMeetings(filtered);
  }, [searchTitle, filterDate, meetings]);

  const handleDownloadReport = async (id) => {
    try {
      const response = await fetch(API_BASE_URL+`/download/report/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download the report');
      }

      // Create a blob from the response
      const blob = await response.blob();
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `report_${id}.docx`); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <Container>
      {/* Title */}
      <Typography variant="h4" textAlign="center" sx={{ marginBottom: 4 }}>
        Meeting Summaries
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 4, flexWrap: 'wrap' }}>
        <TextField
          label="Search by Title"
          variant="outlined"
          fullWidth
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Filter by Date"
            value={filterDate}
            onChange={(date) => setFilterDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          variant="outlined"
          onClick={() => {
            setSearchTitle('');
            setFilterDate(null);
            setFilteredMeetings(meetings);
          }}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Meeting List Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Duration (Minutes)</TableCell>
              <TableCell>Generated Report</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMeetings.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableCell>{meeting.title}</TableCell>
                <TableCell>{new Date(meeting.meetingDate).toLocaleString()}</TableCell>
                <TableCell>{meeting.durationMinutes}</TableCell>
                <TableCell>
                  {meeting.generatedReportPath ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDownloadReport(meeting.id)}
                    >
                      Download Report
                    </Button>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MeetingList;

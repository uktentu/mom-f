import React from 'react';
import { downloadReport } from '../services/api';

const DownloadButton = ({ meetingId }) => {
  const handleDownload = async () => {
    try {
      const response = await downloadReport(meetingId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Meeting_Report_${meetingId}.docx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Error downloading report: ' + error.message);
    }
  };

  return <button onClick={handleDownload}>Download Report</button>;
};

export default DownloadButton;

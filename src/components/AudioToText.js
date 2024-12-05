import React, { useState } from "react";
import axios from "axios";
import "./AudioToText.css";

const API_BASE_URL = "http://localhost:5001"

const AudioToText = () => {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioURL(URL.createObjectURL(selectedFile));
      setTranscript("");
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an audio file first.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await axios.post(API_BASE_URL+"/api/convert-audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTranscript(response.data.transcript || "No text detected.");
    } catch (err) {
      setError("Failed to convert audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Audio to Text Converter</h1>
      <div className="upload-section">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Converting..." : "Convert to Text"}
        </button>
      </div>
      {audioURL && (
        <div className="audio-player">
          <h3>Play Audio:</h3>
          <audio controls>
            <source src={audioURL} type={file.type} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {transcript && (
        <div className="transcript">
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default AudioToText;

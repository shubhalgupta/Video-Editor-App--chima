// src/VideoEditor.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './VideoEditor.css';

const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [editedVideoUrl, setEditedVideoUrl] = useState('');

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  const uploadVideoToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/video/upload`, formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      // Handle error gracefully (show error message, reset state, etc.)
      return null;
    }
  };

  const handleEditVideo = async (transformation) => {
    if (!videoFile) return;

    const uploadedVideo = await uploadVideoToCloudinary(videoFile);

    if (uploadedVideo) {
      const publicId = uploadedVideo.public_id;
      let transformationUrl = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/video/upload/${transformation}/${publicId}.mp4`;
      setEditedVideoUrl(transformationUrl);
    }
  };

  const handleTrimVideo = () => {
    handleEditVideo('du_10'); // Trim the first 10 seconds
  };

  const handleSlowMotion = () => {
    handleEditVideo('e_accelerate:-50'); // Slow motion effect
  };

  const handleBackgroundRemoval = () => {
    handleEditVideo('e_background_removal'); // Background removal
  };

  return (
    <div className="editor-container">
      <h1>Video Editor App</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {videoUrl && <video src={videoUrl} controls />}
      <div className="buttons">
        <button onClick={handleTrimVideo}>Trim Video</button>
        <button onClick={handleSlowMotion}>Slow Motion</button>
        <button onClick={handleBackgroundRemoval}>Remove Background</button>
      </div>
      {editedVideoUrl && <video src={editedVideoUrl} controls />}
    </div>
  );
};

export default VideoEditor;

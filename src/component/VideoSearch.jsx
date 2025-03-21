import React, { useState } from "react";
import axios from "axios";
import "./VideoSearch.css";

const VideoSearch = () => {
    const [query, setQuery] = useState("");
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null); // Store selected video

    const searchVideos = async () => {
        if (!query.trim()) return;
        const response = await axios.get(`http://localhost:5000/search?q=${query}`);
        setVideos(response.data);
    };

    return (
        <div className="video-search-container">
            <h1>Search YouTube Videos</h1>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search videos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={searchVideos}>Search</button>
            </div>

            {/* Show Video Player if a video is selected */}
            {selectedVideo && (
                <div className="video-player">
                    <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${selectedVideo}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            <div className="video-list">
                {videos.map(video => (
                    <div
                        className="video-card"
                        key={video.id.videoId}
                        onClick={() => setSelectedVideo(video.id.videoId)} // Click to play video
                    >
                        <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                        <h3>{video.snippet.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoSearch;

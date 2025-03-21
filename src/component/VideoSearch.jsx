import React, { useState } from "react";
import axios from "axios";
import "./VideoSearch.css";

const API_KEY = "AIzaSyAdv4VPYe2S3hpzqw6ew0aQ0JV4loGHMgM"; // Replace with your YouTube API key

const VideoSearch = () => {
    const [query, setQuery] = useState("");
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const searchVideos = async () => {
        if (!query.trim()) return;
        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}`
            );
            setVideos(response.data.items);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
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

            {selectedVideo && (
                <div className="video-player">
                    <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${selectedVideo}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            <div className="video-list">
                {videos.map(video => (
                    <div
                        className="video-card"
                        key={video.id.videoId}
                        onClick={() => setSelectedVideo(video.id.videoId)}
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

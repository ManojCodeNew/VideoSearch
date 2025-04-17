import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VideoSearch.css";

const API_KEY = "AIzaSyBAxPNhLPznVcC5rT5OgYutKQdXXMWGw7A"; // Replace with your YouTube API key

const VideoSearch = () => {
    const [query, setQuery] = useState("");
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [prevSearchedData, setPrevSearchedData] = useState([]);
    const [searchActive, setSearchActive] = useState(false);
    const defaultVideos = async () => {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=news in kannada&key=${API_KEY}`
        );
        setVideos(response.data.items);

    }


    useEffect(() => {
        const savedQueries = JSON.parse(localStorage.getItem("query")) || [];
        setPrevSearchedData(savedQueries.reverse());

    }, [])

    const searchVideos = async (e) => {

        if (!query.trim()) return;
        setSearchActive(true);
        let updatedData = [...prevSearchedData];
        if (!updatedData.includes(query)) {
            updatedData.push(query);
            // Keep only the last 10 items
            if (updatedData.length > 10) {
                updatedData = updatedData.slice(updatedData.length - 10);
            }
            localStorage.setItem("query", JSON.stringify(updatedData));
            setPrevSearchedData(updatedData);
        }
        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}`
            );
            setVideos(response.data.items);
            console.log("YT Videos", response);


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
                    onChange={(e) => {
                        let value = e.target.value;
                        setQuery(value);
                        setSearchActive(value.length > 0);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchVideos(); // Trigger search on Enter key
                        }
                    }}
                />
                <button onClick={searchVideos} >Search</button>
            </div>
            {prevSearchedData && !searchActive && (
                <div className="searchData">
                    {prevSearchedData.map((item, index) => (
                        <p className="items" key={index} onClick={() => setQuery(item)}>{item}</p>
                    ))}
                </div>
            )}

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
                        <p className="date-time">{(new Date(video.snippet.publishTime).toLocaleString("en-US"))}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoSearch;

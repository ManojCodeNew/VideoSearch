import React, { useEffect, useState } from "react";
import './VideoSearch.css'
import { Search, History, X, Play, Clock, Eye } from "lucide-react";

const API_KEY = "AIzaSyBAxPNhLPznVcC5rT5OgYutKQdXXMWGw7A";

const Loader = () => (
    <div className="loader-container">
        <div className="spinner"></div>
    </div>
);

const VideoSearch = () => {
    const [query, setQuery] = useState("");
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [prevSearchedData, setPrevSearchedData] = useState([]);
    const [searchActive, setSearchActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch videos from YouTube API
    const fetchVideos = async (searchQuery, pageToken = "") => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?` +
                new URLSearchParams({
                    part: "snippet",
                    type: "video",
                    q: searchQuery,
                    maxResults: "12",
                    pageToken: pageToken,
                    key: API_KEY,
                })
            );

            const data = await response.json();

            // If pageToken exists -> append, else replace
            if (pageToken) {
                setVideos((prev) => [...prev, ...data.items]);
            } else {
                setVideos(data.items);
            }

            setNextPageToken(data.nextPageToken || null);
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load history from memory (since localStorage is not available)
    useEffect(() => {
        let history = JSON.parse(localStorage.getItem("query")) || [];

        // Initialize empty history
        setPrevSearchedData(history);
    }, []);

    // Handle search
    const searchVideos = () => {
        if (!query.trim()) return;
        setSearchActive(true);
        // Get existing history from localStorage
        let history = JSON.parse(localStorage.getItem("query")) || [];

        // Avoid duplicates (optional: remove if you want repeats)
        if (!history.includes(query)) {
            history.push(query);
        }

        // Save back to localStorage
        localStorage.setItem("query", JSON.stringify(history));

        setPrevSearchedData(history);


        fetchVideos(query);
    };

    // Infinite scroll - load more when near bottom
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.scrollHeight - 300
            ) {
                if (nextPageToken && !loading) {
                    fetchVideos(query, nextPageToken);
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [query, nextPageToken, loading]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const clearHistory = () => {
        localStorage.removeItem("query");
        setPrevSearchedData([]);
    };

    return (
        <>


            <div className="app-container">
                {/* Animated Background */}
                <div className="animated-bg">
                    <div className="floating-element-1"></div>
                    <div className="floating-element-2"></div>
                </div>

                {/* History Sidebar */}
                <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h3 className="sidebar-title">
                            <History size={20} />
                            Search History
                        </h3>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="close-btn"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="sidebar-content">
                        {prevSearchedData.length > 0 ? (
                            <div>
                                {[...prevSearchedData].reverse().map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setQuery(item);
                                            fetchVideos(item);
                                            setSidebarOpen(false);
                                        }}
                                        className="history-item"
                                    >
                                        <Clock size={16} />
                                        <span>{item}</span>
                                    </div>
                                ))}
                                <button
                                    onClick={clearHistory}
                                    className="clear-history-btn"
                                >
                                    Clear History
                                </button>
                            </div>
                        ) : (
                            <div className="empty-history">
                                <History size={48} style={{ color: 'rgba(255, 255, 255, 0.6)', margin: '0 auto 1rem auto' }} />
                                <h3>No search history yet</h3>
                                <p>Your searches will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Backdrop */}
                {sidebarOpen && (
                    <div
                        className="backdrop"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <div className="main-content">
                    {/* Header */}
                    <header className="header">
                        <nav className="header-nav">
                            <div></div>
                            <h1 className="main-title">Video Search - Find Videos Instantly</h1>
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="history-toggle-btn"
                                aria-label="Open search history"
                            >
                                <History size={24} />
                            </button>
                        </nav>
                        <p className="subtitle">Powerful video search engine to discover amazing content across the web</p>
                    </header>

                    {/* Search Box */}
                    <section className="search-container" role="search">
                        <div className="search-input-container">
                            <Search className="search-icon" size={20} aria-hidden="true" />
                            <input
                                type="text"
                                placeholder="Search for videos, tutorials, music, and more..."
                                value={query}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    setQuery(value);
                                    setSearchActive(value.length > 0);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        searchVideos();
                                    }
                                }}
                                className="search-input"
                                aria-label="Search videos"
                                autoComplete="off"
                            />
                            <button
                                onClick={searchVideos}
                                className="search-btn"
                                aria-label="Search for videos"
                            >
                                Search
                            </button>
                        </div>
                    </section>

                    {/* Loading */}
                    {loading && <Loader />}

                    {/* Video Player */}
                    {selectedVideo && (
                        <div className="video-player-container" id="video-player">
                            <div className="video-player-wrapper">
                                <div className="video-iframe-container">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${selectedVideo}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="video-iframe"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Videos Grid */}
                    <div className="video-grid">
                        {videos.map((video) => (
                            <div
                                key={video.id.videoId}
                                onClick={() => {
                                    setSelectedVideo(video.id.videoId);
                                    setTimeout(() => {
                                        const player = document.getElementById("video-player");
                                        if (player) {
                                            player.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }, 100);
                                }}
                                className="video-card"
                            >
                                <div className="video-thumbnail-container">
                                    <img
                                        src={video.snippet.thumbnails.medium.url}
                                        alt={video.snippet.title}
                                        className="video-thumbnail"
                                    />
                                    <div className="play-overlay">
                                        <Play size={48} fill="white" color="white" />
                                    </div>
                                </div>
                                <h3 className="video-title">
                                    {video.snippet.title}
                                </h3>
                                <div className="video-date">
                                    <Clock size={12} />
                                    <span>{formatDate(video.snippet.publishTime)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {searchActive && videos.length === 0 && !loading && (
                        <div className="no-results">
                            <Eye size={64} style={{ color: 'rgba(255, 255, 255, 0.6)', margin: '0 auto 1rem auto' }} />
                            <h3>No videos found</h3>
                            <p>Try searching with different keywords</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default VideoSearch;
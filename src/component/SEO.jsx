import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Video Search - Find & Discover Videos Instantly", 
  description = "Powerful video search engine to find and discover videos instantly. Search millions of videos across platforms.",
  keywords = "video search, find videos, video discovery, search engine",
  url = "https://mj-video-search.vercel.app/",
  image = "/vsLogo.png"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
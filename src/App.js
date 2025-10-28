import { HelmetProvider } from 'react-helmet-async';
import VideoSearch from './component/VideoSearch';
import SEO from './component/SEO';
import Analytics from './component/Analytics';

function App() {
  return (
    <HelmetProvider>
      <div>
        <SEO />
        <Analytics />
        <VideoSearch />
      </div>
    </HelmetProvider>
  );
}

export default App;

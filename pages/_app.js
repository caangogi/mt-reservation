import '../styles/globals.css'
import ProgressBar from '@badrap/bar-of-progress';
import Router from 'next/router';
import { AuthProvider } from '../context/auth';
import { ProfileProvider } from '../context/ProfileContext';
import { RoadmapProvider } from '../context/RoadMapsContext';
import { Toaster } from 'react-hot-toast';

const progress = new ProgressBar({
  size: 4,
  color: "#0099c9",
  className: 'z-50',
  delay: 100
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ProfileProvider>
      <RoadmapProvider>
      <Component {...pageProps} />
      <Toaster />
      </RoadmapProvider>
      </ProfileProvider>
    </AuthProvider>
  )
}

export default MyApp

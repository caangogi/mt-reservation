import '../styles/globals.css'
import ProgressBar from '@badrap/bar-of-progress';
import Router from 'next/router';
import { AuthProvider } from '../context/auth';
import { Toaster } from 'react-hot-toast';

const progress = new ProgressBar({
  size: 4,
  color: "#00c3ff",
  className: 'z-50',
  delay: 100
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  )
}

export default MyApp

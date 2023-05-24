import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';
import Head from 'next/head';
import { wrapper } from '../src/features/redux/store';
import { FC, useEffect, useState } from 'react';
import { SocketProvider } from '../src/contexts/socket';
import { ClipLoader } from 'react-spinners';
import Logo from '../src/assets/imgs/LogoFullLong.png';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <SocketProvider>
      <ReduxProvider store={store}>
        <Head>
          <title>Chatala</title>
        </Head>
        {!loading ? (
          <Component {...pageProps} />
        ) : (
          <div
            style={{
              position: 'absolute',
              width: '100vw',
              height: '100vh',
              backgroundColor: '#a3c2d6',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <Image src={Logo} alt="logo" />
            <ClipLoader color="F7FBFC" size={20} />
          </div>
        )}
      </ReduxProvider>
    </SocketProvider>
  );
};

export default MyApp;

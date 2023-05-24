import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';
import Head from 'next/head';
import { wrapper } from '../src/features/redux/store';
import { FC, useEffect, useState } from 'react';
import { SocketProvider } from '../src/contexts/socket';
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
        {!loading ? <Component {...pageProps} /> : 'Loading...'}
      </ReduxProvider>
    </SocketProvider>
  );
};

export default MyApp;

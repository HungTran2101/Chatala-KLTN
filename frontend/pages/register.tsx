import Router from 'next/router';
import Register from '../src/components/Register';

const register = () => {
  return <Register />;
};

register.getInitialProps = async ({ req, res }) => {
  if (req?.cookies.token) {
    if (res) {
      // On the server, we'll use an HTTP response to
      // redirect with the status code of our choice.
      // 307 is for temporary redirects.
      res.writeHead(307, { Location: '/' });
      res.end();
    } else {
      // On the client, we'll use the Router-object
      // from the 'next/router' module.
      Router.replace('/');
    }

    return {};
  }

  return {
    data: null,
  };
};

export default register;
import { useEffect } from 'react';
import Login from '../src/components/Login';
import { UsersApi } from '../src/services/api/users';
import Router, { useRouter } from 'next/router';
const login = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     try {
  //       const res = await UsersApi.getLoggedUser();
  //       router.replace('/');
  //     } catch (err) {}
  //   };
  //   checkLogin();
  // }, []);

  return <Login />;
};

login.getInitialProps = async ({ req, res }) => {
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

    return {}
  }

  return {
    data: null,
  };
};

export default login;

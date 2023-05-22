import Login from '../src/components/Login';
import cookie from 'cookie';
const login = () => {
  return <Login />;
};
export async function getServerSideProps(context) {
  let headerCookie = context.headers?.cookie;
  if (typeof headerCookie !== 'string') {
    headerCookie = '';
  }
  const parsedCookies = cookie.parse(headerCookie);
  console.log(context.headers);

  return { props: {} };
}

export default login;

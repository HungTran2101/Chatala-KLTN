import Login from '../src/components/Login';
const login = () => {
  return <Login />;
};
export async function getServerSideProps(context) {
  let headerCookie = context.headers?.cookie;
  if (typeof headerCookie !== 'string') {
    headerCookie = '';
  }
  console.log(context.headers);

  return { props: {} };
}

export default login;

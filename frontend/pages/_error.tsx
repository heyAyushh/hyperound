import Error from 'next/error';


function Page({ statusCode }: { statusCode: number }): JSX.Element {
  return <Error statusCode={statusCode}></Error>;
}

Page.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Page;
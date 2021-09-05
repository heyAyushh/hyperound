import { useRouter } from 'next/router';

export default function Post(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  return (
    <h1>Welcome {username}</h1>
  )
}
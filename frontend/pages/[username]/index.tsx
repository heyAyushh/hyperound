import { Avatar, Button, Grid, Page, Spacer, Card } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "../../components/header";
import Restricted from "../../components/Restricted";
import { loggedInTwitterState } from "../../store/loggedIn";

export default function Post(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  const [twitter, setTwitter] = useRecoilState(loggedInTwitterState)

  return (
    !twitter ?
      <Page>
        <Page.Header>
          <Header />
        </Page.Header>
        <Spacer h={7} />
        <h1>Welcome {username}</h1>

        <Avatar src={'https://react.geist-ui.dev/images/avatar.png'} />

        <Button >Create your token</Button>
        <Grid.Container gap={2} justify="center">
          <Grid xs={12} md={16}><Card shadow width="100%" height="50px" /></Grid>
          <Grid xs={12} md={8}><Card shadow width="100%" height="50px" /></Grid>
        </ Grid.Container>
      </Page>
      :
      <>
        <Restricted />
      </>
  )
}
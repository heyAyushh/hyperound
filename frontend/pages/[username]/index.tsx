import { Avatar, Button, Grid, Page, Spacer, Card } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Header from "../../components/header";
import Restricted from "../../components/Restricted";
import { createToken } from "../../helpers/token";
import { loggedInState, loggedInTwitterState, loggedInWalletState } from "../../store/loggedIn";
import { tokenState } from "../../store/token";

export default function Post(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  const [loggedIn, setTwitter] = useRecoilState(loggedInState);
  const [walletConnect, setWalletConnected] = useRecoilState(loggedInWalletState);
  const [token, setToken] = useRecoilState(tokenState);

  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Spacer h={7} />
      <h1>Welcome 👋</h1>

      <Grid.Container gap={2} justify="center">
        <Grid xs={12} md={16}>
          <Card shadow width="100%" >
            <Button onClick={async () => {

              const data = await createToken();

              setToken({
                signature: data.signature,
                transaction: data.transaction,
                mint: data.mint,
                exists: false,
              })

              console.log(data);
            }}>Create your token</Button>
          </Card>
        </Grid>
        <Grid xs={12} md={8}><Card shadow width="100%"  />
          {/* Mint: {token.mint} */}
        </Grid>
      </ Grid.Container>
    </Page>
  )
}
import { Avatar, Button, Grid, Page, Spacer, Card, useToasts } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Header from "../../components/header";
import Restricted from "../../components/Restricted";
import { createToken } from "../../helpers/token";
import { loggedInState, loggedInTwitterState, loggedInWalletState } from "../../store/loggedIn";
import { tokenState } from "../../store/token";
import Link from 'next/link';

export default function Post(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  const [loggedIn, setTwitter] = useRecoilState(loggedInState);
  const [walletConnect, setWalletConnected] = useRecoilState(loggedInWalletState);
  const [token, setToken] = useRecoilState(tokenState);
  const [_, setToast] = useToasts();

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

              try {
                const data = await createToken();

                setToken({
                  signature: data.signature,
                  transaction: data.transaction,
                  mint: data.mint,
                  exists: false,
                })

                const action = {
                  name: 'alert',
                  handler: () => router.push('https://explorer.solana.com/?cluster=devnet')
                }

                setToast({
                  text: 'Your Mint was suceessful',
                  type: 'success',
                  actions: [action],
                })
              } catch (err) {
                setToast({
                  text: err.message,
                  type: 'error'
                })
              }

            }}>Create your token</Button>
            <Link href={'/' + username + '/live'} passHref>
              <Button >Go Live</Button>
            </Link>
          </Card>
        </Grid>
        <Grid xs={12} md={8}><Card shadow width="100%" />
          {/* Mint: {token.mint} */}
        </Grid>
      </ Grid.Container>
    </Page >
  )
}
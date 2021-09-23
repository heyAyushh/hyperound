import { Avatar, Button, Grid, Page, Spacer, Card, useToasts, Description, Collapse, Text } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Header from "../../components/header";
import { createToken } from "../../helpers/token";
import { loggedInState, loggedInTwitterState, loggedInWalletState } from "../../store/loggedIn";
import { tokenState } from "../../store/token";
import Link from 'next/link';
import { Divider } from "@geist-ui/react";

export default function Post(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  const [creatingToken, setCreatingToken] = useState(false);
  const [loggedIn, setTwitter] = useRecoilState(loggedInState);
  const [walletConnect, setWalletConnected] = useRecoilState(loggedInWalletState);
  const [token, setToken] = useRecoilState(tokenState);
  const [_, setToast] = useToasts();

  return (
    <Page >
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Content>
        <Grid.Container gap={2} justify="center">
          <Grid md={16}>
            <Card shadow width="100%">
              <h1>Welcome 👋</h1>
              <div>
                <Button
                  loading={creatingToken}
                  onClick={async () => {
                    try {
                      setCreatingToken(true);
                      const data = await createToken();

                      setToken({
                        signature: data.signature,
                        transaction: data.transaction,
                        mint: data.mint,
                        exists: false,
                      })

                      const action = {
                        name: 'Check on Explorer',
                        handler: () => router.push(`https://explorer.solana.com/address/${data.mint.publicKey.toBase58()}?cluster=devnet`)
                      }

                      setToast({
                        text: 'Your Mint was suceessful!, Added to your wallet.',
                        type: 'success',
                        actions: [action],
                      })

                      setCreatingToken(false);
                    } catch (err) {
                      setToast({
                        text: err.message,
                        type: 'error'
                      })
                    }
                  }}>{'Create your token'}</Button>
                <br />
                <br />
                <Link href={'/' + username + '/live'} passHref>
                  <Button type="secondary">go live</Button>
                </Link>
              </div>
            </Card>
          </Grid>
          <Grid xs={0} md={8}>
            <Card shadow width="100%" h-c>
              <Spacer h={2} />
              <Description title="Profile" content="Data about this section." />
              <Spacer h={2} />
              <Divider />
              <Spacer h={1} />
              <h2>Profile</h2>
              <h2>Hype Coins</h2>
              <h2>Creator</h2>
              <h2>Settings</h2>
              {/* Mint: {token.mint} */}
            </Card>
          </Grid>
        </ Grid.Container>
      </Page.Content>
      <Page.Footer className="">
        <div className="">
          <Divider />
        </div>
        <div >
          <Card className='bg-dark-accent-2 w-auto h-20 mr-8'>
            <Spacer h={2} />
          </Card>
        </div>
      </Page.Footer>
    </Page >
  )
}
import { Avatar, Button, Grid, Page, Spacer, Card, useToasts, Description, Collapse, Text, useMediaQuery } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Header from "../../components/Header";
import { createToken } from "../../helpers/token";
import { loggedInState, loggedInTwitterState, loggedInWalletState } from "../../store/loggedIn";
import { tokenState } from "../../store/token";
import Link from 'next/link';
import { Divider } from "@geist-ui/react";
import { useKBar } from "kbar";
import { VisualState } from "../../types/types";
import Footer from "../../components/Footer";
import { GetServerSidePropsContext } from "next";
import { userState } from "../../store/user";

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
  const { username } = context.params;
  const backend = process.env.NEXT_PUBLIC_BACKEND;

  let data;

  try {
    const res = await fetch(`${backend}/profile/name/${username}`);
    data = await res.json();
  } catch (err) {
    return {
      redirect: {
        destination: '/404',
        permanent: true,
      },
    }
  }

  // or use context.resolvedUrl for conditional redirect
  // if(context.resolvedUrl == "/")
  if (data.statusCode === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: true,
      },
    }
  }

  return {
    props: { profile: data }, // will be passed to the page component as props
  }
}

export default function Post({ profile }): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  const [creatingToken, setCreatingToken] = useState(false);
  const [loggedIn, setTwitter] = useRecoilState(loggedInState);
  const [user] = useRecoilState(userState);
  const [walletConnect, setWalletConnected] = useRecoilState(loggedInWalletState);
  const [token, setToken] = useRecoilState(tokenState);
  const [_, setToast] = useToasts();
  const { visible } = useKBar(state => ({
    visible: state.visualState !== VisualState.hidden
  }));

  const isMobile = useMediaQuery('mobile');
  const isOwner = username === user.username;

  console.log(profile)

  return (
    <Page >
      <Header />
<div className="container p-4">

      <>
        <>
          <div className="h-full mb-52">

            <Grid.Container gap={2} justify="center">
              <Grid md={16}>
                <Card shadow width="100%">
                  <h1>Welcome 👋</h1>

                  <div>
                    <Button
                      loading={creatingToken}
                      style={{
                        filter: visible ?
                          "blur(16px)" :
                          "",
                      }}
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
                      <div >
                        <Button type="secondary"
                          style={{
                            filter: visible ?
                              "blur(16px)" :
                              "",
                          }}>go live</Button>
                      </div>
                    </Link>
                  </div>
                </Card>
              </Grid>
              <Grid xs={24} md={8}>

                <Card shadow width="100%" className="flex" >
                  <h1>Hello Bitches</h1>
                  <Spacer h={2} />
                  <Description title="Profile" content="Data about this section." />
                  <Spacer h={2} />
                  <Divider />
                  <Spacer h={1} />

                  <Grid.Container gap={2} className="items-center" direction="row">
                    <Grid >
                      <Text h3>Followers </Text>
                    </Grid>
                    <Grid >
                      <Avatar.Group count={12}>
                        {/* <Avatar src={url} stacked /> */}
                        <Avatar text="W" stacked />
                        <Avatar text="Ana" stacked />
                      </Avatar.Group>
                    </Grid>
                  </Grid.Container>

                  <Grid.Container gap={2} className="items-center" direction="row">
                    <Grid >
                      <Text h3>Fans </Text>
                    </Grid>
                    <Grid >
                      <Avatar.Group count={12}>
                        {/* <Avatar src={url} stacked /> */}
                        <Avatar text="W" stacked />
                        <Avatar text="Ana" stacked />
                      </Avatar.Group>
                    </Grid>
                  </Grid.Container>

                  <Grid.Container gap={2} className="items-center" direction="row">
                    <Grid >
                      <Text h3>Posts </Text>
                    </Grid>
                    <Grid >
                      <Avatar.Group count={12}>
                        {/* <Avatar src={url} stacked /> */}
                        <Avatar text="W" stacked />
                        <Avatar text="Ana" stacked />
                      </Avatar.Group>
                    </Grid>
                  </Grid.Container>

                  {isOwner ?
                    <>
                      <Divider />
                      <br />
                      <h4>Profile</h4>
                      <h4>Hype Coins</h4>
                      <h4>Creator</h4>
                      <h4>Settings</h4>
                    </> : ""}
                  {/* Mint: {token.mint} */}
                </Card>
              </Grid>
            </ Grid.Container>
          </div>
        </>
      </>
      <Footer />
</div>
    </Page >
  )
}
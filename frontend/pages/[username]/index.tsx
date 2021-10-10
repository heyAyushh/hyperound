import { Avatar, Button, Grid, Page, Spacer, Card, useToasts, Description, Collapse, Text, useMediaQuery, Tabs } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Header from "../../components/Header";
import { createToken } from "../../helpers/token";
import { loggedInState, loggedInWalletState } from "../../store/loggedIn";
import { tokenState } from "../../store/token";
import Link from 'next/link';
import { Divider } from "@geist-ui/react";
import { useKBar } from "kbar";
import { VisualState } from "../../types/types";
import Footer from "../../components/Footer";
import { GetServerSidePropsContext } from "next";
import { userState } from "../../store/user";
import useSWR from "swr";
import { fetcher } from "../../helpers/swr";
import { getAvatarUrl } from "../../helpers/avatar";
import { useTheme } from "next-themes";
import createTokenButton from "../../helpers/solanaProgram";

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
    props: { profile: data, }, // will be passed to the page component as props
  }
}

export default function Post({ profile }): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [creatingToken, setCreatingToken] = useState(false);
  const [loggedIn, setTwitter] = useRecoilState(loggedInState);
  const [currentUser] = useRecoilState(userState);
  const [walletConnect, setWalletConnected] = useRecoilState(loggedInWalletState);
  const [token, setToken] = useRecoilState(tokenState);
  const [_, setToast] = useToasts();
  const { visible } = useKBar(state => ({
    visible: state.visualState !== VisualState.hidden
  }));

  const posts = useSWR(`${process.env.NEXT_PUBLIC_BACKEND}/posts/user/${username}`, fetcher);

  const isMobile = useMediaQuery('mobile');
  const isOwner = username === currentUser.username;

  function SectionOne(): JSX.Element {

    // cover & side menu settings
    return (
      <Grid.Container gap={2}
        justify="center"
        style={{}}
      >

        {/* header avatar - follow buttons*/}
        <Grid md={16} >
          <Card className="flex ">
            {/* header avatar */}
            {
              profile.cover ?
                <img src={profile.cover} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover", position: 'relative' }} />
                // eslint-disable-next-line tailwindcss/no-custom-classname
                :
                <div className="flex ">
                  <div
                    style={{ height: "350px", width: "100%", }}
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    className="flex flex-1 items-end w-full h-full bg-light-accent-2 dark:bg-dark-accent-2"
                  >
                    <div className="flex-1 p-2">
                      {profile.avatar ?
                        <Avatar src={profile.avatar} scale={2} />
                        : <Avatar
                          src={getAvatarUrl(profile.username)}
                          style={{ padding: '08px', backgroundColor: "#fff" }}
                          scale={isMobile ? 6 : 10}
                        />}
                    </div>
                  </div>
                </div>
            }
            <Divider />
            <Spacer />
            {/*  follow buttons*/}
            <div className="flex flex-col flex-wrap gap-4 justify-center">
              <Button
                className=""
                loading={creatingToken}
                style={{
                  filter: visible ?
                    "blur(16px)" :
                    "",
                }}
                onClick={(e) => {
                  if (e.defaultPrevented)
                    createTokenButton(
                      setCreatingToken,
                      router,
                      setToken,
                      setToast,
                    );
                }}>{'Create your token'}</Button>
              <Link href={'/' + username + '/live'} passHref>
                <Button type="secondary"
                  className=""
                  style={{
                    filter: visible ?
                      "blur(16px)" :
                      "",
                  }}>go live</Button>
              </Link>
            </div>

          </Card>
          <Spacer h={3} />
        </Grid>

        {/* context menu */}
        <Grid xs={24} md={8} h="100%" className={`${isMobile ? 'm-2' : ''}`}>
          <Card shadow width="100%" >
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
              {profile.followers.count ?
                <>
                  <Grid >
                    <Text h3>Fans </Text>
                  </Grid>
                  <Grid >
                    <Avatar.Group count={profile.followers.count}>
                      {/* <Avatar src={url} stacked /> */}
                      <Avatar text="W" stacked />
                      <Avatar text="Ana" stacked />
                    </Avatar.Group>
                  </Grid>
                </>
                :
                <>
                  <Grid >
                    <Text h3>No Fans </Text>
                  </Grid>
                  <Grid >
                  </Grid>
                </>
              }
            </Grid.Container>

            <Grid.Container gap={2} className="items-center" direction="row">
              {posts?.data?.length ?
                <>
                  <Grid >
                    <Text h3>Posts </Text>
                  </Grid>
                  <Grid >
                    <Text h3>{posts?.data?.length}</Text>
                  </Grid>
                </>
                :
                <>
                  <Grid >
                    <Text h3>No Posts </Text>
                  </Grid>
                  <Grid >
                  </Grid>
                </>
              }
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
    )
  }

  return (
    <div className="page">
      <Header />
      <div
        style={{
          marginBottom: `${isMobile ? "300px" : "120px"}`,
          padding: isMobile ? "5px" : "40px"
        }} >

        {SectionOne()}

        <Spacer h={1.5} />

        <Card shadow className="">
          <Tabs initialValue="1" >
            <Tabs.Item label="about" value="1" scale={isMobile ? 1.5 : 6} >
              <div className="">
                <h3>Evenr</h3>
              </div>
            </Tabs.Item>
            <Tabs.Item label="posts" value="2" scale={isMobile ? 1.5 : 6}>Between the Web browser and the server, numerous computers and machines relay the HTTP messages.</Tabs.Item>
            <Tabs.Item label="drops" value="3" scale={isMobile ? 1.5 : 6}>Between the Web browser and the server, numerous computers and machines relay the HTTP messages.</Tabs.Item>
          </Tabs>
        </Card>

      </div>
      <Footer />
    </div >
  )
}
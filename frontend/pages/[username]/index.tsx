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
import { useKBar, VisualState } from "kbar";
import Footer from "../../components/Footer";
import { GetServerSidePropsContext } from "next";
import { userState } from "../../store/user";
import useSWR from "swr";
import { fetcher } from "../../helpers/swr";
import { getAvatarUrl } from "../../helpers/avatar";
import { useTheme } from "next-themes";
import createTokenButton from "../../helpers/solanaProgram";
import { motion } from 'framer-motion';
import axios from "axios";
import useUser from "../../lib/useUser";

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
  const { username } = context.params;
  const backend = process.env.NEXT_PUBLIC_BACKEND;

  let data;

  try {
    const res = await axios.get(`${backend}/profile/name/${username}`, {
      withCredentials: true,
    });
    data = res.data;
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
  // const [currentUser] = useRecoilState(userState);
  const { user: currentUser, isLogggedin } = useUser();
  const [walletConnect, setWalletConnected] = useRecoilState(loggedInWalletState);
  const [token, setToken] = useRecoilState(tokenState);
  const [_, setToast] = useToasts();
  const { visible } = useKBar(state => ({
    visible: state.visualState !== VisualState.hidden
  }));

  const posts = useSWR(`${process.env.NEXT_PUBLIC_BACKEND}/posts/user/${username}`, fetcher);

  const isMobile = useMediaQuery('xs');
  const isOwner = username === currentUser?.username;
  const isCreator = currentUser?.isCreator;

  function SectionOne(): JSX.Element {

    // cover & side menu settings
    return (
      <Grid.Container
        justify='space-between'
      >

        {/* header & avatar - follow buttons*/}
        <Grid xs={24} md={17} style={{ width: isMobile ? '300px' : '100%' }}>
          <Card style={{ width: isMobile ? '300px' : '100%' }} >
            {/* header & avatar */}
            {
              profile.cover ?
                <img src={profile.cover} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover", position: 'relative' }} />
                // eslint-disable-next-line tailwindcss/no-custom-classname
                :
                <div
                  style={{ height: "350px", }}
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className="flex flex-1 items-end bg-light-accent-2 dark:bg-dark-accent-2"
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
            }
            <Divider />
            <Spacer />
            {/*  follow buttons*/}
            <div className={`flex flex-col flex-grow-0 gap-4 justify-center ${isMobile ? '' : 'w-3/12'}`}>
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
                }}>
                {'Create your token'}
              </Button>
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
        <Grid xs={24} md={7} h="100%" className={`${isMobile ? '' : 'm-2'}`}>
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
                {/* <Link href={`${username}/profile`} passHref>
                  <motion.div
                   whileHover={{ scale: 0.96 }}
                   className=" hover:text-transparent dark:hover:text-transparent bg-clip-text bg-gradient-to-tr from-red-200 via-red-300 to-yellow-200 ">
                    <h4>Profile</h4>
                  </motion.div>
                </Link> */}
                <Link href={"/coins"} passHref>
                  <motion.div
                    whileHover={{ scale: 0.96 }}
                    className=" hover:text-transparent dark:hover:text-transparent bg-clip-text bg-gradient-to-tr from-green-200 via-green-400 to-purple-700">
                    <h4 >Hype Coins</h4>
                  </motion.div>
                </Link>
                <Link href={`/creators`} passHref>
                  <motion.div
                    whileHover={{ scale: 0.96, }}
                    className="hover:text-transparent dark:hover:text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600">
                    <h4>Creator</h4>
                  </motion.div>
                </Link>
                <Link href={`${username}/settings`} passHref>
                  <motion.div
                    whileHover={{ scale: 0.96, }}
                    className="flex flex-wrap hover:text-transparent dark:hover:text-transparent bg-clip-text bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900">
                    <h4>Settings</h4>
                  </motion.div>
                </Link>
              </> : ""}
            {/* Mint: {token.mint} */}
          </Card>
        </Grid>
      </ Grid.Container>
    )
  }

  const [tabValue, setTabValue] = useState('2');

  function SectionTwo(): JSX.Element {

    return <div>
      <Grid xs={24} md={24} >

        <Card >
          <Tabs value={tabValue} onChange={(v) => setTabValue(v)}>
            <Tabs.Item font={!isMobile ? "300%" : "200%"} label="about" value="1" />
            <Tabs.Item font={!isMobile ? "300%" : "200%"} label="posts" value="2" />
            <Tabs.Item font={!isMobile ? "300%" : "200%"} label="drops" value="3" />
          </Tabs>
          <div className=" min-h-screen">
            Tab Display {tabValue}
          </div>
        </Card>
      </Grid>
    </div>
  }

  return (
    <div className="page">
      <div className="mr-2">
        <Header />
      </div>
      <div
        style={{
          marginBottom: `${isMobile ? "300px" : "120px"}`,
          padding: isMobile ? "5px" : "40px"
        }} >

        {SectionOne()}

        <Spacer h={1.5} />

        {SectionTwo()}

      </div>
      <Footer />
    </div >
  )
}
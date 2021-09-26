import Header from '../components/Header';
import { Page, Text } from "@geist-ui/react";
import JoinForm from '../components/Live/JoinForm';
import { useHMSActions, useHMSStore, selectIsConnectedToRoom } from '@100mslive/hms-video-react';
import { useEffect, useState } from 'react';
import Room from '../components/Live/Room';
import Footer from "../components/Footer";

const tokenEndpoint = "https://prod-in.100ms.live/hmsapi/hyperound.app.100ms.live/api/token";

const getToken = async (user_id) => {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      role: "guest",
      type: "app",
      room_id: "6134839063a19c8f26df36ed"
    })
  });
  const { token } = await response.json();
  return token;
}

export default function Live(): JSX.Element {

  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  const handleSubmit = async (uname) => {
    const token = await getToken(uname);

    hmsActions.join({
      authToken: token,
      userName: uname
    });
  };

  return (
    <Page>
      <Header />

      {/* <Text h1 className={'font-extrabold md:text-9xl m-5 text-5xl'}>live streaming</Text> */}
      {/* {isConnected ? <Room /> :  <JoinForm handleSubmit={handleSubmit} />} */}

      <Footer />
    </Page>
  );
}
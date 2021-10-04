import { useHMSActions, useHMSStore, selectIsConnectedToRoom } from "@100mslive/hms-video-react";
import { Avatar, Button, Grid, Page, Spacer, Card } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import JoinForm from "../../components/Live/JoinForm";
import Room from "../../components/Live/Room";

const tokenEndpoint = "https://prod-in.100ms.live/hmsapi/hyperound.app.100ms.live/api/token";

const getToken = async (user_id, room) => {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      role: "guest",
      type: "app",
      room_id: room
    })
  });
  const { token } = await response.json();
  return token;
}

export default function JoinRoom(): JSX.Element {
  const router = useRouter();

  const { room } = router.query;

  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  const handleSubmit = async (uname) => {
    // console.log(uname, room);

    const token = await getToken(uname, room);

    hmsActions.join({
      authToken: token,
      userName: uname
    });
  };

  return (
    <Page>
      {isConnected ? <Room room_id={room} /> : <JoinForm handleSubmit={handleSubmit} />}
      <Footer />
    </Page >
  )
}
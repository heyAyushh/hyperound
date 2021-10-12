import { useHMSActions, useHMSStore, selectIsConnectedToRoom } from "@100mslive/hms-video-react";
import { Page, Spacer } from "@geist-ui/react";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { MdLiveTv } from "react-icons/md";
import Room from "../../components/Live/Room";
import Footer from "../../components/Footer";
import { useBeforeUnload } from "react-use";

const tokenEndpoint = process.env.NEXT_PUBLIC_HMS_TOKEN;

const getToken = async (user_id, room) => {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      role: "host",
      type: "app",
      room_id: room
    })
  });
  const { token } = await response.json();
  return token;
}

const addRoom = async () => {
  const response = await fetch("/api/addRoom", {
    method: "POST"
  });
  const { room_id } = await response.json();
  console.log("room_id", room_id)
  return room_id;
}


export default function Live(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  const [room, setRoom] = useState("");

  const handleSubmit = async () => {
    const room_id = await addRoom();
    setRoom(room_id);

    const token = await getToken(username, room_id);

    hmsActions.join({
      authToken: token,
      // @ts-expect-error ,sa dknalj
      userName: username
    });
  };
  
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      hmsActions.leave();
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return (
    <Page>
      <Header />

      <Page.Content>
        {isConnected ? <Room room_id={room} /> : <div style={{
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: "100px"
        }}>
          <button onClick={() => handleSubmit()} style={{
            padding: "12px",
            backgroundColor: "#FF0080",
            borderRadius: "5px",
            width: "100%",
            fontSize: "60px",
            fontWeight: "bold",
            height: "300px",
            textTransform: "uppercase",
            letterSpacing: "2px"
          }} className="btn-primary">Go Live</button>
        </div>}
      </Page.Content>
      <Footer />
    </Page>
  )
}
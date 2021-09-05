import {
    useHMSStore,
    selectLocalPeer,
    selectPeers
} from "@100mslive/hms-video-react"
import { Grid } from "@geist-ui/react";
import { HostVideo } from "./HostVideo";
import { VideoTile } from "./VideoTile";

export default function Room({room_id}) {

    const localPeer = useHMSStore(selectLocalPeer);
    const peers = useHMSStore(selectPeers);

    const types = ['secondary', 'success', 'warning', 'error', 'dark', 'alert', 'purple', 'violet', 'cyan']

    return (
        <div>
            {peers.find(o => o.roleName === "host")
            ?
            <div style={{
                maxWidth: "600px",
                marginRight: "auto",
                marginLeft: "auto",
                position: "relative"
            }}>
                <HostVideo
                    room_id={room_id} peer={peers.find(o => o.roleName === "host")} 
                />
            </div>
            :
            null
            }
            <div style={{padding: "30px"}} />
            <Grid.Container gap={2} justify="center">
                {localPeer && <Grid xs={4}>
                    <VideoTile cardType={types[Math.floor(Math.random() * 9)]} peer={localPeer} isLocal={true} />
                </Grid>}
                {peers && peers
                    .filter(p => !p.isLocal)
                    .filter(p => p.roleName == "guest")
                    .map(peer => {
                    return (
                        <Grid key={peer.name} xs={6}>
                            <VideoTile cardType={types[Math.floor(Math.random() * 9)]} isLocal={false} peer={peer} />
                        </Grid>
                    )})
                }
            </Grid.Container>
        </div>
    )
}
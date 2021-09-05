import { useHMSActions, useHMSStore, selectCameraStreamByPeerID } from "@100mslive/hms-video-react"
import {Card} from "@geist-ui/react";
import React, { useEffect } from "react";

export function VideoTile ({peer, isLocal, cardType}) {

    const hmsActions = useHMSActions();
    const videoRef = React.useRef(null);
    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));

    useEffect(() => {
        if (videoRef.current && videoTrack) {
            if (videoTrack.enabled) {
                hmsActions.attachVideo(videoTrack.id, videoRef.current);
            } else {
                hmsActions.detachVideo(videoTrack.id, videoRef.current);
            }
        }
    }, [videoTrack, hmsActions]);

    useEffect(() => {
        console.log(cardType)
    }, []);

    return (
        <Card className="container" height="150px" style={{
            textAlign: "center"
        }} type={cardType} shadow width="100%">
            <div className="vertical-center">
                <p style={{
                    fontSize: "35px",
                    fontWeight: "bold"
                }}>{peer.name.split(" ").map((n,i,a)=> i === 0 || i+1 === a.length ? n[0] : null).join("")} {isLocal ? "(me)" : null}</p>
            </div>
        </Card>
    )
}
import { useHMSStore, selectCameraStreamByPeerID, useHMSActions } from "@100mslive/hms-video-react";
import router from "next/router";
import React, { useEffect } from "react";
import { FiLogOut, FiExternalLink } from "react-icons/fi";

export function HostVideo({peer, room_id}) {

    const hmsActions = useHMSActions();
    const videoRef = React.useRef(null);
    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer?.id));

    useEffect(() => {
        if (videoRef.current && videoTrack) {
            if (videoTrack.enabled) {
                hmsActions.attachVideo(videoTrack.id, videoRef.current);
            } else {
                hmsActions.detachVideo(videoTrack.id, videoRef.current);
            }
        }
    }, [videoTrack, hmsActions]);

    return (
        <div>
            <video
                style={{
                    borderRadius: "10px"
                }}
                ref={videoRef}
                autoPlay={true}
                playsInline
                muted={false}
                width="100%"
            />
            <p style={{
                position: "absolute",
                left: "20px",
                bottom: "2px",
                backgroundColor: "#000",
                padding: "5px",
                borderRadius: "5px",
                paddingLeft: "10px",
                paddingRight: "10px"
            }}>{peer.name}</p>
            <button
                onClick={() => {
                    const a = document.createElement("a");
                    a.href = `https://hyperound.com/room/${room_id}`;
                    a.setAttribute('target', '_blank');
                    a.click();
                }}
                style={{
                    padding: "10px",
                    backgroundColor: "#FF0080",
                    borderRadius: "5px",
                    position: "absolute",
                    right: "20px",
                    bottom: "15px",
                }}
            ><FiExternalLink /></button>
        </div>
    )
}
import { useHMSActions, useHMSStore, selectIsConnectedToRoom } from "@100mslive/hms-video-react";
import { useEffect } from "react";

export const Disconnect = (): null => {
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);

    useEffect(() => {
      window.onunload = () => {
        if (isConnected) {
          hmsActions.leave();   
        }
      };
    }, [hmsActions, isConnected]);
    return null
}
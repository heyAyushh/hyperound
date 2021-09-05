import { useHMSActions } from "@100mslive/hms-video-react";
import { useState } from "react";

function JoinForm({handleSubmit}) {

  const [username, setUsername] = useState("");

  return (
    <div style={{
      maxWidth: "400px",
      marginLeft: "auto",
      marginRight: "auto",
      height: "70vh"
    }} className="container" onSubmit={handleSubmit}>
      <div className="center">
        <input
          onChange={(e) => setUsername(e.target.value)}
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
          style={{
            padding: "12px",
            borderRadius: "5px",
            width: "100%"
          }}
        />
        <div style={{padding: "8px"}} />
        <button onClick={() => handleSubmit(username)} style={{
          padding: "12px",
          backgroundColor: "#FF0080",
          borderRadius: "5px",
          width: "100%"
        }} className="btn-primary">Join</button>
      </div>
    </div>
  );
}

export default JoinForm;

import React, { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import useAgora from "./hooks/useAgora";
import MediaPlayer from "./components/MediaPlayer";
import "./Call.css";
import "bootstrap/dist/css/bootstrap.min.css";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

export default function App() {
  const [channel, setChannel] = useState("default");

  const {
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers
  } = useAgora(client);

  return (
    <div className="call">
      <form className="call-form">
        {/* <label>
          AppID:
          <input
            type="text"
            name="appid"
            onChange={(event) => {
              setAppid(event.target.value);
            }}
          />
        </label> */}
        {/* <label>
          Token(Optional):
          <input
            type="text"
            name="token"
            onChange={(event) => {
              setToken(event.target.value);
            }}
          />
        </label> */}
        <label>
          <b> Channel: </b>
          <input
            type="text"
            name="channel"
            onChange={(event) => {
              setChannel(event.target.value);
            }}
          />
        </label>

        <div className="button-group">
          <button
            id="join"
            type="button"
            className="btn btn-primary btn-sm"
            disabled={joinState}
            onClick={() => {
              join(channel, null);
            }}
          >
            Join
          </button>
          <button
            id="leave"
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!joinState}
            onClick={() => {
              leave();
            }}
          >
            Leave
          </button>
        </div>
      </form>
      {/* <b> */}
      {/* {JSON.stringify(joinState) === "joined"
          ? "No One is Here"
          : "Welcome to the '" + channel + "' Room"}
      </b>{" "} */}
      <br />
      {/* <b> Local Video: {JSON.stringify(localVideoTrack)}</b> <br />
      <b> Remote Video: {JSON.stringify(remoteUsers)}</b> */}
      <br />
      <div className="player-container">
        {/* <div> {client.uid} </div> */}
        <div className="local-player-wrapper">
          {/* <p className="local-player-text">
            {localVideoTrack && `localTrack`}
            {joinState && localVideoTrack ? `(${client.uid})` : ""}
          </p> */}
          <MediaPlayer
            videoTrack={localVideoTrack}
            audioTrack={localAudioTrack}
          ></MediaPlayer>
        </div>
        <div className="remotePlayers">
          {remoteUsers.map((user) => (
            <div className="remote-player-wrapper" key={user.uid}>
              {/* <p>Remote Player + {user.uid} </p> */}
              {/* //   <p className="remote-player-text">{`remoteVideo(${user.uid})`}</p> */}
              <MediaPlayer
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack}
              ></MediaPlayer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

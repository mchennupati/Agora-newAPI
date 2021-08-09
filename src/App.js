import React, { useState, useContext } from "react";

import AgoraRTC from "agora-rtc-sdk-ng";
import Logout from "./Logout";

import AgoraRTM from "agora-rtm-sdk";
import { Card } from "react-bootstrap";
import useAgora from "./hooks/useAgora";
import useAgoraChat from "./hooks/useAgoraChat";
import MediaPlayer from "./components/MediaPlayer";
import { AppContext } from "./AppContext";

import "./Call.css";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const chatClient = AgoraRTM.createInstance("1247255ec5e448cba4c61969f94526c0");

export default function App() {
  let { users } = useContext(AppContext);

  const [channel, setChannel] = useState("Just-US");

  const [textArea, setTextArea] = useState("hi");

  const {
    messages,
    sendChannelMessage,
    onlineStatus,
    joinedState,
    remoteUsersChat
  } = useAgoraChat(chatClient, channel);

  const {
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers
  } = useAgora(client);

  // function submitMessage(textArea) {
  //   if (textArea.trim().length === 0) return;
  //   sendChannelMessage(textArea);
  //   setTextArea("");
  // }

  function submitTextArea(e) {
    if (e.charCode === 13) {
      e.preventDefault();
      if (textArea.trim().length === 0) return;
      sendChannelMessage(e.currentTarget.value);
      setTextArea("");
    }
  }

  return (
    <div className="call">
      <Logout /> <br />
      joinedState: {JSON.stringify(joinedState)} <br />
      RemoteUsers :{JSON.stringify(remoteUsersChat)} <br />
      onlineStatus: {JSON.stringify(onlineStatus)} <br />
      <div>
        <div>
          You are in the channel : <b> {channel} </b>
        </div>
        <Card className="messages">
          <div> The messages are here </div>
          {messages.map((data, index) => {
            return (
              <div className="row" key={`chat${index + 1}`}>
                <h5 className="font-size-15" style={{ color: data.user.color }}>
                  {`${data.user.name} :`}
                </h5>
                <p className="text-break">{` ${data.message}`}</p>
              </div>
            );
          })}
        </Card>
        <Card className="ownMessage">
          <div> Hit Enter to Send </div>
          <textarea
            placeholder="Type your message here"
            onChange={(e) => setTextArea(e.target.value)}
            value={textArea}
            onKeyPress={submitTextArea}
          />
          {/* <button style={{}} onClick={() => submitMessage(textArea)}>
            Send
          </button> */}
        </Card>
      </div>
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

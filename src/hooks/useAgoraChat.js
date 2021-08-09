import React, { useEffect, useState, useRef, useContext } from "react";
import useSWR from "swr";
import { useAuth0 } from "@auth0/auth0-react";
import useAuthData from "./useAuthData";

import AgoraRTM from "agora-rtm-sdk";

import randomColor from "randomcolor";
import { AppContext } from "../AppContext";
import axios from "axios";

export default function useAgoraChat(client, channelName) {
  let { user } = useAuth0();

  let { users, isLoading, isError } = useAuthData();

  let USER_ID = user.nickname;

  const [joinedState, setJoinedState] = useState("not done");

  let [messages, setMessages] = useState([]);
  let [members, setMembers] = useState([]);
  let [onlineStatus, setOnlineStatus] = useState("not sure");
  const [remoteUsersChat, setRemoteUsersChat] = useState([]);

  let [currentMessage, setCurrentMessage] = useState();

  let color = useRef(randomColor({ luminosity: "dark" })).current;

  let channel = useRef(client.createChannel(channelName)).current;

  const initRm = async () => {
    await client.login({
      uid: USER_ID.toString(),
    });

    client.on("ConnectionStateChanged", (state, reason) => {
      setJoinedState(state + " " + reason);
    });

    await channel
      .getMembers()
      .then((res) => {
        setMembers(res);
      })
      .catch((err) => console.log(err));

    if (!members.includes(USER_ID.toString())) {
      channel
        .join()
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }

    await client.setLocalUserAttributes({
      name: USER_ID.toString(),
      color,
    });
  };

  useEffect(() => {
    initRm();
    console.log("uid is", client.uid);
  }, []);

  useEffect(() => {
    channel.on("ChannelMessage", (data, uid) => {
      handleMessageReceived(data, uid);
    });
  }, []);

  useEffect(() => {
    users &&
      client
        .queryPeersOnlineStatus(users.map((item) => item.nickname))
        .then((res) => setOnlineStatus(res))
        .catch((err) => setOnlineStatus(JSON.stringify(users)));
  }, [users, client]);

  // (  useEffect(() => {
  // //   channel.on("query", (data, uid) => {
  // //     handleMessageReceived(data, uid);
  // //   });
  // // }, []);

  async function leave() {
    setRemoteUsersChat([]);
    setJoinedState(false);
    await client.leave();
  }

  useEffect(() => {
    if (!client) return;
    setRemoteUsersChat(client.getChannelMemberCount(["Just-US"]));

    // toggle rerender while state of remoteUsers changed.

    const handleUserJoined = (user) => {
      setRemoteUsersChat((remoteUsers) =>
        Array.from(client.getChannelMemberCount(["Just-US"]))
      );
    };

    const handleUserLeft = (user) => {
      setRemoteUsersChat((remoteUsers) =>
        Array.from(client.getChannelMemberCount(["Just-US"]))
      );
    };

    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);

    return () => {
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
    };
  }, [client]);
  // channel.on('MemberJoined', function (memberId) {

  //     document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")

  // })
  // // Display channel member stats
  // channel.on('MemberLeft', function (memberId) {

  //     document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel")

  // })

  async function handleMessageReceived(data, uid) {
    let user = await client.getUserAttributes(uid);

    console.log("message received", data);

    if (data.messageType === "TEXT") {
      let newMessageData = { user, message: data.text };
      setCurrentMessage(newMessageData);
    }
  }

  async function sendChannelMessage(text) {
    channel
      .sendMessage({ text })
      .then(() => {
        setCurrentMessage({
          user: { name: USER_ID, color },
          message: text,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (currentMessage) setMessages([...messages, currentMessage]);
  }, [currentMessage]);

  return {
    sendChannelMessage,
    messages,
    onlineStatus,
    joinedState,
    remoteUsersChat,
    users,
  };
}

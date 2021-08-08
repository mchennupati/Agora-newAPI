import React, { useEffect, useState, useRef } from "react";
import makeid from "../helpers/makeid";
import { useAuth0 } from "@auth0/auth0-react";

import AgoraRTM from "agora-rtm-sdk";

import randomColor from "randomcolor";

export default function useAgoraChat(client, channelName) {
  let { user } = useAuth0();
  let USER_ID = user.nickname;

  const [joinState, setJoinState] = useState(false);

  let [messages, setMessages] = useState([]);
  let [members, setMembers] = useState([]);

  let [currentMessage, setCurrentMessage] = useState();

  let color = useRef(randomColor({ luminosity: "dark" })).current;
  let channel = useRef(client.createChannel(channelName)).current;

  const initRm = async () => {
    await client.login({
      uid: USER_ID.toString()
    });

    channel
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
      color
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
          message: text
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (currentMessage) setMessages([...messages, currentMessage]);
  }, [currentMessage]);

  return { sendChannelMessage, messages, members };
}

import React, { useEffect, useState, useRef } from "react";

import randomColor from "randomcolor";

let USER_ID = Math.floor(Math.random() * 100000001);

export default function useAgoraChat(client) {
  let [messages, setMessages] = useState([]);

  let [currentMessage, setCurrentMessage] = useState();

  let channel = useRef(client.createChannel("channelId")).current;

  let color = useRef(randomColor({ luminosity: "dark" })).current;

  const initRm = async () => {
    await client.login({
      uid: USER_ID.toString()
    });

    await channel.join();

    await client.setLocalUserAttributes({
      name: USER_ID.toString(),
      color
    });
  };

  useEffect(() => {
    initRm();
  }, []);

  useEffect(() => {
    channel.on("ChannelMessage", (data, uid) => {
      handleMessageReceived(data, uid);
    });
  });

  async function handleMessageReceived(data, uid) {
    let user = await client.getUserAttributes(uid);

    console.log(data);
    if (data.messageType === "TEXT") {
      let newMessageData = { user, messsage: data.text };
      setCurrentMessage(newMessageData);
    }
  }

  async function sendChannelMessage(text) {
    channel
      .sendMessage({ text })
      .then(() => {
        setCurrentMessage({
          user: { name: "Current User (Me)", color },
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

  return { messages, sendChannelMessage };
}

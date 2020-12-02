import React, { useRef, useEffect } from "react";

const MediaPlayer = (props) => {
  const container = useRef();

  let videoTrack = props.videoTrack;
  let audioTrack = props.audioTrack;

  useEffect(() => {
    if (!container.current) return;

    videoTrack.play(container.current);

    return () => {
      videoTrack.stop();
    };
  }, [container, videoTrack]);

  // useEffect(() => {
  //   audioTrack.play();
  //   return () => {
  //     audioTrack.stop();
  //   };
  // }, [audioTrack]);

  return (
    <div
      ref={container}
      className="video-player"
      style={{ width: "320px", height: "240px" }}
    ></div>
  );
};

export default MediaPlayer;

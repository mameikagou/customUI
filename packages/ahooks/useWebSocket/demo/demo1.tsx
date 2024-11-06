import React, { useRef, useMemo } from "react";
import { useWebSocket } from "ahooks";

enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

const ReadyText = {
  0: "Connecting",
  1: "Open",
  2: "Closing",
  3: "Closed",
};

export default () => {
  const messageHistory = useRef<any[]>([]);

  const { readyState, sendMessage, latestMessage, disconnect, connect } =
    useWebSocket("ws://localhost:8091/echo", {
      onMessage: (e) => {
        console.log("onMessage", e);
      },
      onError: (e) => {
        console.log("onError", e);
      },
      onClose: (e) => {
        console.log("onClose", e);
      },
      onOpen: (e) => {
        console.log("onOpen", e);
      },
    });

  messageHistory.current = useMemo(
    () => messageHistory.current.concat(latestMessage),
    [latestMessage]
  );
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return (
    <div>
      {/* send message */}
      <button
        onClick={() =>
          sendMessage && sendMessage(`${year}${month}${day}:${hours}:${minutes}:${seconds}`)
        }
        disabled={readyState !== ReadyState.Open}
        style={{ marginRight: 8 }}
      >
        ✉️ send
      </button>
      {/* disconnect */}
      <button
        onClick={() => disconnect && disconnect()}
        disabled={readyState !== ReadyState.Open}
        style={{ marginRight: 8 }}
      >
        ❌ disconnect
      </button>
      {/* connect */}
      <button
        onClick={() => connect && connect()}
        disabled={readyState === ReadyState.Open}
      >
        {readyState === ReadyState.Connecting ? "connecting" : "📞 connect"}
      </button>
      <div style={{ marginTop: 8 }}>
        readyStateText: {ReadyText[readyState]}
      </div>
      <div style={{ marginTop: 8 }}>
        <p>received message: </p>
        {messageHistory.current.map((message, index) => (
          <p key={index} style={{ wordWrap: "break-word" }}>
            {message?.data}
          </p>
        ))}
      </div>
    </div>
  );
};

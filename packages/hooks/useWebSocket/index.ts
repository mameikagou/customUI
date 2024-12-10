import { useLatest } from "ahooks";
import { useEffect, useRef, useState } from "react";

// 此处定义参阅MDN文档: https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/readyState
export enum ReadyState { // 定义状态
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export interface Options {
  reconnectLimit?: number;
  reconnectInterval?: number;
  manual?: boolean;
  onOpen?: (event: WebSocketEventMap["open"], instance: WebSocket) => void;
  onClose?: (event: WebSocketEventMap["close"], instance: WebSocket) => void;
  onError?: (event: WebSocketEventMap["error"], instance: WebSocket) => void;
  onMessage?: (
    event: WebSocketEventMap["message"],
    instance: WebSocket
  ) => void;
  protocols?: string | string[];
}
export default function useWebSocket(socketUrl: string, options: Options = {}) {
  const {
    reconnectLimit = 3,
    reconnectInterval = 3000,
    protocols,
    onClose,
    onMessage,
    onError,
    onOpen,
    manual = false,
  } = options;

  //   open, message, error, close, 重新封装这些对象;
  const onCloseRef = useLatest(onClose);
  const onMessageRef = useLatest(onMessage);
  const onErrorRef = useLatest(onError);
  const onOpenRef = useLatest(onOpen);

  //   存储当前的WebSocket实例
  const websocketRef = useRef<WebSocket>();
  //   重连次数
  const reconnectTimesRef = useRef(0);
  //   存储setTimeout的定时器对象
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [readyState, setReadyState] = useState<ReadyState>(
    ReadyState.Connecting
  );
  const [lastMessage, setLastMessage] =
    useState<WebSocketEventMap["message"]>();

  const reconnect = () => {
    //
    if (reconnectTimesRef.current < reconnectLimit) {
      // 清除定时器
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      reconnectTimerRef.current = setTimeout(() => {
        connectWs();
        // 通过全局对象来储存重连次数
        reconnectTimesRef.current++;
      }, reconnectInterval);
    }
  };

  //   重写并且封装connectWs方法
  const connectWs = () => {
    // 为什么要清除?
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    // 为什么要关?
    if (websocketRef.current) {
      //  close(code?: number, reason?: string): void
      // code (number): 一个表示关闭连接的状态码。这个状态码可以用来指示关闭的原因。常见的状态码包括：
      // 1000 表示正常关闭。
      // 1001 表示终端离开。
      // 1006 表示连接异常关闭。
      // reason (string): 一个可选的字符串，提供关闭连接的详细原因。
      websocketRef.current.close();
    }
    const ws = new WebSocket(socketUrl, protocols);
    setReadyState(ReadyState.Connecting);

    // 重新封装error
    ws.onerror = (event: Event) => {
      if (websocketRef.current !== ws) {
        return;
      }
      reconnect();
      //   通过ref存值
      onErrorRef.current?.(event as WebSocketEventMap["error"], ws);
      setReadyState(ws.readyState || ReadyState.Closed);
    };

    ws.onopen = (event: Event) => {
      if (websocketRef.current !== ws) {
        return;
      }
      onOpenRef.current?.(event as WebSocketEventMap["open"], ws);
      reconnectTimesRef.current = 0;
      setReadyState(ws.readyState || ReadyState.Closed);
    };

    ws.onmessage = (event) => {
      if (websocketRef.current !== ws) {
        return;
      }
      onMessageRef.current?.(event as WebSocketEventMap["message"], ws);
      setLastMessage(event as WebSocketEventMap["message"]);
    };

    ws.onclose = (event) => {
      onCloseRef.current?.(event as WebSocketEventMap["close"], ws);
      //   close by server
      if (websocketRef.current === ws) {
        reconnect();
      }
      //   close by disconnect or close by server
      if (!websocketRef.current || websocketRef.current === ws) {
        setReadyState(ws.readyState || ReadyState.Closed);
      }
    };
    websocketRef.current = ws;
  };

  const sendMessage: WebSocket["send"] = (message) => {
    if (readyState === ReadyState.Open) {
      websocketRef.current?.send(message);
    } else {
      throw new Error("WebSocket disconnected");
    }
  };

  const connect = () => {
    reconnectTimesRef.current = 0;
    connectWs();
  };

  const disconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    // 置于最大值
    reconnectTimesRef.current = reconnectLimit;
    websocketRef.current?.close();
    websocketRef.current = undefined;
  };

  useEffect(() => {
    // manual为undefined或者null, socket非空即可
    if (!manual && socketUrl) {
      connect();
    }
  }, [socketUrl, manual]);

  //   另一个钩子
  //   useUnmount(() => {
  //     disconnect();
  //   });

  return {
    sendMessage,
    lastMessage,
    readyState,
    disconnect,
    connect,
    webSocketIns: websocketRef.current,
  };
}

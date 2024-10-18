import { useRef } from "react";

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export interface Options {
  reconnectLimit?: number;
  reconnectInterval?: number;
  protocols?: string | string[];
}
export default function useWebSocket(socketUrl: string, options: Options = {}) {
  const { reconnectLimit = 3, reconnectInterval = 3000, protocols } = options;

  //   存储当前的WebSocket实例
  const webSocketRef = useRef<WebSocket>();
  //   重连次数
  const reconnectTimesRef = useRef(0);
  //   存储setTimeout的定时器对象
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();

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

  const connectWs = () => {
    // 为什么要清除?
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    // 为什么要关?
    if (webSocketRef.current) {
      //  close(code?: number, reason?: string): void
      // code (number): 一个表示关闭连接的状态码。这个状态码可以用来指示关闭的原因。常见的状态码包括：
      // 1000 表示正常关闭。
      // 1001 表示终端离开。
      // 1006 表示连接异常关闭。
      // reason (string): 一个可选的字符串，提供关闭连接的详细原因。
      webSocketRef.current.close();
    }
    const ws = new WebSocket(socketUrl, protocols);

    ws.onerror = (event: Event) => {
      if (webSocketRef.current !== ws) {
        return;
      }
      reconnect();
    };
  };
}

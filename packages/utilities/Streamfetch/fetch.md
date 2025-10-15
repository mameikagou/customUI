

#### 原生Fetch api

fetch api有一个特点，即使服务器返回了错误的状态码（401 未授权, 404 未找到, 500 服务器内部错误），fetch 的 Promise 仍然会成功 resolve，只有网络层面的（DNS失败，网络断开），才会reject。

在这种情况下，即使通过await fetch(...) ，拿到了 response，也未必是一个我们想要的连接，所以onopen的作用就是通过“钩子”，可以获取到response的值，区分401 404 500等等错误码

```js
fetchEventSource('/my-stream', {
  onopen: async (response) => {
    if (!response.ok) { // response.ok 是 status 在 200-299 范围内的简写
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }
  },
  onmessage: (ev) => { /* ... */ }
});
```
##### 特殊情况处理1

```js
    const value = line.slice(colonIndex + (line[colonIndex + 1] === ' ' ? 2 : 1));
```
假设我们从服务器收到了这样一行数据： data: {"id": 1, "msg": "hello"}
line就是这个字符串，就是data后面的空格是可选的，应该跳过，所以有个2。

##### 特殊情况处理2

```md
data: Roses are red
data: Violets are blue
data: Sugar is sweet
data: And so are you
```

#### 依赖倒置原则
高层模块不应该依赖于底层模块，应该依赖于“抽象层”，底层则需要把“复杂的底层麻烦东西”适配到这个“抽象层”上面。

比如这里getLine只负责把数据流抽象成“line”，然后message去读这个line就行了。
```js
// 高层模块
export async function* getMessages(lines: AsyncIterable<string>) { 
    // ...只负责解析字符串...
}

// 低层模块
export async function* getLines(stream: ReadableStream<Uint8Array>) {
    // ...负责把二进制流变成字符串流...
}
```

#### SSE协议
基于文本的，每个事件由key：value格式的行组成，并且以两个\n\n作为结尾。

常见的有
- data: 事件负载的数据。
- event：默认为message。
- id: 事件唯一id。
- retry: 指示客户端在断线后应该等待多少毫秒再尝试重连。


#### 追问？
- 你为什么选择自己封装一个 fetch 来实现 SSE？
    - 自定义请求头，方便鉴权
    - 无法处理非200状态码
    - 只能get，不能post
- 既然提到了复杂度和项目，那你这个项目（或者说你封装的这个工具）的体量和复杂度体现在哪里？它的难点和亮点是什么？
    - 断线重连与消息幂等 ：最大的难点在于处理网络不稳定的情况。我们需要实现一个健壮的自动重连机制。当重连时，利用 SSE 的 id 字段（通过请求头 Last-Event-ID 发送给后端），后端可以补发所有丢失的消息，确保消息的最终一致性。这就要求前后端协同设计。
    - 优雅降级 ：在一些不支持流式请求的旧版浏览器或网络代理环境下，这个实现需要能自动降级为长轮询（long-polling）模式，保证基础功能可用。
    - 资源管理 ：在单页应用（SPA）中，路由切换时必须正确地中止（abort）上一个页面的 SSE 连接，否则会造成大量的连接泄露和资源浪费。我通过 AbortController 和在组件卸载生命周期中调用 abort 来解决这个问题。
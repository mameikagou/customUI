
export interface EventSourceMessage {
    id: string;
    event: string;
    data: string;
    retry?: number;
}

// 二进制格式，uint8Array类型
// 只关注字节流 -> line
export async function* getLines(stream: ReadableStream<Uint8Array>) {

    // ReadableStream 接口的 getReader() 方法会创建一个 reader，并将流锁定。只有当前 reader 将流释放后，其他 reader 才能使用。
    const reader = stream.getReader(); // 获取流的读取器
    const decoder = new TextDecoder();         // 创建一个解码器，将二进制数据转为文本
    let lineBuffer = '';  // 缓冲区，用于拼接数据块

    while (true) {
        // 返回一个Promise，Value是uint8Array二进制数据块
        // done表示数据是否已经结束
        // 接口的 read() 方法返回一个 Promise，这个 promise 提供流的内部队列中下一个分块（以供访问）。
        const { value, done } = await reader.read();
        if (done) {
            if (lineBuffer.length > 0) {
                yield lineBuffer;
            }
            break;
        }
        const chunk = decoder.decode(value);
        lineBuffer += chunk;

        let eolIndex: number; // end of Line

        while ((eolIndex = lineBuffer.indexOf('\n')) >= 0) {
            // 截取到第一个换行符
            const line = lineBuffer.slice(0, eolIndex);
            // 删除掉被截取的内容
            lineBuffer = lineBuffer.slice(eolIndex + 1); // 这里的+1，就是为了消掉一个\n，剩下一个\n；
            // 以便在下一次循环中通过lineBuffer.indexOf('\n')再消掉一个\n, 就变成了空字符串，方便后续通过if (line === "") 判断
            // 从这里开始就获取到了完整的一行
            yield line; // 暂停函数的执行，请求下一个值的时候会继续执行
        }
    }
}

// 只关注line -> 消息流
// 为啥是AsyncIterable异步迭代器？有什么特点？
// 就是返回Promise可迭代对象。
export async function* getMessages(lines: AsyncIterable<string>) {
    let currentMessage: Partial<EventSourceMessage> = {};

    // 消费异步迭代器的标准语法。
    for await (const line of lines) {
        if (line === "") { // 识别 “\n\n” - 分块符号
            // 这里写的很巧妙，如果是\n\n的话，那么经过getLines处理，就会剩下一个\n
            // 然后再次运行循环，就会变成空行。就是在这里识别\n\n的。
            // 
            if (Object.keys(currentMessage).length > 0) {
                yield {
                    id: currentMessage.id || '', // id
                    event: currentMessage.event || 'message', //事件类型
                    data: currentMessage.data || '',
                    retry: currentMessage.retry,
                } as EventSourceMessage;
                currentMessage = {};
            } else if (line.startsWith(':')) {
                // SSE中，每一行都是field: value，冒号索引。
            } else {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const field = line.slice(0, colonIndex);
                    // 处理data: {"id": 1, "msg": "hello"}，中data后面的空格, 要一起跳过;
                    const value = line.slice(colonIndex + (line[colonIndex + 1] === ' ' ? 2 : 1));

                    switch (field) {
                        case 'id':
                            currentMessage.id = value;
                            break;
                        case 'event':
                            currentMessage.event = value;
                            break;
                        case 'data':
                            // 每一行后面都添加一个换行符。
                            currentMessage.data = (currentMessage.data ? currentMessage.data + '\n' : '') + value;
                            break;
                        case 'retry':
                            const retryValue = parseInt(value, 10);
                            if (!isNaN(retryValue)) {
                                currentMessage.retry = retryValue;
                            }
                            break;
                    }

                }
            }
        }
    }
}
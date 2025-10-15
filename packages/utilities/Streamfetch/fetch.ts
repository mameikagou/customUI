import { EventSourceMessage, getLines, getMessages } from "./parse";

interface FetchEventSourceInit extends RequestInit{

    headers?: Record<string, string>,
    onopen?: (response: Response) => Promise<void>,
    onmessage?: (ev: EventSourceMessage) => void,
    onclose?: () => void;
    onerror?: (err: any) => number | null | undefined | void,
    // 默认是window.fetch
    fetch?: typeof fetch;
}


export function fetchEventSource(input: RequestInfo ,{
    signal: inputSignal,
    headers: inputHeaders,
    onopen: inputOnOpen,
    fetch: inputFetch,
    onclose,
    onmessage,
    ...rest
}: FetchEventSourceInit){
    return new Promise<void>((resolve, reject) => {
        
        // 复制一份
        const headers = { ...inputHeaders };
        // 如果它看到了 text/event-stream ，它就知道应该建立一个长连接，
        // 并开始以 data: ...\n\n 的格式持续不断地发送事件。
        // 如果没有这个头，可能降级成json，或者直接406 Not Acceptable
        if (!headers.accept) {
            headers.accept = 'text/event-stream';
        }

        const fetch = inputFetch ?? window.fetch;

        async function create() {
            // 控制器，用来暂停。
            const ctrl = new AbortController();
            try{
                const response = await fetch(input, {
                    ...rest,
                    headers,
                    signal:ctrl.signal
                })

                const contentType = response.headers.get('content-type');
                if(!contentType?.startsWith('text/event-stream')){
                    throw new Error(`Expected content-type to be text/event-stream, Actual: ${contentType}`);
                }

                // 方便用户处理401、403等等http错误
                await inputOnOpen?.(response);

                const messageStream = getMessages(getLines(response.body!))
                
                for await(const message of messageStream){
                    onmessage?.(message);
                }
                onclose?.();
                resolve();
            }catch(err){
                reject(err);
            }
        }

        create();
    })
}
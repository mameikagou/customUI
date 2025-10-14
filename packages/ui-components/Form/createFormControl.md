

#### register

精妙的ref设计：

```js
<input {...register('firstName')} />

// 展开后是这样：于是就把这个ref元素存到闭包里面去了。
// 那么问题来了，这个callback是什么时机触发的呢？
// 
<input name="username" ref={(element) => {
    if (element) {
        _fields['username'].ref = element; // 'username' 是闭包中的 name
    }
}} />

const register = (name: string) => {
    if (!_fields[name]) {
        _fields[name] = { ref: null };
    }

    return {
        name, // HTML 原生的 name 属性
        // 直接通过ref获取dom节点，绕过react渲染流程。
        ref: (element: HTMLInputElement | null) => {
            
            if (element) {
                _fields[name].ref = element;
            }
        }
    }
}
```
import React from "react";

type FieldValues = Record<string, any>;
// 存储每个dom引用的ref
type FieldRefs = Record<string, {ref:any}>

// 所有的数据都在这个闭包里面，然后通过对外暴露的方法去实现更改。
// 所有表单相关的数据都放在这里面。
// 与框架无关。

const createSubject = () => {
    const subscribers = new Set<(value: any)=>void>();
    // 订阅
    const subscribe=(callback:any):()=>void=>{
        subscribers.add(callback);
        return () => subscribers.delete(callback);
    }
    // 发布
    const next=(value: any)=>{
        subscribers.forEach(callback => {
            return callback(value);
        });
    }
    return {
        subscribe,
        next
    }
}

export function createFormControl() {
    const _fields: FieldRefs = {};

    const _formValues: FieldValues = {};

    // 存放表单的元数据状态 (是否被修改过、是否有效等)
    const _formState = {
        isDirty: false,
        // ... 其他状态，我们后面再加
    };

    const _subjects = {
        state:createSubject(),
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = event.target; // 获取<input> 元素的真实dom节点
        _formValues[name] = value;
    }

    // 注册函数
    const register = (name: string) => {
        if (!_fields[name]) {
            _fields[name] = { ref: null };
        }

        return {
            name, // HTML 原生的 name 属性
            // 直接通过ref获取dom节点，"绕过" react 渲染流程（指的是协调阶段）。
            // React 会在它的生命周期里面自动调用 ref 函数
            // （提交阶段，会在生命周期里面挂载的时候自动调用，卸载的时候自动卸载）
            ref: (element: HTMLInputElement | null) => {
                
                if (element) {
                    // 这里存储完之后，可以直接调用实例的方法：
                    // _fields.firstName.ref.value
                    // _fields.firstName.ref.focus()
                    _fields[name].ref = element;
                }
            },
            onChange, // 把change事件的值存入到闭包中。
        }
    }

    // 最终暴露出去的API
    const control = {
        register,
    }

    return control;
}
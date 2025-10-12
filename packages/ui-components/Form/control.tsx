import React, {Component} from "react";

export default class Control extends Component{
    // 控制受控和非受控模式
    // 具体的操作就是，通过Context结合React.cloneElement来把props中的value和onChange传递给子组件，依次来实现受控。

    // 当FromItem包裹Input标签的时候，就会渲染这个Control组件。
    
    context: any;

    private isDestroyed = false;

    componentDidMount() {
        const { store } = this.context;
        if(store){
            // TODO：注册到store中, 具体内容后续再实现

        }
        this.isDestroyed = false;
    }

    renderControl(children: React.ReactNode, id){
        // 渲染受控模式

        const {
            triggerPropName = 'value'
        } = this.props;

        const childProps:any = {
            id: id
        }

        // 从中央store获取值
        const {store} = this.context

        const child = React.Children.only(children) as ReactElement;

        // TODO：处理关于值的其他情况其他情况。
        let _value = store.getValue(this.props.name);

        // 构造Props
        childProps[triggerPropName] = _value;

        return React.cloneElement(child, childProps)
    }
}
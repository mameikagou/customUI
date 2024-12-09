import {ChangeEvent, CSSProperties, HTMLAttributes, ReactNode} from "react";

/**
 * @title radio
 * 为了重写这些属性，在这里排除了
 */

export interface RadioProps<T = any>
  extends Omit<
    HTMLAttributes<HTMLLabelElement>,
    "children" | "onChange" | "className"
  > {
  style?: CSSProperties;
  className?: string | string[];
  /**
   * @zh 是否禁用
   */
  disabled?: boolean;
  value?: T;
  checked: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: ChangeEvent) => void;
  // 这里的好处是，可以让子组件接受一个checked值，来自定义组件渲染内容；
  children?: ReactNode | ((value: {checked: boolean}) => ReactNode);
}
export interface RadioGroupProps {
  name?: string;
}

export interface RadioGroupContextProps {
  type: "radio" | "button";
  value?: any;
  disabled?: boolean;
  group?: boolean;
  name?: RadioGroupProps["name"];
  onChangeValue?: (value: any, event: ChangeEvent) => void;
}

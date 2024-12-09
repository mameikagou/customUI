
import { createContext, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useContext } from "react";
import useMergedValue from "../utils/hooks/useMergedValue";
import useMergeProps from "../utils/hooks/useMergeProps";
import { isFunction,isNullOrUndefined } from "../utils/is";
import {RadioGroupContextProps, RadioProps} from "./interface";

const defaultContextValue: RadioGroupContextProps = {
  type: 'radio',
};

export const RadioGroupContext = createContext<RadioGroupContextProps>(defaultContextValue);

function Radio(baseProps: RadioProps) {
  const props = useMergeProps<RadioProps>(baseProps, {}, {});

  const context = useContext(RadioGroupContext);
  const mergeProps = {...props}
  const [checked, setChecked] = useMergedValue<boolean>(false, {
    value: baseProps.checked,
    defaultValue: baseProps.defaultChecked,
  });

  const { disabled, children, value, style, className, ...rest } = mergeProps;

  return (
    <label>
      <input
        type="radio"
        checked={checked}
        onClick={(e) => {
          e.stopPropagation(); // 阻止事件冒泡
        }}
      />
      {
        isFunction(children) ? (
          children({checked})
        ):(context.type === 'radio'?(<>
        {/* TODO: Icon Hover */}
        {!isNullOrUndefined(children)&&<span>{children}</span>}
        </>):(
          context.type === 'button' && <span>{children}</span>
        ))
      }
    </label>
  );
}

export default Radio;

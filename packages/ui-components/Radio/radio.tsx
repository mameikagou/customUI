import useMergedValue from "../utils/hooks/useMergedValue";
import {RadioProps} from "./interface";

function Radio(baseProps: RadioProps) {
  const [checked, setChecked] = useMergedValue<boolean>(false, {
    value: baseProps.checked,
    defaultValue: baseProps.defaultChecked,
  });
  return (
    <label>
      <input
        type="radio"
        checked={checked}
        onClick={(e) => {
          e.stopPropagation(); // 阻止事件冒泡
        }}
      />
    </label>
  );
}

export default Radio;

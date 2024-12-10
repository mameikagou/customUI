import "./index.css";

import XflowMain from "@/ui-components/Xflow";
import AnimateTest from "@/animate/test";
import WebSocketDemo from "@/hooks/useWebSocket/demo/demo1";
import Radio from "@/ui-components/Radio/radio";
function App() {
  return (
    <>
      {/* <XflowMain />
      <AnimateTest /> */}
      <div className="h-[80vh] flex justify-center items-center">
        {/* <WebSocketDemo /> */}
        <Radio />
      </div>
    </>
  );
}

export default App;

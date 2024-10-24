import "animate.css";
import "@/animate/source/bouncing_exits/bounceOut.css"

const App = () => {
  return (
    <>
      <div className="animate__animated animate__bounce animate__faster">
        Fast bouncing element
      </div>
      <div className="animate__animated animate__bounce animate__infinite">
        Fast bouncing element infinite
      </div>
      <div className="animate__animated animate__fadeIn animate__delay-1s">
        Delayed fade-in element
      </div>
      <div className="animate__animated bounceOut animate__delay-1s animate__infinite">
        Element with bounceOut animation
      </div>
    </>
  );
};

export default App;
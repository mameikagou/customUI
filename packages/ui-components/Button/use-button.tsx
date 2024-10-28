
// // 好像依赖了react-aria
// export function useButton(){

// }
import React, { useState, useRef } from "react";
import './Button.css'; 
import { useNavigate } from 'react-router-dom';
const useButton = ({ 
  children, 
  onClick, 
  className = '', 
  type = 'button', 
  disabled = false, 
  rounded = 'lg',
  size = 'm',
  to = '#',
  color = 'default',
  textcolor='default',
  ...props 
}
) => {
  const buttonRef = useRef(null);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const handleClic = (e) => {
    if (to)
      navigate(to);
    if (onClick) 
      onClick(e);
    setClicked(true);
    setTimeout(() => setClicked(false), 300); 
  };
    const handleClick = (e) => {
        const x = e.clientX - e.target.offsetLeft;
        const y = e.clientY - e.target.offsetTop;
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        buttonRef.current.appendChild(ripple);
        handleClic(e)
        const rippleDuration = 1000; 
        setTimeout(() => {
          ripple.remove();
        }, rippleDuration);
    };
  return (
    <button ref={buttonRef} className={`ripple-button 
        ${clicked ? 'clicked' : ''} 
        rounded-${rounded}
        ${size === 's' ? 'py-1 px-2':size==='m'?'py-2 px-4':size==='l'?'py-4 px-8':''}
        ${color === 'default' ? 'bg-gray-300' : color === 'primary' ? 'bg-sky-500' : color === 'success' ? 'bg-green-400' : color === 'danger' ? 'bg-red-500' : color === 'warning' ? 'bg-amber-500' : '' }
        ${color === 'default' ? ' text-black' : color === 'styleone' ? ' text-white' : color === 'styletwo' ? ' text-green-400' : color === 'stylethree' ? ' text-red-400' : color === 'stylefour' ? ' text-sky-400' : '' }
        `
      }
        onClick={handleClick}
        {...props}>
      {children}
    </button>
  );
};

export default useButton;
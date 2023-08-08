import { useContext } from "react";
import { ThemeContext } from "../Auth";

const LoadingAnimation = ({minWidth, maxWidth, minHeight, maxHeight}) => {
  const {theme} = useContext(ThemeContext)

  const dotAnimation = {
    animation: 'dot-animation 1.4s infinite',
  };

  const dot2Animation = {
    animationDelay: '0.2s',
  };

  const dot3Animation = {
    animationDelay: '0.4s',
  };

  return (
    <div style={{ display: 'flex', minHeight:minHeight, minWidth:minWidth,
     maxHeight:maxHeight, maxWidth:maxWidth, overflow:'auto', justifyContent:'center', placeItems:'center'}}>
      <style>
        {`
          @keyframes dot-animation {
            0% {
              opacity: 0.2;
            }
            20% {
              opacity: 1;
            }
            100% {
              opacity: 0.2;
            }
          }
        `}
      </style>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color:theme == 'light' ? '#353535' : '#e8e5e5' }}>
        Loading
        <span style={{ ...dotAnimation, ...dot2Animation }}>.</span>
        <span style={{ ...dotAnimation, ...dot3Animation }}>.</span>
        <span style={dotAnimation}>.</span>
      </div>
    </div>
  );
};

export default LoadingAnimation;

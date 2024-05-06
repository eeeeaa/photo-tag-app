import { useState } from "react";

const useMousePosition = () => {
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [localCoords, setLocalCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event, cb = null) => {
    // 👇️ Get the mouse position relative to the element
    const rect = event.target.getBoundingClientRect();
    let local = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    let global = {
      x: event.clientX,
      y: event.clientY,
    };
    setLocalCoords({
      x: local.x,
      y: local.y,
    });
    // Get global mouse position
    setGlobalCoords({
      x: global.x,
      y: global.y,
    });
    cb(local, global);
  };

  return { globalCoords, localCoords, handleMouseMove };
};
export default useMousePosition;

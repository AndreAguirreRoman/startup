import React, {useEffect, useRef} from "react"

const Dots = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
  
      // Set canvas dimensions
      canvas.width = 200;
      canvas.height = 200;
  
      // Background
  
      // White outer ring
      ctx.beginPath();
      ctx.arc(50, 50, 25, 0, Math.PI * 2); // x, y, radius
      ctx.fillStyle = "#FFFFFF"; // White
      ctx.fill();
  
      // Red center
      ctx.beginPath();
      ctx.arc(50, 50, 12.5, 0, Math.PI * 2); // Smaller radius
      ctx.fillStyle = "#FF0000"; // Red
      ctx.fill();
    }, []);
  
    return (
      <canvas
        ref={canvasRef}
        style={{
          margin: "0 auto",
        }}
      ></canvas>
    );
  };

  export default Dots;
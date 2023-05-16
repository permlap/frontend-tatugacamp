import React from "react";
import { useSpring, animated } from "react-spring";
function NumberAnimated({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, frequency: 10, duration: 3000 },
  });
  return (
    <animated.div>
      {number.to((n) => Number(n.toFixed(0)).toLocaleString())}
    </animated.div>
  );
}

export default NumberAnimated;

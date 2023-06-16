import React, { useEffect, useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import Image from "next/image";

const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

function Deck({ students }) {
  const [gone] = useState(() => new Set()); // The set flags all the students that are flicked out
  const [outCard, setOutCard] = useState();
  const [activeCard, setActiveCard] = useState();
  const [props, api] = useSprings(students.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) {
        setOutCard((prev) => {
          return {
            ...prev,
            [`index${index}`]: index,
          };
        });
        gone.add(index);
      } // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active students lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
      if (!down && gone.size === students.length)
        setTimeout(() => {
          gone.clear();
          api.start((i) => to(i));
        }, 600);
    }
  );

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <div className="flex items-center justify-center ">
      {props.map(({ x, y, rot, scale }, i) => {
        return (
          <animated.button className="deck" key={i} style={{ x, y }}>
            {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
            <animated.div
              {...bind(i)}
              onMouseOver={() => {
                setActiveCard(i);
              }}
              style={{
                transform: interpolate([rot, scale], trans),
              }}
              className={` bg-white
              } flex flex-col justify-center items-center relative`}
            >
              {activeCard === i ? (
                <animated.div
                  style={{
                    transform: interpolate([rot, scale], trans),
                  }}
                  className="w-20 h-20 rounded-full overflow-hidden "
                >
                  <Image
                    src={students[i].picture}
                    layout="fill"
                    className="object-cover"
                  />
                </animated.div>
              ) : (
                <animated.div
                  style={{
                    transform: interpolate([rot, scale], trans),
                  }}
                  className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-6xl text-white overflow-hidden"
                >
                  ?
                </animated.div>
              )}
              <animated.ul
                style={{
                  transform: interpolate([rot, scale], trans),
                }}
                className="font-Kanit  text-black 
                 flex flex-col justify-center  text-center pl-0  items-center"
              >
                <span>
                  {activeCard === i ? ` เลขที่ ${students[i].number}` : "****"}
                </span>
                <span>
                  {activeCard === i ? students[i].firstName : "******"}
                </span>
                <span>{activeCard === i ? students[i].lastName : "***"}</span>
              </animated.ul>
            </animated.div>
          </animated.button>
        );
      })}
    </div>
  );
}

export default Deck;

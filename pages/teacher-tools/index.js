import React from "react";
import { useState, useEffect } from "react";
import {
  BsFullscreen,
  BsFullscreenExit,
  BsStopCircle,
  BsPlayCircle,
} from "react-icons/bs";
import sound from "../../public/sound/ringing.mp3";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Layout from "../../components/layout";
const Timer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [audio, setAudio] = useState(null);
  const [start, setStart] = useState(false);
  const [counter, setCounter] = useState("wait");
  const handle = useFullScreenHandle();
  const timeChoices = [
    {
      seconds: 10,
      miliseconds: 10000,
    },
    {
      seconds: 30,
      miliseconds: 30000,
    },
    {
      seconds: 45,
      miliseconds: 45000,
    },
    {
      minutes: 1,
      miliseconds: 60000,
    },
    {
      minutes: 1,
      seconds: 30,
      miliseconds: 90000,
    },
    {
      minutes: 2,
      miliseconds: 120000,
    },
  ];
  //prepare sound for the last 3 sec
  useEffect(() => {
    setAudio(new Audio(sound));
  }, []);

  //set miliseconds to seconds and minutes
  const getTime = () => {
    setMinutes(Math.floor((counter / 1000 / 60) % 60));
    setSeconds(Math.floor((counter / 1000) % 60));

    //if time is up play sound
    if (counter === 0) {
      audio.play();
    }
  };

  // reduce every 1 sec
  useEffect(() => {
    if (counter === "wait") {
    } else {
      const timer =
        counter >= 0 &&
        setInterval(() => {
          if (start === true) {
            setCounter((counter) => counter - 1000);
            getTime();
          }
        }, 1000);
      return () => clearInterval(timer);
    }
  }, [counter, start]);

  return (
    <Layout>
      <FullScreen handle={handle}>
        <div className="relative">
          <div className="absolute right-8 top-5">
            {!handle.active && (
              <button
                className="w-max h-max flex group flex-col gap-y-1 items-center justify-center p-0 bg-transparent border-0 cursor-pointer text-white"
                onClick={handle.enter}
              >
                <div className="group-hover:scale-125 transition duration-200 ease-in-out ">
                  <BsFullscreen size={25} />
                </div>

                <span>full screen</span>
              </button>
            )}
            {handle.active && (
              <button
                className="w-max h-max flex group flex-col  gap-y-1 items-center justify-center p-0 bg-transparent border-0 cursor-pointer text-white"
                onClick={handle.exit}
              >
                <div className="group-hover:scale-75 transition duration-200 ease-in-out ">
                  <BsFullscreenExit size={25} />
                </div>
                <span>exit full screen</span>
              </button>
            )}
          </div>
          <div
            className={`w-full h-screen  ${
              seconds < 4 && counter !== "wait" && minutes === 0
                ? `bg-red-700`
                : " bg-blue-400"
            } flex  items-center justify-center font-Inter text-[19rem] font-bold text-white`}
          >
            <div className="flex flex-col justify-center items-center">
              <div className="flex  gap-x-5">
                {minutes > 0 && (
                  <div className="">
                    <div className="flex gap-4">
                      <p id="minute">
                        {minutes < 10 ? "0" + minutes : minutes}
                      </p>
                    </div>
                  </div>
                )}
                {minutes > 0 && <span> : </span>}
                <div className="">
                  <div className="flex gap-4">
                    <p id="second">{seconds < 10 ? "0" + seconds : seconds}</p>
                  </div>
                </div>
              </div>
              <button
                className="w-max p-0 flex items-center justify-center bg-transparent rounded-full text-white m-0  border-0 cursor-pointer"
                onClick={() => setStart((prev) => (prev = !prev))}
              >
                {start === true ? (
                  <BsStopCircle size={30} />
                ) : (
                  <BsPlayCircle size={30} />
                )}
              </button>
            </div>
          </div>
          <div className="w-full bg-transparent flex justify-center items-center gap-x-8 absolute bottom-10 right-0 left-0 text-center mr-auto ml-auto">
            {timeChoices.map((time, index) => {
              return (
                <button
                  key={index}
                  className="border-0 ring-2 hover:scale-125 transition duration-200 ease-out text-white ring-white font-Inter font-extrabold bg-transparent rounded-md p-2 cursor-pointer"
                  onClick={() => {
                    setCounter(time.miliseconds);
                    setStart(true);
                  }}
                >
                  {time.minutes && (
                    <span>
                      {time.minutes} {time.minutes > 1 ? "minutes" : "minute"}
                    </span>
                  )}
                  {time.seconds && <span> {time.seconds} seconds</span>}
                </button>
              );
            })}
          </div>
        </div>
      </FullScreen>
    </Layout>
  );
};

export default Timer;

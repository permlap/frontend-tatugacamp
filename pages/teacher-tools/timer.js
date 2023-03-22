import React from "react";
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  BsFullscreen,
  BsFullscreenExit,
  BsStopCircle,
  BsPlayCircle,
} from "react-icons/bs";
import { VscDebugRestart } from "react-icons/vsc";
import sound from "../../public/sound/ringing.mp3";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Layout from "../../layouts/classroomLayout";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useQuery } from "react-query";
import { GetUser } from "../../service/user";
const Timer = () => {
  const user = useQuery(["user"], () => GetUser());
  const [initalTime, setInitalTime] = useState(0);
  console.log("inital time", initalTime);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutesInput, setMinutesInput] = useState(0);
  const [secondInput, setSecondInput] = useState(0);
  const [audio, setAudio] = useState(null);
  const [start, setStart] = useState(false);
  const [counter, setCounter] = useState("wait");
  const handle = useFullScreenHandle();
  const [classroomId, setClassroomId] = useState();

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
      minutes: 1,
      miliseconds: 60000,
    },

    {
      minutes: 2,
      miliseconds: 120000,
    },
  ];
  //prepare sound for the last 3 sec
  useEffect(() => {
    setAudio(new Audio(sound));
    setClassroomId(localStorage.getItem("classroomId"));
  }, []);

  //set miliseconds to seconds and minutes
  const getTime = () => {
    setMinutes(Math.floor((counter / 1000 / 60) % 60));
    setSeconds(Math.floor((counter / 1000) % 60));

    //if time is up play sound
    if (counter === 0) {
      audio.play();
      setStart(false);
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

  //handle sumit put time
  function handleSumit(event) {
    event.preventDefault();
    setCounter((prev) => {
      const milisecond = secondInput * 1000;
      const miliminute = minutesInput * 60000;
      return (prev = milisecond + miliminute);
    });
    setInitalTime((prev) => {
      const milisecond = secondInput * 1000;
      const miliminute = minutesInput * 60000;
      return (prev = milisecond + miliminute);
    });
    setStart(true);
  }

  const sideMenus = [
    {
      title: "โรงเรียน",
      icon: "🏫",
      url: `/classroom`,
    },
    {
      title: "ห้องเรียน",
      icon: "👨‍🏫",
      url: `/classroom/${classroomId}`,
    },
    {
      title: "timer",
      icon: "⏲️",
      url: `/teacher-tools/timer`,
    },

    {
      title: "Go back",
      icon: <FiArrowLeftCircle />,
      url: `/classroom/${classroomId}`,
    },
  ];
  return (
    <>
      <Head>
        <title>Timer🕛 - เครื่องจับเวลา</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/TaTuga camp.png"
        />
        <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
        <meta name="google" content="notranslate" key="notranslate" />
        <meta
          name="description"
          content="เครื่องจับเวลาสนุกๆ ดีไซน์ทันสมัยที่ TaTuga camp"
        />
        <meta
          name="keywords"
          content="TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ, การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex w-full">
        <Layout sideMenus={sideMenus} user={user} />
        <FullScreen handle={handle} className="w-full">
          <div className=" right-[47%] top-10 absolute ">
            {!handle.active && (
              <button
                className="w-max h-max flex group flex-col gap-y-1 items-center justify-center p-0 bg-transparent border-0 
                cursor-pointer text-white"
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
            } flex  items-center justify-center font-Inter text-[20rem] font-bold text-white`}
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
            </div>
          </div>

          <div className="w-full bg-transparent flex flex-col gap-y-7 justify-center items-center gap-x-8 absolute bottom-40 right-0 left-0 text-center mr-auto ml-auto">
            <div className="flex justify-center items-center gap-x-5">
              <button
                className="w-max p-0 bg flex items-center justify-center bg-transparent rounded-full
                 text-white m-0  border-0 cursor-pointer"
                onClick={() => {
                  setStart((prev) => (prev = !prev));
                }}
              >
                {counter > -1000 ? (
                  <div>
                    {start === true ? (
                      <BsStopCircle size={30} />
                    ) : (
                      <BsPlayCircle size={30} />
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </button>
              <button
                className="w-max p-0 bg flex items-center justify-center bg-transparent rounded-full
                 text-white m-0  border-0 cursor-pointer"
                onClick={() => {
                  setStart(true);
                  setCounter((prev) => (prev = initalTime));
                }}
              >
                <VscDebugRestart size={30} />
              </button>
            </div>
          </div>
        </FullScreen>

        <div className="w-full bg-transparent flex flex-col gap-y-7 justify-center items-center gap-x-8 absolute bottom-10 right-0 left-0 text-center mr-auto ml-auto">
          <div className="text-base font-Kanit text-white">
            <form className="flex gap-x-5 " onSubmit={handleSumit}>
              <label>
                <span className="mr-2">minute :</span>
                <input
                  className="bg-white  appearance-none border-2 border-gray-200 rounded-md w-20 py-2 px-4
                       text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500
                       text-base font-Kanit font-medium"
                  id="inline-full-name"
                  placeholder="minute"
                  type="number"
                  name="minute"
                  value={minutesInput}
                  onChange={(e) => {
                    if (e.target.value > 0 && e.target.value < 60) {
                      const typeNumber = parseFloat(e.target.value);
                      setMinutesInput(typeNumber);
                    } else {
                      setMinutesInput(0);
                    }
                  }}
                />
              </label>
              <label>
                <span className="mr-2">second :</span>
                <input
                  className="bg-white appearance-none border-2 border-gray-200 rounded-md w-20 py-2 px-4
                       text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500
                       text-base font-Kanit font-medium"
                  id="inline-full-name"
                  type="number"
                  name="second"
                  value={secondInput}
                  placeholder="second"
                  onChange={(e) => {
                    if (e.target.value > 0 && e.target.value < 60) {
                      const typeNumber = parseFloat(e.target.value);
                      setSecondInput(typeNumber);
                    } else {
                      setSecondInput(0);
                    }
                  }}
                />
              </label>
              <input
                className="bg-white  border-none hover:ring-4 ring-black border-gray-200 rounded-md w-20 
                       text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500
                       hover:bg-red-900 hover:text-white
                       text-base font-Kanit font-medium cursor-pointer"
                type="submit"
                value="Submit"
              />
            </form>
          </div>
          <div className="flex gap-x-5">
            {timeChoices.map((time, index) => {
              return (
                <button
                  key={index}
                  className="border-0 ring-2 hover:scale-125 transition duration-200 ease-out text-white ring-white font-Inter font-extrabold bg-transparent rounded-md p-2 cursor-pointer"
                  onClick={() => {
                    setCounter(time.miliseconds);
                    setStart(true);
                    setInitalTime(time.miliseconds);
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
      </div>
    </>
  );
};

export default Timer;

import Lottie from "lottie-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiPlusSquare, FiSave, FiSettings } from "react-icons/fi";

import { UpdateScoreOnStudent } from "../../service/scores";
import * as animationData from "../../public/json/well-done-output.json";
import fileSoundPositive from "../../public/sound/ging.mp3";
import fileSoundNagative from "../../public/sound/wrong.mp3";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import { UpdateStudent } from "../../service/students";
function CreateScore({ close, student, scores, students }) {
  const [soundPositive, setSoundPositive] = useState(null);
  const [soundNagative, setSoundNagative] = useState(null);

  const [clickScoreTitle, setClickScoreTitle] = useState();
  const [runScoreTitle, setRunScoreTitle] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [pointsValue, setpointsValue] = useState(1);
  const [data, setData] = useState(animationData);
  const [error, setError] = useState();
  const [triggerSetting, setTriggerSetting] = useState(false);
  const [studentData, setStdentData] = useState({
    firstName: "",
    lastName: "",
    number: "",
  });
  //prepare sound
  useEffect(() => {
    setStdentData((prev) => ({
      ...prev,
      firstName: student.firstName,
      lastName: student.lastName,
      number: student.number,
    }));
    setSoundNagative(new Audio(fileSoundNagative));
    setSoundPositive(new Audio(fileSoundPositive));
  }, []);

  //handle chnage on input score
  const handleChangeScore = (e) => {
    const { id, value } = e.target;
    setpointsValue((prev) => ({ ...prev, [id]: value }));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setStdentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handle sumit to update student data
  const handleSummitEditStudentData = async (e) => {
    e.preventDefault();
    try {
      const updateData = await UpdateStudent({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        number: studentData.number,
        studentId: student.id,
      });
      students.refetch();
      setTriggerSetting((prev) => (prev = false));
    } catch (err) {
      setError((prev) => (prev = err?.props?.response?.data?.message));
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // update student points
  const onClick = async (data) => {
    try {
      let checkNagativePoint = false;
      setClickScoreTitle(() => {
        let points = 1;

        console.log("pointsValue", pointsValue);
        if (!pointsValue[data.scoreId]) {
          points = 1;
        } else if (pointsValue[data.scoreId]) {
          if (pointsValue[data.scoreId] < 0) {
            checkNagativePoint = true;
          }
          points = pointsValue[data.scoreId];
        }

        return (
          <div className="flex items-center justify-center flex-col drop-shadow-2xl">
            <span>{data.scoreTitle}</span>
            <div
              className={`font-bold ${
                checkNagativePoint ? "text-red-500" : "text-yellow-500"
              }  `}
            >
              {checkNagativePoint ? "" : "+"}
              {points}
            </div>
          </div>
        );
      });

      const updateScore = await UpdateScoreOnStudent(data, pointsValue);
      setData((prev) => {
        return {
          ...prev,
          layers: [
            ...prev.layers.slice(0, 8),
            {
              ...prev.layers[8],
              t: {
                ...prev.layers[8].t,
                d: {
                  ...prev.layers[8].t.d,
                  k: [
                    {
                      ...prev.layers[8].t.d.k[0],
                      s: {
                        ...prev.layers[8].t.d.k[0].s,
                        t: "",
                      },
                    },
                    ...prev.layers[8].t.d.k.slice(1),
                  ],
                },
              },
            },
            ...prev.layers.slice(9),
          ],
        };
      });

      setRunAnimation(true);
      setTimeout(() => {
        setRunScoreTitle(true);
      }, 700);
      setTimeout(() => {
        if (checkNagativePoint === true) {
          soundNagative.play();
        } else if (checkNagativePoint === false) {
          soundPositive.play();
        }
      }, 1000);

      setTimeout(() => {
        setRunAnimation(false);
        setRunScoreTitle(false);
      }, 1500);

      students.refetch();
    } catch (err) {}
  };
  const style = {
    height: 300,
  };

  return (
    <div key={student.id}>
      <div
        className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-20 
    top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        {runAnimation && (
          <div className="absolute z-10   top-10 right-0 left-0 bottom-0 m-auto flex items-center justify-center flex-col">
            <Lottie animationData={data} style={style} />
            {runScoreTitle && (
              <div className="top-10 right-0 left-0 bottom-0 m-auto  absolute flex items-center justify-center text-5xl popup">
                {clickScoreTitle}
              </div>
            )}
          </div>
        )}
        <div className=" w-[40rem]  flex flex-col justify-center items-center ">
          <div className="w-full h-max flex items-start justify-center gap-6 overflow-auto ">
            {triggerSetting === false ? (
              <div className="w-40 bg-white h-72  flex items-center justify-end flex-col relative">
                <div
                  className={`absolute w-14 h-14 rounded-full ${
                    student.score.totalPoints < 0
                      ? "bg-red-600"
                      : "bg-[#EDBA02] "
                  } ring-2 ring-white
                    flex justify-center items-center font-sans font-bold text-3xl z-10 text-white right-5 top-5`}
                >
                  {student.score.totalPoints}
                </div>
                <div className="relative w-40 h-40 bg-transparent rounded-full overflow-hidden">
                  <Image
                    src={student.picture}
                    layout="fill"
                    alt="students avatar"
                    className="object-cover scale-150 translate-y-10"
                  />
                </div>

                <div className="mt-2 text-lg">
                  <span className="mr-2">{student.firstName}</span>
                  <span>{student.lastName}</span>
                </div>
                <div className="font-light">เลขที่ {student.number}</div>
                <div
                  role="button"
                  onClick={() => setTriggerSetting((prev) => (prev = true))}
                  aria-label="button for setting student's data"
                  className="w-max h-max bg-slate-500  text-lg cursor-pointer hover:text-red-500 hover:bg-white
                  text-white p-1 rounded-md flex gap-2 px-6 transition duration-150 ease-in-out z-20 group hover:ring-2  bottom-0 ring-black"
                >
                  <span>ตั้งค่า</span>
                  <div className="text-white group-hover:text-red-500 flex items-center justify-center ">
                    <FiSettings />
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSummitEditStudentData}
                className="w-40 bg-white h-72  flex items-center justify-end flex-col relative"
              >
                <div className="flex flex-col relative">
                  <label className="font-sans font-normal">แก้ไขชื่อจริง</label>
                  <input
                    onChange={handleOnChange}
                    className="w-40 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
                    type="text"
                    name="firstName"
                    placeholder="แก้ไขชื่อจริง"
                    maxLength="30"
                    value={studentData.firstName}
                  />
                  <div
                    className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                  >
                    <FcBusinessContact />
                  </div>
                </div>

                <div className="flex flex-col relative mt-2">
                  <label className="font-sans font-normal">แก้ไขนาสกุล</label>
                  <input
                    onChange={handleOnChange}
                    className="w-40 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
                    type="text"
                    name="lastName"
                    placeholder="แก้ไขนาสกุล"
                    maxLength="30"
                    value={studentData.lastName}
                  />
                  <div
                    className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                  >
                    <FcLineChart />
                  </div>
                </div>
                <div className="flex flex-col relative mt-2 mb-2">
                  <label className="font-sans font-normal">แก้ไขเลขที่</label>
                  <input
                    onChange={handleOnChange}
                    className="w-40 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
                    type="number"
                    name="number"
                    placeholder="แก้ไขเลขที่"
                    min="1"
                    value={studentData.number}
                  />
                  <div
                    className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                  >
                    <FcViewDetails />
                  </div>
                </div>
                {error && (
                  <div className="absolute bottom-12 w-max text-red-600">
                    {error}
                  </div>
                )}
                <button
                  aria-label="button for setting student's data"
                  className="w-max h-max bg-red-500 mt-10  text-lg cursor-pointer hover:scale-110 right-2 ring-black border-0 border-none
              text-white p-1 rounded-md flex items-center justify-center gap-2 px-6 transition duration-150 ease-in-out"
                >
                  <span>บันทึก</span>
                  <div className="text-white flex items-center justify-center ">
                    <FiSave />
                  </div>
                </button>
              </form>
            )}
            <div className="">
              <div className="flex items-center justify-center h-5 mt-2 text-lg w-full">
                คะแนนของผู้เรียน
              </div>
              <div
                className="w-96 h-48 flex flex-col items-center gap-3 mt-3 overflow-auto 
              scrollbar justify-start "
              >
                {student.score.title.map((title) => {
                  return (
                    <div
                      key={title.id}
                      className="w-5/6 h-5 py-2 rounded-lg font-Kanit text-md
                    bg-yellow-300 flex items-center justify-between"
                    >
                      <div className="text-md ml-10">{title.title}</div>
                      <div>
                        {student.score.score.map((score) => {
                          if (score.scoreId === title.id) {
                            return (
                              <div
                                key={score.id}
                                className="text-xl font-sans font-bold mr-20"
                              >
                                {score.points}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
                {student.score.title.length === 0 && (
                  <div className="mt-5 flex items-center justify-center flex-col">
                    <div className="text-7xl mb-4">😢</div>
                    <div>ยังไม่มีคะแนนเลยจ้า</div>
                  </div>
                )}
              </div>
              <div>
                <div className="w-96  h-full flex gap-5 items-center justify-center   ">
                  {scores?.data.map((score) => {
                    return (
                      <div
                        key={score.id}
                        className="w-full h-full flex items-center justify-center flex-col gap-2"
                      >
                        {runAnimation ? (
                          <button
                            aria-label={`buuton ${score.title} `}
                            role="button"
                            className="w-max h-5/6 px-2 bg-gray-300 flex flex-col font-Kanit text-lg items-center justify-center rounded-lg cursor-pointer
               border-2 border-solid hover:scale-110
             hover:bg-yellow-200 transition duration-150 ease-in-out"
                          >
                            <div>{score.picture}</div>
                            <div>{score.title}</div>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              onClick({
                                scoreId: score.id,
                                studentId: student.id,
                                scoreTitle: score.title,
                                scoreEmoji: score.picture,
                                pointsValue,
                              })
                            }
                            key={score.id}
                            aria-label={`buuton ${score.title} `}
                            role="button"
                            className="w-max h-5/6 px-2 bg-white flex flex-col font-Kanit text-lg items-center justify-center rounded-lg cursor-pointer
             border-2 border-solid hover:scale-110
           hover:bg-yellow-200 transition duration-150 ease-in-out"
                          >
                            <div>{score.picture}</div>
                            <div>{score.title}</div>
                          </button>
                        )}
                        <input
                          id={score.id}
                          title={score.title}
                          placeholder="1"
                          onChange={handleChangeScore}
                          className="w-10 text-center placeholder:text-black"
                          value={pointsValue[score.id]}
                          type="number"
                          name="points"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => close()}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/20 "
      ></div>
    </div>
  );
}

export default CreateScore;

import Lottie from "lottie-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiPlus, FiPlusSquare, FiSave, FiSettings } from "react-icons/fi";
import { HideScore, UpdateScoreOnStudent } from "../../service/scores";
import * as animationData from "../../public/json/well-done-output.json";
import fileSoundPositive from "../../public/sound/ging.mp3";
import fileSoundNagative from "../../public/sound/wrong.mp3";
import {
  FcBusinessContact,
  FcCancel,
  FcCheckmark,
  FcLineChart,
  FcViewDetails,
} from "react-icons/fc";
import { DelteStudent, UpdateStudent } from "../../service/students";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import CreateScore from "./createScore";
import { avartars } from "../../data/students";
function UpdateScore({ close, student, scores, students, refetchScores }) {
  const [soundPositive, setSoundPositive] = useState(null);
  const [soundNagative, setSoundNagative] = useState(null);
  const [clickScoreTitle, setClickScoreTitle] = useState();
  const [runScoreTitle, setRunScoreTitle] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [chooseAvatar, setShooseAvatar] = useState();
  const [pointsValue, setpointsValue] = useState(1);
  const [data, setData] = useState(animationData);
  const [error, setError] = useState();
  const [isDeleteStudent, setIsDeleteStudent] = useState(false);
  const [triggerSetting, setTriggerSetting] = useState(false);
  const [triggerCreateNewScore, setTriggerCreateNewScore] = useState(false);
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
    setpointsValue(value);
    // set point value as diffrent value as differnt id
    // setpointsValue((prev) => ({ ...prev, [id]: value }));
  };

  const handleChooseAvatar = ({ avartar, index }) => {
    setShooseAvatar(() => {
      return {
        avartar: avartar,
        index: index,
      };
    });
  };
  console.log(chooseAvatar);

  //handle hiden score
  const onClickToHide = async ({ scoreId }) => {
    try {
      const hideScore = await HideScore({ scoreId });
      refetchScores();
    } catch (err) {
      Swal.fire("error", err?.response?.data?.message.toString(), "error");
    }
  };

  //handleonChange when update students data
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setStdentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handle delete student
  const handleDelteStudent = async (data) => {
    try {
      const deletedStudent = await DelteStudent({ studentId: data.studentId });
      Swal.fire("success", deletedStudent.data.message, "success");
      students.refetch();
      console.log(deletedStudent);
    } catch (err) {
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      students.refetch();
    }
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
        chooseAvatar: chooseAvatar.avartar,
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

        if (!pointsValue) {
          points = 1;
        } else if (pointsValue) {
          if (pointsValue < 0) {
            checkNagativePoint = true;
          }
          points = pointsValue;
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
    <div
      className=" md:w-full h-full font-Kanit md:p-5 z-20 
top-0 right-0 left-0 bottom-0 m-auto fixed flex items-center justify-center"
      key={student.id}
    >
      <div
        className="flex md:flex-row flex-col w-[95%] md:w-3/4 lg:w-2/4 h-max font-Kanit bg-white border-2 border-solid
    rounded-lg drop-shadow-xl md:p-5 md:px-0 relative items-center justify-center"
      >
        <div
          className="absolute z-20 right-5 top-5 gap-1 flex items-center 
        justify-center text-red-500 hover:text-red-800 transition duration-150 cursor-pointer "
        >
          {isDeleteStudent === false && (
            <div
              className="flex items-center justify-center"
              onClick={() => setIsDeleteStudent(true)}
            >
              <MdDelete size={25} />
              <span className="text-sm">ลบผู้เรียน</span>
            </div>
          )}

          {isDeleteStudent === true && (
            <div className="flex gap-x-4">
              <div
                onClick={() => handleDelteStudent({ studentId: student.id })}
                role="button"
                className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
              >
                <FcCheckmark size={25} />
              </div>
              <div
                role="button"
                onClick={() => setIsDeleteStudent(false)}
                className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
              >
                <FcCancel size={25} />
              </div>
            </div>
          )}
        </div>
        {runAnimation && (
          <div className="absolute z-40  top-10 right-0 left-0 bottom-0 m-auto flex items-center justify-center flex-col">
            <Lottie animationData={data} style={style} />
            {runScoreTitle && (
              <div className="text-black absolute flex items-center justify-center font-bold font-Kanit text-5xl popup">
                {clickScoreTitle}
              </div>
            )}
          </div>
        )}

        {/* avatar here  */}
        <div className=" md:w-[40rem] w-full flex flex-col justify-center items-center ">
          <div className="w-full h-max flex items-center justify-center gap-6  ">
            {triggerSetting === false ? (
              <div className="w-40  h-full  flex items-center justify-center px-5 flex-col relative">
                <div className="relative w-40 h-40 bg-transparent rounded-full overflow-hidden">
                  <Image
                    src={student.picture}
                    layout="fill"
                    alt="students avatar"
                    className="object-cover scale-150 translate-y-10"
                  />
                  <div
                    className={`absolute w-14 h-14  rounded-full ${
                      student.score.totalPoints < 0
                        ? "bg-red-600"
                        : "bg-[#EDBA02] "
                    } ring-2 ring-white
                    flex justify-center items-center font-sans font-bold text-3xl z-10 text-white right-5 top-5`}
                  >
                    {student.score.totalPoints}
                  </div>
                </div>

                <div className="mt-2 text-lg w-max">
                  <span className="mr-2">{student.firstName}</span>
                  <span>{student.lastName}</span>
                </div>
                <div className="font-light">เลขที่ {student.number}</div>
                <div
                  role="button"
                  onClick={() => setTriggerSetting((prev) => (prev = true))}
                  aria-label="button for setting student's data"
                  className="w-max h-max  bg-slate-500 mt-2  text-lg cursor-pointer hover:text-red-500 hover:bg-white
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
                className="md:w-full w-full  h-full gap-10  flex items-center mt-10 md:mt-0
                 md:items-start justify-between px-5  relative"
              >
                <div className="flex items-center justify-center flex-col">
                  <div className="flex flex-col relative">
                    <label className="font-sans font-normal">
                      แก้ไขชื่อจริง
                    </label>
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
                    className="w-max h-max bg-red-500 md:mt-10  mt-2 text-lg cursor-pointer hover:scale-110 right-2 ring-black border-0 border-none
              text-white p-1 rounded-md flex items-center justify-center gap-2 px-6 
              transition duration-150 ease-in-out"
                  >
                    <span>บันทึก</span>
                    <div className="text-white flex items-center justify-center ">
                      <FiSave />
                    </div>
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center ">
                  <div className="mb-10 text-xl">เลือก Avatar ผู้เรียน</div>
                  <div className="grid grid-cols-5 gap-4">
                    {avartars.map((avartar, index) => {
                      return (
                        <button
                          type="button"
                          onClick={() => handleChooseAvatar({ avartar, index })}
                          className={`bg-white drop-shadow-md  hover:scale-110 ${
                            chooseAvatar?.index === index
                              ? "border-black border-2"
                              : "border-black border-none"
                          }
                         border-solid rounded-lg relative w-16 h-16 transition duration-150`}
                        >
                          <Image
                            src={avartar}
                            layout="fill"
                            className="object-contain"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        {/* score part */}
        {triggerSetting === false && (
          <div className=" flex-col  w-full md:w-full  ">
            <div className="flex items-center justify-center h-5 mt-2 text-lg w-full mb-2 ">
              คะแนนความประพฤติ
            </div>

            <div className="">
              <div
                className={`md:w-96  w-full  h-full grid ${
                  triggerCreateNewScore ? " grid-cols-1" : " grid-cols-3"
                } gap-5  items-center justify-center`}
              >
                {triggerCreateNewScore === false ? (
                  scores?.data.map((score) => {
                    if (score.display === false) return null;
                    return (
                      <div
                        key={score.id}
                        className="w-full h-full flex items-center justify-center flex-col gap-2"
                      >
                        {runAnimation ? (
                          <button
                            aria-label={`buuton ${score.title} `}
                            role="button"
                            className="w-full h-full  px-2 bg-gray-300 flex flex-col font-Kanit text-lg items-center justify-center rounded-lg cursor-pointer
               border-2 border-solid hover:scale-110
             hover:bg-yellow-200 transition duration-150 ease-in-out"
                          >
                            <div className="mt-2">{score.picture}</div>
                            <div>{score.title}</div>
                          </button>
                        ) : (
                          <div
                            key={score.id}
                            className="group relative w-full h-full"
                          >
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
                              aria-label={`buuton ${score.title} `}
                              role="button"
                              className="w-full h-full px-2 bg-white flex flex-col font-Kanit text-lg items-center justify-center rounded-lg cursor-pointer
           border-2 border-solid hover:scale-110  group
         hover:bg-yellow-200 transition duration-150 ease-in-out"
                            >
                              <div className="mt-2">{score.picture}</div>
                              <div>{score.title}</div>
                            </button>
                            <div
                              onClick={() =>
                                onClickToHide({ scoreId: score.id })
                              }
                              className="absolute  top-1 right-1 hidden group-hover:block  hover:text-red-600"
                            >
                              <MdDelete />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full  flex items-center justify-center">
                    <CreateScore
                      refetchScores={refetchScores}
                      setTriggerCreateNewScore={setTriggerCreateNewScore}
                      classroomId={student?.classroomId}
                    />
                  </div>
                )}
                {!triggerCreateNewScore && (
                  <div
                    onClick={() => setTriggerCreateNewScore(true)}
                    className="flex items-center justify-center "
                  >
                    <div
                      className="w-max h-full px-2 bg-white py-1 flex flex-col font-Kanit text-lg
                         items-center justify-center rounded-lg cursor-pointer
             border-2 border-solid hover:scale-110
           hover:bg-yellow-200 transition duration-150 ease-in-out"
                    >
                      <FiPlus />
                      <span className="text-sm">สร้างคะแนน</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full flex items-center justify-center flex-col mt-5 ">
                <input
                  placeholder="1"
                  onChange={handleChangeScore}
                  className="w-20 text-lg font-sans font-semibold rounded-md border-0 ring-blue-500 ring-2 active:border-0 focus:border-0 text-center placeholder:text-black"
                  value={pointsValue}
                  type="number"
                  name="points"
                />
                <div className="w-max h-max text-sm mt-2 text-red-600">
                  <span>
                    **หมายเหตุ สามารถลบคะแนนผู้เรียนได้โดยใส่เครื่องหมาย - เช่น
                    -5
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        onClick={() => close()}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/20 "
      ></div>
    </div>
  );
}

export default UpdateScore;

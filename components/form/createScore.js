import Lottie from "lottie-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import { UpdateScoreOnStudent } from "../../service/scores";
import * as animationData from "../../public/json/well-done-output.json";
import sound from "../../public/sound/ging.mp3";
function CreateScore({ close, student, scores, students }) {
  const [audio, setAudio] = useState(null);
  const [clickScoreTitle, setClickScoreTitle] = useState();
  const [runScoreTitle, setRunScoreTitle] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [data, setData] = useState(animationData);

  //prepare sound
  useEffect(() => {
    setAudio(new Audio(sound));
  }, []);
  console.log(data);
  const onClick = async (data) => {
    try {
      setClickScoreTitle((prev) => (prev = data.scoreTitle));
      const updateScore = await UpdateScoreOnStudent(data);
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
                        t: "000",
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
        audio.play();
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
        <div className=" w-[40rem] flex flex-col justify-center items-center ">
          <div className="w-full h-60 flex items-start justify-center gap-6">
            <div className="w-60 bg-white h-full flex items-center justify-center flex-col relative">
              <div
                className="absolute w-12 h-12 rounded-full bg-[#EDBA02] ring-2 ring-white
                    flex justify-center items-center font-sans font-bold text-3xl z-10 text-white right-5 top-5"
              >
                {student.score.totalPoints}
              </div>
              <div className="relative w-40 h-40 bg-transparent rounded-full overflow-hidden">
                <Image
                  src={student.picture}
                  layout="fill"
                  className="object-cover scale-150 translate-y-10"
                />
              </div>

              <div className="mt-2 text-lg">
                <span className="mr-2">{student.firstName}</span>
                <span>{student.lastName}</span>
              </div>
              <div className="font-light">เลขที่ {student.number}</div>
            </div>
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
            </div>
          </div>
          <div className="w-full  h-full flex gap-5 items-center justify-center ">
            {scores?.data.map((score) => {
              return (
                <button
                  onClick={() =>
                    onClick({
                      scoreId: score.id,
                      studentId: student.id,
                      scoreTitle: score.title,
                    })
                  }
                  key={score.id}
                  aria-label={`buuton ${score.title} `}
                  role="button"
                  className="w-max h-5/6 px-2 bg-white flex flex-col font-Kanit text-lg items-center justify-center rounded-lg cursor-pointer
               border-2 border-solid hover:scale-110
             hover:bg-yellow-200 transition duration-150 ease-in-out"
                >
                  <div>😊</div>
                  <div>{score.title}</div>
                </button>
              );
            })}
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

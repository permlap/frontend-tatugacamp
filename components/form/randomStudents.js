import React, { useEffect, useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import Image from "next/image";
import Swal from "sweetalert2";
import { MdRestartAlt } from "react-icons/md";
import { RiShuffleLine } from "react-icons/ri";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 5,
});
const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

function RandomStudents({
  setTriggerRandomStudent,
  language,
  students,
  classroomId,
}) {
  const [gone] = useState(() => new Set()); // The set flags all the students that are flicked out
  const newStudents = [...students];
  const [activeShowCard, setActiveShowCard] = useState({
    active: false,
    index: "",
  });
  const [firstRender, setFirstRender] = useState(false);
  const [isReadyCards, setIsReadyCard] = useState(false);
  const [confirmDeleteCard, setConfirmDeleteCard] = useState(false);
  const [outCard, setOutCard] = useState([]);
  const [activeCard, setActiveCard] = useState();
  const [shuffledArray, setShuffledArray] = useState([]);
  const { width, height } = useWindowSize();
  const [activeCongrest, setActiveCongrest] = useState(false);
  const [audioSheer, setAudioSheer] = useState(null);
  const [audioCard, setAudioCard] = useState(null);
  const [audioShuffle, setAudioShuffle] = useState(null);

  const sound = {
    cards: "https://storage.googleapis.com/tatugacamp.com/sound/card.mp3",
    sheer: "https://storage.googleapis.com/tatugacamp.com/sound/sheer.mp3",
    shuffle: "https://storage.googleapis.com/tatugacamp.com/sound/shuffle.aac",
  };
  // const [soundResorce, setSoundResorce] = useState(sound.sheer);
  // const [audio, state, controls, ref] = useAudio({
  //   src: soundResorce,
  //   autoPlay: true,
  // });
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  //set random card with the first render only
  useEffect(() => {
    setAudioCard(() => new Audio(sound.cards));
    setAudioSheer(() => new Audio(sound.sheer));
    setAudioShuffle(() => new Audio(sound.shuffle));

    setShuffledArray(() => {
      const shuffledArrayObject = localStorage.getItem(
        `${classroomId}:shuffledArray`
      );
      const parsedArrayObject = JSON.parse(shuffledArrayObject);
      if (parsedArrayObject?.length === 0 || !parsedArrayObject) {
        return shuffleArray(newStudents);
      } else if (parsedArrayObject?.length > 0) {
        return parsedArrayObject;
      }
    });
    setOutCard(() => {
      const outCardArrayObject = localStorage.getItem(`${classroomId}:outCard`);
      const parsedArrayObject = JSON.parse(outCardArrayObject);
      if (!parsedArrayObject) {
        return [];
      } else if (parsedArrayObject) {
        return parsedArrayObject;
      }
    });
    setTimeout(() => {
      setIsReadyCard(() => true);
    }, 300);
    setFirstRender(() => true);
  }, []);

  const [props, api] = useSprings(shuffledArray.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      const x = (0 + window.innerWidth) * dir ? mx : 0;

      if (
        (!down && trigger) ||
        (!down && x > window.innerWidth / 10) ||
        (!down && x < (window.innerWidth / 10) * -1)
      ) {
        gone.add(index);
        setActiveCongrest(() => true);
        audioSheer.play();
        Swal.fire({
          title: `เลขที่ ${shuffledArray[index].number} ${shuffledArray[index].firstName} ${shuffledArray[index]?.lastName}`,
          text: "ยินดีด้วยย คุณคือผู้ถูกเลือก",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          width: "max-content",
          confirmButtonText: "remove",
        }).then((result) => {
          if (result.isConfirmed) {
            audioSheer.currentTime = 0;
            audioSheer.pause();
            setActiveCongrest(() => false);
            setOutCard((prev) => {
              return [
                ...prev,
                {
                  firstName: shuffledArray[index].firstName,
                  lastName: shuffledArray[index]?.lastName,
                  number: shuffledArray[index].number,
                  picture: shuffledArray[index].picture,
                },
              ];
            });
          } else if (result.dismiss) {
            audioSheer.currentTime = 0;
            audioSheer.pause();
            setActiveCongrest(() => false);
            api.start((i) => {
              if (i !== index) {
                return null;
              }
              gone.clear();
              return to(i);
            });
          }
        });
      } // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active shuffledArray lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
    }
  );

  const restart = () => {
    setTimeout(() => {
      setOutCard(() => []);
      setShuffledArray(() => shuffleArray(newStudents));
      gone.clear();
      api.start((i) => {
        return from(i);
      });
      api.start((i) => {
        return to(i);
      });
    }, 600);
  };
  const shuffle = () => {
    const result = newStudents.filter(
      (objFirst) =>
        !outCard.some((objSecond) => objSecond.number === objFirst.number)
    );
    setShuffledArray(() => shuffleArray(result));
    audioShuffle.play();
    setTimeout(() => {
      audioShuffle.pause();
      audioShuffle.currentTime = 0;
    }, 500);
    api.start((i) => {
      return from(i);
    });
    api.start((i) => {
      return to(i);
    });
  };

  useEffect(() => {
    if (firstRender) {
      const result = newStudents.filter(
        (objFirst) =>
          !outCard.some((objSecond) => objSecond.number === objFirst.number)
      );
      setShuffledArray(() => shuffleArray(result));

      localStorage.setItem(`${classroomId}:outCard`, JSON.stringify(outCard));
    }
  }, [outCard]);

  useEffect(() => {
    if (firstRender) {
      localStorage.setItem(
        `${classroomId}:shuffledArray`,
        JSON.stringify(shuffledArray)
      );
    }
  }, [shuffledArray]);

  return (
    <div
      className="flex  w-screen h-screen font-Kanit bg-transparent  z-40 
    top-0 right-0 left-0 bottom-0 m-auto fixed"
    >
      {activeCongrest && (
        <div>
          <Confetti width={width} height={height} />
        </div>
      )}
      <div>
        <div
          className="flex flex-col gap-40 w-max h-max font-Kanit z-20 
        top-60  right-0 left-0 bottom-0 m-auto fixed"
        >
          <div className="flex items-center justify-center ">
            {props.map(({ x, y, rot, scale }, i) => {
              return (
                <animated.button className="deck" key={i} style={{ x, y }}>
                  {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
                  <animated.div
                    {...bind(i)}
                    onMouseDown={() => {
                      if (isReadyCards) {
                        audioCard.play();
                        setActiveCard(i);
                      }
                    }}
                    onMouseUp={() => {
                      if (isReadyCards) {
                        audioCard.pause();
                        audioCard.currentTime = 0;
                        setActiveCard("");
                      }
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
                        className="w-20 h-20 rounded-full overflow-hidden relative "
                      >
                        <Image
                          src={shuffledArray[i].picture}
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
                        {activeCard === i
                          ? ` เลขที่ ${shuffledArray[i].number}`
                          : "****"}
                      </span>
                      <span>
                        {activeCard === i
                          ? shuffledArray[i].firstName
                          : "******"}
                      </span>
                      <span>
                        {activeCard === i ? shuffledArray[i]?.lastName : "***"}
                      </span>
                    </animated.ul>
                  </animated.div>
                </animated.button>
              );
            })}
          </div>
          <nav>
            <ul className="w-80 h-20 flex gap-20 justify-center items-center bg-white rounded-2xl pl-0 list-none">
              <li
                onClick={restart}
                className="flex flex-col w-max hover:bg-blue-300 cursor-pointer q group rounded-xl p-2 items-center 
               transition duration-100 justify-center"
              >
                <div className="text-black group-hover:text-white text-3xl -mb-2 ">
                  <MdRestartAlt />
                </div>
                <span className="group-hover:text-white transition duration-100">
                  {language === "Thai" && "เริ่มใหม่"}
                  {language === "English" && "restart"}
                </span>
              </li>
              <li
                onClick={shuffle}
                className="flex flex-col w-max hover:bg-blue-300 cursor-pointer q group rounded-xl p-2 items-center 
               transition duration-100 justify-center"
              >
                <div className="text-black group-hover:text-white text-3xl -mb-2 ">
                  <RiShuffleLine />
                </div>
                <span className="group-hover:text-white transition duration-100">
                  {language === "Thai" && "สับการ์ดใหม่"}
                  {language === "English" && "shuffle"}
                </span>
              </li>
            </ul>
          </nav>
        </div>

        <section className="w-96 h-screen bg-white overflow-auto">
          <h2 className="w-full text-center pt-10">
            <span className="text-black">
              {language === "Thai" && "รายชื่อที่ถูกเลือก"}
              {language === "English" && "Result"}
            </span>
          </h2>
          <ul className="p-10">
            {outCard?.map((card, index) => {
              return (
                <li key={index} className="text-black">
                  <span>เลขที่ {card.number} </span>
                  <span>{card.firstName} </span>
                  <span>{card?.lastName}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerRandomStudent(false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default RandomStudents;

import React, { useState } from "react";
import Swal from "sweetalert2";
import { CreateScoreOnClass } from "../../service/scores";

function CreateScore({
  setTriggerCreateNewScore,
  classroomId,
  refetchScores,
  language,
}) {
  const [activeEmoji, setActiveEmoji] = useState();
  const [scoreForm, setScoreForm] = useState({
    title: "",
    emoji: "",
  });
  const emojis = ["😀", "🤣", "😍", "🤨", "😎", "❤️", "☹️", "😱"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScoreForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CreateScoreOnClass({
        title: scoreForm.title,
        emoji: scoreForm.emoji,
        classroomId: classroomId,
      });
      setTriggerCreateNewScore(() => false);
      refetchScores();
    } catch (err) {
      console.log(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  return (
    <form
      className=" w-full py-0 flex flex-col justify-center items-center "
      onSubmit={handleSubmit}
    >
      <div className="relative grid grid-cols-4 gap-4">
        {emojis.map((emoji, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                setActiveEmoji(index);
                setScoreForm((prevState) => {
                  return {
                    ...prevState,
                    emoji: emoji,
                  };
                });
              }}
              className={`hover:bg-slate-200 cursor-pointer p-2 rounded-lg border-2 border-solid transition duration-150 ${
                activeEmoji === index ? "border-black" : "border-white"
              }`}
            >
              {emoji}
            </div>
          );
        })}
        {/* <label className="font-sans font-normal">emoji</label>
        <input
          onChange={handleChange}
          className="w-18 h-7 rounded-md   pl-2 
        placeholder:italic placeholder:font-light"
          type="text"
          name="emoji"
          placeholder="เช่น 🙂"
          maxLength="30"
          value={scoreForm.emoji}
          required
        /> */}
      </div>

      <div className="flex flex-col relative mt-2">
        <label className="font-sans font-normal">title</label>
        <input
          className="w-18 h-7 rounded-md  pl-2 
        placeholder:italic placeholder:font-light"
          type="text"
          onChange={handleChange}
          name="title"
          placeholder="เช่น ทำดีมาก!"
          maxLength="20"
          value={scoreForm.title}
          required
        />
      </div>
      <div className="flex gap-1">
        <button
          className="w-max  h-9 mt-2  px-2 rounded bg-[#2C7CD1] text-white font-sans font-bold
      text-md cursor-pointer hover: active:border-2  active:border-gray-300
       active:border-solid  focus:border-2 
      focus:border-solid"
        >
          {language === "Thai" && "สร้าง"}
          {language === "English" && "save"}
        </button>
        <button
          type="button"
          onClick={() => setTriggerCreateNewScore(false)}
          className="w-max  h-9 mt-2 px-2 rounded bg-red-600 text-white font-sans font-bold
      text-md cursor-pointer hover: active:border-2  active:border-gray-300
       active:border-solid  focus:border-2 
      focus:border-solid"
        >
          {language === "Thai" && "ยกเลิก"}
          {language === "English" && "cancel"}
        </button>
      </div>
    </form>
  );
}

export default CreateScore;

import React from "react";

function Status(props) {
  return (
    <ul className="list-none mt-3 text-[#EDBA02]  flex justify-center items-center gap-x-4 font-Inter  font-normal  bg-white w-[21rem] h-max py-1 px-3 md:px-3 rounded-xl">
      <li>
        <div className="text-2xl md:text-[2rem]">
          <ion-icon name="time"></ion-icon>
        </div>
        <div className="text-black text-[0.7rem] ">{props.status?.time}</div>
      </li>

      <li>
        <div className="text-2xl md:text-[2rem]">
          <ion-icon name="people"></ion-icon>
        </div>

        <div className="text-black text-[0.7rem]">{props.status?.people}</div>
      </li>
      <li>
        <div className="text-2xl md:text-[2rem]">
          <ion-icon name="newspaper"></ion-icon>
        </div>

        <div className="text-black text-[0.7rem]">{props.status?.material}</div>
      </li>
      <li>
        <div className="text-2xl md:text-[2rem]">
          <ion-icon name="accessibility"></ion-icon>
        </div>

        <div className="text-black text-[0.7rem]">{props.status?.age}</div>
      </li>
    </ul>
  );
}

export default Status;

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";
import { CreateFeedbackApi } from "../../service/feedback";
import { tagsEnglish, tagsThai } from "../../data/tagsFeedback";

function RandomStudents({ close, language }) {
  return (
    <div>
      <div
        className="flex w-screen h-screen font-Kanit bg-transparent  z-40 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <div
          className="flex w-96 h-96 font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-20 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
        ></div>
        <div
          onClick={() => {
            document.body.style.overflow = "auto";
            close();
          }}
          className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
        ></div>
      </div>
    </div>
  );
}

export default RandomStudents;

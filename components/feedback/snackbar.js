import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Alert } from "@mui/material";
import { FcFeedback } from "react-icons/fc";
import { MdFeedback } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import CreateFeedback from "../form/createFeedbacl";

function FeedbackSankbar() {
  const [open, setOpen] = useState(true);
  const [isFeedback, setIsfeedback] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseFeedback = () => {
    document.body.style.overflow = "auto";
    setIsfeedback(false);
    setOpen(true);
  };
  const handleOpenFeedback = () => {
    document.body.style.overflow = "hidden";
    setIsfeedback(true);
    setOpen(false);
  };
  return (
    <div>
      {isFeedback && (
        <CreateFeedback handleCloseFeedback={handleCloseFeedback} />
      )}
      <Snackbar
        onClick={handleOpenFeedback}
        className="
        bg-green-400 text-black p-3 px-3 hover:bg-green-500 hover:scale-105
        transition duration-200 rounded-xl cursor-pointer  active:bg-green-600"
        open={open}
      >
        <div className=" flex items-center justify-between w-full gap-3 font-Kanit">
          <div className="flex gap-2">
            <div
              className="flex text-2xl text-white
           items-center justify-center"
            >
              <FcFeedback />
            </div>
            <div className="flex">
              <span>Feedback ของท่านคือความหวังของเรา</span>
            </div>
          </div>
        </div>
      </Snackbar>
    </div>
  );
}

export default FeedbackSankbar;

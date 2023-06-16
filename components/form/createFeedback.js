import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";
import { CreateFeedbackApi } from "../../service/feedback";
import { tagsEnglish, tagsThai } from "../../data/tagsFeedback";

function CreateFeedback({ handleCloseFeedback, language }) {
  const [tags, setTag] = useState(() => {
    if (language === "Thai") {
      return tagsThai;
    } else if (language === "English") {
      return tagsEnglish;
    }
  });
  const [feedbackData, setFeedbackData] = useState({
    body: "",
    tag: "",
  });
  const [activeTag, setActiveTag] = useState();
  const [checkAuth, setCheckAuth] = useState({
    unAuth: true,
    auth: false,
  });
  const handleChangeCheckAuth = (e) => {
    const { name, checked } = e.target;
    setCheckAuth((prev) => {
      if (name === "unAuth") {
        return {
          [name]: checked,
          auth: false,
        };
      } else if (name === "auth") {
        return {
          [name]: checked,
          unAuth: false,
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const feedback = await CreateFeedbackApi({
        body: feedbackData.body,
        tag: feedbackData.tag,
        checkAuth: checkAuth,
      });
      Swal.fire("success", "Your feedback has been sent", "success");
      handleCloseFeedback();
    } catch (err) {
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };
  return (
    <div>
      <div
        className="flex w-screen h-screen font-Kanit bg-transparent  z-40 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <div
          className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-20 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
        >
          <form
            className=" w-max flex flex-col justify-center items-start "
            onSubmit={handleSubmit}
          >
            <span className="text-xl mb-6 font-semibold text-[#2C7CD1]">
              {language === "Thai" && "ท่านคิดเห็นอย่างไรกับ Tatuga class"}
              {language === "English" && "What do you think of tatuga class?"}
            </span>
            <div className="text-md  mb-6 font-normal text-black flex md:gap-6 gap-3 flex-col md:flex-row">
              <span>
                {language === "Thai" && "ท่านต้องการระบุตัวตนหรือไม่"}
                {language === "English" && "Do you want to identify yourself?"}
              </span>
              <div className="flex gap-6">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">
                    {language === "Thai" && "ไม่ต้องการ"}
                    {language === "English" && "NO"}
                  </span>
                  <input
                    type="checkbox"
                    name="unAuth"
                    checked={checkAuth.unAuth}
                    onChange={handleChangeCheckAuth}
                  />
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">
                    {language === "Thai" && "ต้องการ"}
                    {language === "English" && "YES"}
                  </span>
                  <input
                    type="checkbox"
                    name="auth"
                    checked={checkAuth.auth}
                    onChange={handleChangeCheckAuth}
                  />
                </div>
              </div>
            </div>
            <div className="w-80 md:w-full h-80">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                textareaName="description"
                init={{
                  placeholder:
                    language === "Thai"
                      ? "ความคิดเห็นของท่านคือความหวังของเรา..."
                      : language === "English" && "type your feedback here",
                  selector: "textarea",
                  link_context_toolbar: true,
                  height: "100%",
                  width: "100%",
                  menubar: false,
                  image_title: true,
                  automatic_uploads: true,
                  file_picker_types: "image",
                  file_picker_callback: (cb, value, meta) => {
                    const input = document.createElement("input");
                    input.setAttribute("type", "file");
                    input.setAttribute("accept", "image/*");

                    input.addEventListener("change", (e) => {
                      const file = e.target.files[0];

                      const reader = new FileReader();
                      reader.addEventListener("load", () => {
                        /*
                          Note: Now we need to register the blob in TinyMCEs image blob
                          registry. In the next release this part hopefully won't be
                          necessary, as we are looking to handle it internally.
                        */
                        const id = "blobid" + new Date().getTime();
                        const blobCache =
                          tinymce.activeEditor.editorUpload.blobCache;
                        const base64 = reader.result.split(",")[1];
                        const blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);

                        /* call the callback and populate the Title field with the file name */
                        cb(blobInfo.blobUri(), { title: file.name });
                      });
                      reader.readAsDataURL(file);
                    });

                    input.click();
                  },
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                    "link",
                    "image",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help | link | image",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                onEditorChange={(newText) =>
                  setFeedbackData((prev) => {
                    return {
                      ...prev,
                      body: newText,
                    };
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 mt-4">
              {tags.map((tag, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTag(() => index);
                      setFeedbackData((prev) => {
                        return {
                          ...prev,
                          tag: tag.title,
                        };
                      });
                    }}
                    className={`md:p-4 p-1 border-2 gap-2 transition duration-150 hover:scale-110 hover:border-orange-300
                     border-solid rounded-xl  ${
                       activeTag === index
                         ? "border-orange-500"
                         : "border-gray-200"
                     } items-center justify-center w-full flex`}
                    type="button"
                  >
                    <div className="flex items-center justify-center">
                      {tag.icon}
                    </div>
                    <span>{tag.title}</span>
                  </button>
                );
              })}
            </div>
            <button
              className="w-28  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
            >
              {language === "Thai" && "ส่ง"}
              {language === "English" && "summit"}
            </button>
          </form>
        </div>
        <div
          onClick={() => handleCloseFeedback()}
          className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
        ></div>
      </div>
    </div>
  );
}

export default CreateFeedback;

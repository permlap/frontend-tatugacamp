import axios from "axios";
import Error from "next/error";

export async function GetAllAssignment({ studentId, classroomId }) {
  try {
    if (!studentId || !classroomId) {
      return null;
    }
    const assignments = await axios.get(
      `${process.env.Server_Url}/student/student-assignment/get-all`,
      {
        params: {
          studentId: studentId,
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return assignments;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetMyWork({ studentId, assignmentId }) {
  try {
    const myWork = await axios.get(
      `${process.env.Server_Url}/student/student-assignment/view-my-work`,
      {
        params: {
          studentId: studentId,
          assignmentId: assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return myWork;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function SummitWork({ formFiles, assignmentId, studentId }) {
  try {
    const heic2any = (await import("heic2any")).default;
    const filesOld = await formFiles.getAll("files");
    const files = await Promise.all(
      filesOld.map(async (file) => {
        if (file.type === "") {
          const blob = await heic2any({
            blob: file,
            toType: "image/jpeg",
          });
          file = new File([blob], file.name, { type: "image/jpeg" });
          return {
            file: file,
            fileName: file.name,
            fileType: file.type,
          };
        } else {
          return {
            file: file,
            fileName: file.name,
            fileType: file.type,
          };
        }
      })
    );
    console.log(files);
    const sumiit = await axios.post(
      `${process.env.Server_Url}/student/student-assignment/summit-work`,
      { files },
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    for (let i = 0; i < sumiit.data.length; i++) {
      const response = await fetch(sumiit.data[i].SignedURL, {
        method: "PUT",
        headers: {
          "Content-Type": `${sumiit.data[i].contentType}`,
        },
        body: files[i].file,
      }).catch((err) => console.log(err));
    }

    return "finish";
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

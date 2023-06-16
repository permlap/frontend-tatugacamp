import axios from "axios";
import Error from "next/error";

export async function GetComments({ assignmentId, studentId }) {
  try {
    if (!assignmentId || !studentId) {
      return null;
    }
    const comments = await axios.get(
      `${process.env.Server_Url}/student/comment/get-comment`,
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

    return comments;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
export async function PostComment({ assignmentId, studentId, body }) {
  try {
    if (!assignmentId || !studentId) {
      return null;
    }

    const comments = await axios.post(
      `${process.env.Server_Url}/student/comment/post-comment`,
      {
        body: body,
      },
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

    return comments;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

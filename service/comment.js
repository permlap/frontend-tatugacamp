import axios from "axios";
import Error from "next/error";

export async function GetComments({ assignmentId, studentId }) {
  try {
    if (!assignmentId || !studentId) {
      return null;
    }
    const access_token = localStorage.getItem("access_token");
    const comments = await axios.get(
      `${process.env.Server_Url}/user/comment/get-comment`,
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
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
    const access_token = localStorage.getItem("access_token");
    const comments = await axios.post(
      `${process.env.Server_Url}/user/comment/post-comment`,
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
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return comments;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

import axios from "axios";
import { FcUndo } from "react-icons/fc";
export async function GetUser() {
  try {
    const access_token = localStorage.getItem("access_token");
    const user = await axios.get(`${process.env.Server_Url}/users/me`, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    return user;
  } catch (err) {
    if (err.response.status === 401) {
      return "Unauthorized";
    }
  }
}

export async function CreateClassroom(inputObject, access_token) {
  try {
    console.log("access_token", access_token);
    console.log("inputObject", inputObject);
    const classroom = await axios.post(
      `${process.env.Server_Url}/user/classroom/create`,
      {
        title: inputObject.title,
        description: inputObject.description,
        level: inputObject.level,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
}

export async function DeleteClassroom(classroomId) {
  const access_token = localStorage.getItem("access_token");

  console.log("access_token", access_token);
  try {
    const deleteClassroom = await axios.delete(
      `${process.env.Server_Url}/user/classroom/delete`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(deleteClassroom);
    return deleteClassroom;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllClassrooms() {
  try {
    const access_token = localStorage.getItem("access_token");
    const classrooms = await axios.get(
      `${process.env.Server_Url}/user/classroom/get-all-classroom`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classrooms;
  } catch (err) {
    console.log(err);
  }
}

export async function GetOneClassroom({ params }) {
  try {
    console.log("parans fron axiosu", params);
    const access_token = localStorage.getItem("access_token");
    const classroom = await axios.get(
      `${process.env.Server_Url}/user/classroom/get-a-classroom/${params}`,
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    console.log("data axious", classroom);
    return classroom;
  } catch (err) {
    return err;
  }
}

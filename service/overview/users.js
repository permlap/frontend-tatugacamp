import axios from "axios";
import Error from "next/error";

export async function GetNumberUsers() {
  try {
    const users = await axios.get(
      `${process.env.Server_Url}/overview/get-allUser`
    );

    return users;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetNumberStudent() {
  try {
    const student = await axios.get(
      `${process.env.Server_Url}/overview/get-allStudent`
    );

    return student;
  } catch (err) {
    throw new Error(err);
  }
}

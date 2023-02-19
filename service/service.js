import axios from "axios";

export async function GetUser(access_token) {
  const user = await axios.get(`${process.env.Server_Url}/users/me`, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });

  return user;
}

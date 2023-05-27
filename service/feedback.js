import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { GetUser } from "./user";

export async function CreateFeedbackApi({ body, checkAuth, tag }) {
  try {
    console.log(checkAuth);
    if (checkAuth.auth === true) {
      const user = await GetUser();
      const feedback = await axios.post(
        `${process.env.Server_Url}/feedback/post-feedback`,
        {
          body: body,
          tag: tag,
        },
        {
          params: {
            userId: user.data.id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return feedback;
    } else if (checkAuth.unAuth === true) {
      const feedback = await axios.post(
        `${process.env.Server_Url}/feedback/post-feedback`,
        {
          body: body,
          tag: tag,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return feedback;
    }
  } catch (err) {
    throw new Error(err);
  }
}

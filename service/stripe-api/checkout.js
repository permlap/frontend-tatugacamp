import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function CreateCheckout({ priceId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const createCheckout = await axios.post(
      `${process.env.Server_Url}/stripe/create-checkout-session-new`,
      {
        priceId: priceId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return createCheckout;
  } catch (err) {
    throw new Error(err);
  }
}

export async function CreateCheckoutOld({ priceId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const createCheckout = await axios.post(
      `${process.env.Server_Url}/stripe/create-checkout-session-old`,
      {
        priceId: priceId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return createCheckout;
  } catch (err) {
    throw new Error(err);
  }
}

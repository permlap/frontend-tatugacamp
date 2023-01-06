import axios from "axios";
import { sanityClient } from "../../sanity";
const query = `*[_type  == "taboo"]`;

export default async function GetTaboo(req, res) {
  if (req.method === "GET") {
    const data = await sanityClient.fetch(query);
    return res.status(200).json(data);
  }
}

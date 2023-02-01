import { sanityClient } from "../../../sanity";

export default async function GetPost(req, res) {
  if (req.method === "GET") {
    const { id } = req.body;
    const query = `*[_id=="${id}"]`;
    const post = await sanityClient.fetch(query);
    if (!post) {
      return res.status(204).json("THERE IS NO CONTENT");
    } else if (post) {
      return res.status(200).json({ data: post });
    }
  } else {
    return res.status(405).json("ONLY GET METHOD IS ALLOWED");
  }
}

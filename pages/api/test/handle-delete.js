import { sanityClient } from "../../../sanity";

sanityClient.config({
  token: process.env.SANITY_WRITE_TOKEN,
});
export default async function DeleteDoc(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.body;
    const deleteDoc = await sanityClient
      .delete(id)
      .then(() => {
        console.log(`${id} has been deleted`);
      })
      .catch((err) => {
        console.error("Delete failed: ", err.message);
      });

    return res.status(200).json(deleteDoc);
  } else {
    return res.status(405).json("ONLY DELETE METHOD IS ALLOWED");
  }
}

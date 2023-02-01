import { sanityClient } from "../../../sanity";

sanityClient.config({
  token: process.env.SANITY_WRITE_TOKEN,
});
const doc = {
  _id: "8239cca7-fb11-4a9f-8cca-6e733666cdca",
  _type: "taboo",
  vocabulary: "test",
};

export default async function ReplaceTaboo(req, res) {
  if (req.method === "POST") {
    const data = await sanityClient.createOrReplace(doc).then((res) => {
      console.log(`Bike was created, document ID is ${res._id}`);
    });
    return res.status(200).json(data);
  }
}

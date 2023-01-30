import axios from "axios";
import { sanityClient } from "../../sanity";
const query = `*[_type  == "taboo"]{
  firstTaboo,
  secondTaboo,
  thirdTaboo,
  vocabulary,
  mainImage,
  category ->{
    title
  },
}`;

export default async function GetTaboo(req, res) {
  const category = req.query.category;
  if (req.method === "GET") {
    try {
      const queryTest = `*[_type=="taboo" && references(*[_type=="categoryTaboo" && title == "${category}"]._id)]{
        firstTaboo,
        secondTaboo,
        thirdTaboo,
        vocabulary,
        mainImage,
        category ->{
        title
        },
      }`;
      const data = await sanityClient.fetch(queryTest);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

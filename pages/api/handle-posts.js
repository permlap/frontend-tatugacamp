import { sanityClient } from "../../sanity";

const activitiesQuery = `*[_type == "post"]{
  _id,
  title,
 mainImage,
  description,
  likes,
  author ->{
  name,
}
}`;

const grammarQuery = `*[_type == "grammar"]{
  _id,
  slug,
  title,
 mainImage,
  description,
  likes,
  author ->{
  name,
}
}`;

export default async function handlePosts(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const index = req.body.index.current;
  let posts;
  if (index === 0) {
    posts = await sanityClient.fetch(activitiesQuery);
  } else if (index === 1) {
    posts = await sanityClient.fetch(grammarQuery);
  }
  res.status(200).json({ posts } || null);
}

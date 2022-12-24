export default async (req, res) => {
  const postSlug = req.query.post;
  const post = searchPostBySlug(postSlug);

  const postThumbnail = generateThumbnail(post);
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": Buffer.byteLength(screenShotBuffer),
  });
};

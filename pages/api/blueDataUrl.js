import { returnProps } from "../../utils/imageMetadata";

export default async function handler(req, res) {
  // Get your data from a database or any other source
  const cardData = [
    {
      title: "No login required for student",
      picture:
        "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG",
      description: " Students can submit their homework without logging in.",
    },
    {
      title: "Gamification in classroom",
      picture:
        "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3060.PNG",
      description:
        "Our platform incorporates gamification to make teaching a fantastic experience.",
    },
    {
      title: "Export your data to Excel",
      picture:
        "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3062.PNG",
      description:
        "With our platform, you can easily export your data to Excel",
    },
  ];

  const blurData = await Promise.all(
    cardData.map(async (item) => {
      const imageProps = await returnProps(item.picture);

      // This will return the image a well as the needed plaiceholder
      // info in the same object within the array 🤯
      return { ...item, imageProps };
    })
  );

  res.status(200).json({
    blurData,
  });
}

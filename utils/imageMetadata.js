import { getPlaiceholder } from "plaiceholder";
import visit from "unist-util-visit";

// Convert the imageSize method from callback-based to a Promise-based
// promisify is a built-in nodejs utility function btw

// Just to check if the node is an image node
function isImageNode(node) {
  const img = node;
  return (
    img.type === "element" &&
    img.tagName === "img" &&
    img.properties &&
    typeof img.properties.src === "string"
  );
}

// Returns the props of given `src` to use for blurred images
export async function returnProps(src) {
  // Calculate image resolution (width, height)
  const res = { width: 500, height: 500 };
  // Calculate base64 for the blur
  const { base64: blurDataURL, img } = await getPlaiceholder(src);

  // If an error happened calculating the resolution, throw an error
  if (!res) throw Error(`Invalid image with src "${node.properties.src}"`);

  const { width, height } = res;

  return {
    ...img,
    width,
    height,
    blurDataURL,
  };
}

async function addProps(node) {
  // return the new props we'll need for our image
  const { width, height, blurDataURL } = await returnProps(node.properties.src);

  // add the props in the properties object of the node
  // the properties object later gets transformed as props
  node.properties.width = width;
  node.properties.height = height;

  node.properties.blurDataURL = blurDataURL;
  node.properties.placeholder = "blur";
}

const imageMetadata = () => {
  return async function transformer(tree) {
    // Create an array to hold all of the images from the markdown file
    const images = [];

    visit(tree, "element", (node) => {
      // Visit every node in the tree, check if it's an image and push it in the images array
      if (isImageNode(node)) {
        images.push(node);
      }
    });

    for (const image of images) {
      // Loop through all of the images and add their props
      await addProps(image);
    }

    return tree;
  };
};

export default imageMetadata;

const EXTERNAL_DATA_URL = "https://tatugacamp.com/activity";
import { sanityClient } from "../sanity";
function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://tatugacamp.com</loc>
     </url>
     <url>
     <loc>https://tatugacamp.com/classroom</loc>
    </url>
     <url>
       <loc>https://tatugacamp.com/about-us</loc>
     </url>
     ${posts
       .map(({ slug }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${slug.current}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const query = `*[_type == "post"]{
    slug
  }`;
  // We make an API call to gather the URLs for our site
  const posts = await sanityClient.fetch(query);

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;

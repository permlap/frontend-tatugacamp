import React, { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";
import * as animationData from "../LoadingScreen.json";

function ListActivity(props) {
  const [loader, setLoader] = useState(false);
  async function handleCardActivity(event) {
    setLoader(true);
  }

  const activityCards = props?.activityPosts?.map((card, index) => {
    return (
      <ul className="item-center list-none pl-0" key={card._id}>
        <li>
          <div>
            <ActivityCard
              price={card.price}
              handleCardActivity={handleCardActivity}
              id={card._id}
              slug={card.slug}
              likes={card?.likes}
              description={card.description}
              title={card.title}
              image={card.mainImage.asset._ref}
            />
          </div>
        </li>
      </ul>
    );
  });

  return (
    <div className="z-10 pt-5 relative">
      <div className="flex gap-10 items-center justify-center flex-wrap text-center bg-transparent border-0">
        {activityCards}
      </div>
    </div>
  );
}

export default ListActivity;

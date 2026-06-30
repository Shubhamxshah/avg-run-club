import "dotenv/config";

import { db } from "../lib/db";
import { PAST_RUN_RAVE, UPCOMING_RUN_RAVE } from "../lib/run-rave-images";

async function main() {
  await db.event.upsert({
    where: { id: PAST_RUN_RAVE.id },
    update: {
      date: PAST_RUN_RAVE.date,
    },
    create: {
      id: PAST_RUN_RAVE.id,
      title: PAST_RUN_RAVE.title,
      date: PAST_RUN_RAVE.date,
      time: PAST_RUN_RAVE.time,
      distance: PAST_RUN_RAVE.distance,
      location: PAST_RUN_RAVE.location,
      images: [...PAST_RUN_RAVE.images],
    },
  });

  await db.event.upsert({
    where: { id: UPCOMING_RUN_RAVE.id },
    update: {},
    create: {
      id: UPCOMING_RUN_RAVE.id,
      title: UPCOMING_RUN_RAVE.title,
      date: UPCOMING_RUN_RAVE.date,
      time: UPCOMING_RUN_RAVE.time,
      distance: UPCOMING_RUN_RAVE.distance,
      location: UPCOMING_RUN_RAVE.location,
      images: [...UPCOMING_RUN_RAVE.images],
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });

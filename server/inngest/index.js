import { Inngest } from "inngest";
import User from "../models/user.js";

export const inngest = new Inngest({
  id: "pingup-app",
});

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [
      {
        event: "clerk/user.created",
      },
    ],
  },
  async ({ event }) => {
    console.log("STEP 1");

    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    console.log("STEP 2");

    const email = email_addresses[0].email_address;

    let username = email.split("@")[0];

    console.log("STEP 3");

    const existingUser = await User.findOne({ username });

    console.log("STEP 4");

    if (existingUser) {
      username += Math.floor(Math.random() * 10000);
    }

    console.log("STEP 5");

    await User.create({
      _id: id,
      email,
      full_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      profile_picture: image_url,
      username,
    });

    console.log("STEP 6");
  }
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      full_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      profile_picture: image_url,
    });
  },
);

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    await User.findByIdAndDelete(event.data.id);
  },
);

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];

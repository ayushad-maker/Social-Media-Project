import { Inngest } from "inngest";
import User from "../models/user.js";
import { serve } from "inngest/express";

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
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const email = email_addresses[0].email_address;

    let username = email.split("@")[0];

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      username += Math.floor(Math.random() * 10000);
    }

    await User.create({
      _id: id,
      email,
      full_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      profile_picture: image_url,
      username,
    });
  }
);

export const functions = [syncUserCreation];
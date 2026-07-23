import { Inngest } from "inngest";
import User from "../models/user.js";
import Connection from "../models/Connections.js";

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

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

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
  },
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

//Ingest function to send Reminder when a new connection request is added
const sendConnectionsRequestReminder = inngest.createFunction(
  {
    id: "send-new-connection-request-reminder",
    triggers: [
      {
        event: "app/connection-request",
      },
    ],
  },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-connection-request-mail", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );

      const subject = "👋 New Connection Request";

      const body = `
<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Hi ${connection.to_user_id.full_name},</h2>

  <p>
    You have a new connection request from
    ${connection.from_user_id.full_name} - @${connection.from_user_id.username}
  </p>

  <p>
    Click
    <a
      href="${process.env.FRONTEND_URL}/connections"
      style="color:#10b981;"
    >
      here
    </a>
    to accept or reject the request.
  </p>

  <br />

  <p>
    Thanks,<br />
    PingUp - Stay Connected
  </p>
</div>
`;

      // send email here
      // await sendMail({
      //   to: connection.to_user_id.email,
      //   subject,
      //   html: body,
      // });
    });
  }
);

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];

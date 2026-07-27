import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connections.js";
import sendEmail from "../config/nodeMailer.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";

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
const sendNewConnectionsRequestReminder = inngest.createFunction(
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

    // Send initial email
    await step.run("send-connection-request-mail", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id",
      );

      if (!connection) return;

      const subject = "👋 New Connection Request";

      const body = `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>Hi ${connection.to_user_id.full_name},</h2>

        <p>
          You have a new connection request from
          <strong>${connection.from_user_id.full_name}</strong>
          (@${connection.from_user_id.username})
        </p>

        <p>
          <a href="${process.env.FRONTEND_URL}/connections">
            Click here
          </a>
          to accept or reject the request.
        </p>

        <p>Thanks,<br/>PingUp Team</p>
      </div>
      `;

      await sendEmail(connection.to_user_id.email, subject, body);
    });

    // Wait 24 hours
    await step.sleepUntil(
      "wait-for-24-hours",
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );

    // Reminder email
    await step.run("send-connection-request-reminder", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id",
      );

      if (!connection) return;

      if (connection.status === "accepted") {
        return;
      }

      const subject = "⏰ Reminder: Pending Connection Request";

      const body = `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>Hi ${connection.to_user_id.full_name},</h2>

        <p>
          You still have a pending connection request from
          <strong>${connection.from_user_id.full_name}</strong>
          (@${connection.from_user_id.username}).
        </p>

        <p>
          <a href="${process.env.FRONTEND_URL}/connections">
            Click here
          </a>
          to respond.
        </p>

        <p>Thanks,<br/>PingUp Team</p>
      </div>
      `;

      await sendEmail(connection.to_user_id.email, subject, body);
    });
  },
);

//story delete after 24hr

const deleteStory = inngest.createFunction(
  {
    id: "story-delete",
    triggers: [
      {
        event: "app/story.delete",
      },
    ],
  },
  async ({ event, step }) => {
    const { storyId } = event.data;
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24-hours", in24Hours);
    await step.run("delete-story", async () => {
      await Story.findByIdAndDelete(storyId);
      return { message: "Story deleted" };
    });
  },
);

const sendNotificationOfUnseenMessages = inngest.createFunction(
  {
    id: "send-unseen-messages-notification",
    triggers: [
      {
        cron: "TZ=America/New_York 0 9 * * *",
      },
    ],
  },
  async () => {
    const messages = await Message.find({ seen: false }).populate("to_user_id");

    const unseenCount = {};

    messages.forEach((message) => {
      unseenCount[message.to_user_id._id] =
        (unseenCount[message.to_user_id._id] || 0) + 1;
    });

    for (const userId in unseenCount) {
      const user = await User.findById(userId);

      const subject = `📬 You have ${unseenCount[userId]} unseen messages`;

      const body = `
<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Hi ${user.full_name},</h2>
    <p>You have ${unseenCount[userId]} unseen messages</p>
    <p>
        Click
        <a href="${process.env.FRONTEND_URL}/messages" style="color: #10b981;">
            here
        </a>
        to view them
    </p>
    <br/>
    <p>Thanks,<br/>PingUp - Stay Connected</p>
</div>
`;

      await sendEmail({
        to: user.email,
        subject,
        body,
      });
    }

    return { message: "Notifications sent" };
  },
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionsRequestReminder,
  deleteStory,
  sendNotificationOfUnseenMessages,
];

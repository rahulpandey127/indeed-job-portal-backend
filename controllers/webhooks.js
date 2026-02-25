import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller Function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    //Create a Svix instance with your secret key
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    //Verifying Headers
    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    //Getting data from request body
    const { data, type } = req.body;
    console.log(type);
    //Switch case for different events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };
        // await User.create(userData);

        let user = new User(userData);
        await user.save();
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "webhooks error" });
  }
};

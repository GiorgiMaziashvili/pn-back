require("dotenv").config();
const express = require("express");
const webPush = require("web-push");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// 🔑 Set VAPID Keys (Replace these with your generated keys)
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webPush.setVapidDetails("mailto:giorgi.maziashvili96@gmail.com", vapidKeys.publicKey, vapidKeys.privateKey);
// webPush.setVapidDetails("mailto:your-email@example.com", vapidKeys.publicKey, vapidKeys.privateKey);

let subscriptions = [];

// 📌 Store Subscription
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscribed successfully!" });
});

app.get('/test',(req,res) => {
    res.status(200).json({message: "Hello"})
})

// 📌 Send Push Notification
app.post("/send-notification", async (req, res) => {
    const query = req.query
    const payload = JSON.stringify({ 
        title: query.title ?? "Hello!", 
        body: query.body ?? "This is a test notification.",
        url:"https://pn-front.onrender.com/test",
    });

  subscriptions.forEach((sub) => {
    webPush.sendNotification(sub, payload).catch((err) => console.error(err));
  });

  res.json({ message: "Push notification sent!" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

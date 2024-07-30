import connectToMongo from './subsdb.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import bodyParser from 'body-parser';
import payment from "./routes/payment.js";
import { ObjectId } from 'mongodb'; 
import schedule from 'node-schedule'; // For scheduling tasks

dotenv.config();
const app = express();
const port = process.env.PORT || 6001;
connectToMongo();
app.use(cors({
  origin: 'https://mytwittercloneat.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());

const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@twitter.mlrbwnq.mongodb.net/?appName=twitter`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
 const postCollection = client.db("database").collection('posts');
 export const userCollection = client.db("database").collection('users'); 

async function run() {
  try {
    await client.connect();
                                                       
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Fetch posts
    app.get('/post', async (req, res) => {
      const post = (await postCollection.find().toArray()).reverse();
      res.send(post);
    });

    // Fetch users
    app.get('/user', async (req, res) => {
      const user = await userCollection.find().toArray();
      res.send(user);
    });

    // Fetch logged in user by email
    app.get('/loggedInUser', async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.find({ email: email }).toArray();
      res.send(user);
    });

    // Fetch posts by user email
    app.get('/userPost', async (req, res) => {
      const email = req.query.email;
      const post = (await postCollection.find({ email: email }).toArray()).reverse();
      res.send(post);
    });

    // Add post
    app.post('/post', async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });

    // Register user
    app.post("/register", async (req, res) => {
      console.log("Received registration request:", req.body);
      const { username, name, email, photoURL,  phone, browser, os, device, ip,firebaseUid} = req.body;

      try {
        // Check if user already exists
        let user = await userCollection.findOne({ email: email });
        console.log("Existing user:", user);

        let result;
        if (user) {
          // Update existing user
          result = await userCollection.updateOne(
            { _id: user._id },
            {
              $set: {
                firebaseUid: firebaseUid,
                name: name,
                username: username,
                photoURL: photoURL,
                lastLogin: new Date(),
              },
            }
          );
          console.log("Update result:", result);
        } else {
          // Create new user
          const newUser = {
            email: email,
            name: name,
            username: username,
            photoURL: photoURL,
            phone,
            browser,
            os,
            device,
            ip,
            createdAt: new Date(),
            lastLogin: new Date(),
            subscription: {
              plan: "Free Plan",
              startDate: new Date(),
              endDate: null,
              status: "active",
            },
          };

          result = await userCollection.insertOne(newUser);
          console.log("Insert result:", result);
        }

        res.status(200).json({
          success: true,
          message: "User registered successfully",
          result,
        });
      } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred during registration",
          error: error.toString(),
        });
      }
  });

    // API to update user's subscription
    app.post("/update-subscription", async (req, res) => {
      try {
        console.log("Received update subscription request:", req.body);
        const { userId, plan, amount } = req.body;

        if (!userId || !plan || amount === undefined) {
          console.error("Missing required fields:", { userId, plan, amount });
          return res
            .status(400)
            .json({ success: false, message: "Missing required fields" });
        }

        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              "subscription.plan": plan,
              "subscription.amount": amount,
              "subscription.startDate": new Date(),
              "subscription.status": "active",
            },
          }
        );
        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        // Fetch the updated user document
        const updatedUser = await userCollection.findOne({
          _id: new ObjectId(userId),
        });

        console.log("Updated user subscription:", updatedUser.subscription);
        res.json({ success: true, subscription: updatedUser.subscription });
      } catch (error) {
        console.error("Detailed error in update-subscription:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    });

    // Update user
    app.patch('/userUpdates/:email', async (req, res) => {
      const filter = { email: req.params.email };
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Login user
    app.post('/login', async (req, res) => {
      const userInfo = req.body;
      await userCollection.updateOne(
        { email: userInfo.email },
        { $set: { lastLogin: new Date() } }
      );
      res.send({ success: true, message: 'User login tracked successfully', data: userInfo });
    });

    // Schedule a task to log out users who haven't been active for 7 days
    schedule.scheduleJob('0 0 * * *', async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const result = await userCollection.updateMany(
        { 
          lastLogin: { $lt: sevenDaysAgo },
          device: { $ne: 'desktop' } 
        },
        { $set: { subscription: { status: "inactive" } } }
      );
      console.log(`Logged out ${result.modifiedCount} users due to inactivity.`);
    });

  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello everyone!');
});


app.use("/api/payment", payment);

app.listen(port, () => {
  console.log(`Twitter   app listening on port ${port}`);
});

import express from 'express';
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendReceiptEmail } from '../services/emailService.js';
import { ObjectId } from 'mongodb';
import Payment from '../models/payment.js'
import {userCollection} from '../index.js'
dotenv.config();

const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

//// ROUTE 1 : Create Order Api Using POST Method http://localhost:5000/api/payment/subscribe
router.post("/subscribe", (req, res) => {
    var { amount } = req.body;
  
       // Define a minimum amount
       const MINIMUM_AMOUNT = 10; // Example: Minimum amount of 100 INR

       // Check if amount is below minimum allowed
       if (!amount || amount < MINIMUM_AMOUNT) {
           return res.status(400).json({ message: `Order amount must be at least ${MINIMUM_AMOUNT} INR.` });
       }

    try {
      const options = {
        amount: Number(amount * 100),
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
      };
  
      razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Something Went Wrong!" });
        }
        res.status(200).json({ data: order });
        console.log(order);
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }
  });
  // ROUTE 2 : Create Verify Api Using POST Method http://localhost:5000/api/payment/verify
router.post("/verify", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } =
      req.body;
  
        // Check if userId is defined
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
  }

    console.log("req.body", req.body);
  
    try {
      // Create Sign
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
  
      // Create ExpectedSign
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
  
      // console.log(razorpay_signature === expectedSign);
  
      // Create isAuthentic
      const isAuthentic = expectedSign === razorpay_signature;
  
      // Condition
      if (isAuthentic) {
        const payment = new Payment({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });
  
        // Save Payment
        await payment.save();
  
        // Fetch User email and plan details
        const user = await userCollection.findOne({
          _id: new ObjectId(userId),
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const planDetails = {
          name: user.subscription ? user.subscription.plan : "No Plan",
          amount: user.subscription ? user.subscription.amount : 0,
          period: user.subscription ? user.subscription.period : "No Period",
        };
  
        //send reciept email
        await sendReceiptEmail(user.email, planDetails, {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        });
  
        // Send Message
        res.json({
          message: "Payment Successfully",
        });
      }else {
        res.status(400).json({ message: "Invalid signature" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }
  });
export default router;
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function SubscribeCard({
  plan,
  monthlyAmount,
  yearlyAmount,
  features,
  popular,
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const amount = selectedPeriod === "monthly" ? monthlyAmount : yearlyAmount;
  const [loggedInUser] = useLoggedInUser();
  const [refresh, setRefresh] = useState(false);
  const { t } = useTranslation();

  // handlePayment Function
  const handlePayment = async () => {
    console.log("LoggedInUser:", loggedInUser[0]._id);
    try {
      const res = await fetch(`https://twitter-dd3q.onrender.com/api/payment/subscribe`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          amount,
          period: selectedPeriod,
          userId: loggedInUser[0]._id,
        }),
      });

      const data = await res.json();
      console.log(data);
      handlePaymentVerify(data.data);

      const user = {
        userId: loggedInUser[0]._id,
        plan: plan,
        amount: amount,
        period: selectedPeriod,
      };
      console.log("Sending update request with data:", user);
      const updateSubscription = await axios.post(
        `https://twitter-dd3q.onrender.com/update-subscription`,
        user
      );
      console.log("Update subscription response:", updateSubscription.data);
    } catch (error) {
      console.log(error);
    }
  };

  // handlePaymentVerify Function
  const handlePaymentVerify = async (data) => {
    const options = {
      key:"rzp_test_6XkDrIL7tOaTBK",
      amount: data.amount,
      currency: data.currency,
      name: "xwitter",
      description: "Test Mode",
      order_id: data.id,
      handler: async (response) => {
        console.log("response", response);

        try {
          const res = await fetch(`https://twitter-dd3q.onrender.com/api/payment/verify`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: loggedInUser[0]._id,
            }),
          });

          const verifyData = await res.json();
          console.log(verifyData);

          if (verifyData.message) {
            toast.success(verifyData.message);
          }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#4b4d4b",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <Card
      sx={{
        width: "100%", // or set a specific width, e.g., '600px'
        maxWidth: "530px",
        minWidth: "175px",
        margin: "20px",
        backgroundColor: "black",
        border: popular ? "2px solid #1DA1F2" : "1px solid rgb(83,85,85)",
        borderRadius: "10px",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 4px 20px rgba(29, 161, 242, 0.4)",
          cursor: "pointer",
        },
      }}
    >
      {popular && (
        <Typography
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#1DA1F2",
            color: "white",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "0.8rem",
          }}
        >
          {t("Most Popular")}
        </Typography>
      )}

      {loggedInUser?.subscription?.plan === plan && (
        <Typography
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#1DA1F2",
            color: "white",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "0.8rem",
          }}
        >
          {t("current plan")}
        </Typography>
      )}

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 24, color: "white", fontWeight: "bold" }}>
            {plan}
          </Typography>
          <Typography variant="h4" component="div" sx={{ color: "white" }}>
            ₹{amount}
            <Typography
              component="span"
              sx={{ fontSize: "1rem", color: "gray" }}
            >
              /{selectedPeriod === "monthly" ? t("month") : t("year")}
            </Typography>
          </Typography>
        </Box>
        <ButtonGroup sx={{ mb: 2 }}>
          <Button
            onClick={() => setSelectedPeriod("monthly")}
            variant={selectedPeriod === "monthly" ? "contained" : "outlined"}
            sx={{ color: "white" }}
          >
            {t("Monthly")}
          </Button>
          <Button
            onClick={() => setSelectedPeriod("yearly")}
            variant={selectedPeriod === "yearly" ? "contained" : "outlined"}
            sx={{ color: "white" }}
          >
            {t("Yearly")}
          </Button>
        </ButtonGroup>

        <List>
          {features.map((feature, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon>
                <CheckIcon sx={{ color: "#1DA1F2" }} />
              </ListItemIcon>
              <ListItemText primary={feature} sx={{ color: "gray" }} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#1DA1F2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1a91da",
            },
          }}
          onClick={handlePayment}
        >
          {loggedInUser?.subscription?.plan === plan
            ? t("Subscribed")
            : t("Subscribe Now")}
        </Button>
      </CardActions>
    </Card>
  );
}

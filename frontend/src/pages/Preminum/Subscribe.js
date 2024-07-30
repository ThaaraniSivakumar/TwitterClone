import React from "react";
import "./Subscribe.css";
import SubscribeCard from "./SubscribeCard";
import { useTranslation } from "react-i18next";
import { Typography, Container, Grid } from "@mui/material";

const Subscribe = () => {
  const { t } = useTranslation();

  const plans = [
    {
      plan: t("Twitter Plus"),
      monthlyAmount: 99,
      yearlyAmount: 999,
      features: [
        t("All Free features"),
        t("Ability to edit tweets within 30 minutes"),
        t("Exclusive color themes"),
        t("Priority customer support"),
      ],
      popular: false,
    },
    {
      plan: t("Twitter Pro"),
      monthlyAmount: 199,
      yearlyAmount: 1999,
      features: [
        t("All Plus features"),
        t("Increased character limit (400 characters)"),
        t("Ability to upload higher quality images and videos"),
        t("Early access to new features"),
        t("Verified user badge"),
      ],
      popular: true,
    },
    {
      plan: t("Twitter Premium"),
      monthlyAmount: 299,
      yearlyAmount: 2999,
      features: [
        t("All Pro features"),
        t("Unlimited bookmarks"),
        t("Advanced analytics for your tweets"),
        t("Ability to create exclusive content for subscribers"),
        t("Ad-free experience extends to embedded tweets on other websites"),
        t("Priority ranking in search results and replies"),
      ],
      popular: false,
    },
  ];

  return (
    <Grid
      container
      direction="row"
      spacing={3}
      alignItems="center"
      sx={{ mt: 4, me: 6 }}
      className="subscribe"
    >
      {plans.map((plan, index) => (
        <Grid item xs={12} key={index}>
          <SubscribeCard {...plan} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Subscribe;

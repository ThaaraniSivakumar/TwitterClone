import React from "react";
import '../page.css';
import { useTranslation } from "react-i18next";

const Communities = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
    <h2 className="pageTitle">{t("Welcome to Communities")}</h2>
  </div>
  );
};

export default Communities;

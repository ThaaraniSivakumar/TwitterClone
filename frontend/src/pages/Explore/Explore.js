import React from "react";
import '../page.css'
import { useTranslation } from "react-i18next";
const Explore = () =>{
  const { t } = useTranslation();
    return(
          <div className="page">
            <h2 className="pageTitle">{t("Welcome to Explore")}</h2>
          </div>
    )
}
export default Explore;
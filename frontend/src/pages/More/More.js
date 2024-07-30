// More.js
import React from "react";
import '../page.css';
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

const More = () => {
  const { t } = useTranslation();
    return (
      
        <div className="page" style={{flexDirection:"column"}}> 
            <LanguageSwitcher />
        </div>
    );
};

export default More;

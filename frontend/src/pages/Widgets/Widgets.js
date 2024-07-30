import './Widgets.css'
import React from "react";
import {TwitterTimelineEmbed, TwitterTweetEmbed} from 'react-twitter-embed'
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import './Widgets.css'
import '../More/i18n.js'
const Widgets = () =>{
  const { t } = useTranslation();
    return(
      <div className="widgets">
        <div className="widgets_input">
       < SearchIcon className='widgets_searchIcon'/>
       <input className='input' type="text" placeholder={t('Search')}/>
        </div>
        <div className="widgets_widgetContainer">
            <h2>{t("What's Happening?!")}</h2>
            <TwitterTweetEmbed
  tweetId={'1557187138352861186'}
/> 
<TwitterTimelineEmbed sourceType='profile' screenName='elonmusk' options={{height:400}}/>
        </div>
      
      </div>
    )
}
export default Widgets;
// Sidebar.js
import React, { useState } from "react";
import './Sidebar.css';
import SidebarOptions from './SidebarOptions';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PeopleIcon from '@mui/icons-material/People';
import XIcon from '@mui/icons-material/X';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoneIcon from '@mui/icons-material/Done';
import CustomLink from './CustomLink.js';
import '../More/i18n.js'
import useLoggedInUser from "../../hooks/useLoggedInUser.js";
import { Button, Avatar, IconButton, Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";

const Sidebar = ({ handleLogout, user }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [loggedInUser] = useLoggedInUser();
  const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';

  const handleClick = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const result = user[0]?.email ? user[0]?.email.split('@')[0] : "nullclass";
  console.log(user)

  return (
    <div>
      <div className="sidebar">
        <XIcon className="sidebar_twitterIcon" />
        <CustomLink to='/home/feed'><SidebarOptions active Icon={HomeIcon} text={t('Home')} /></CustomLink>
        <CustomLink to='/home/explore'><SidebarOptions active Icon={SearchIcon} text={t('Explore')} /></CustomLink>
        <CustomLink to='/home/notifications'><SidebarOptions active Icon={NotificationsNoneIcon} text={t('Notifications')} /></CustomLink>
        <CustomLink to='/home/messages'><SidebarOptions active Icon={MailOutlineIcon} text={t('Messages')} /></CustomLink>
        <CustomLink to='/home/bookmarks'><SidebarOptions active Icon={BookmarkBorderIcon} text={t('Bookmarks')} /></CustomLink>
        <CustomLink to='/home/communities'><SidebarOptions active Icon={PeopleIcon} text={t('Communities')} /></CustomLink>
        <CustomLink to='/home/premium'><SidebarOptions active Icon={XIcon} text={t('Subscribe')} /></CustomLink>
        <CustomLink to='/home/profile'><SidebarOptions active Icon={PermIdentityIcon} text={t('Profile')} /></CustomLink>
        <CustomLink to='/home/more'><SidebarOptions active Icon={MoreHorizIcon} text={t('Language')} /></CustomLink>
        <Button variant='outlined' className="sidbar_tweet">{t('post')}</Button>
        <div className="profile_info">
          <Avatar src={userProfilePic} />
          <div className="user_info">
            <div className="one">
              {
                loggedInUser && loggedInUser[0]?.name
                  ? loggedInUser[0]?.name
                  : user && user.displayName
                    ? user.displayName
                    : result 
              }
            </div>
            <div className="two">@{result}</div>
          </div>
          <IconButton size="small" sx={{ ml: 2 }}
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true" aria-expanded={openMenu ? "true" : undefined}
            onClick={handleClick}
          ><MoreHorizIcon /></IconButton>
          <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClick={handleClose} onClose={handleClose}>
            <MenuItem className="Profile_info1">
              <Avatar src={loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} />
              <div className="user_info subUser_info">
                <div className="sub">
                  <div className="one">
                    {
                      loggedInUser && loggedInUser[0]?.name
                        ? loggedInUser[0]?.name
                        : user && user.displayName
                          ? user.displayName
                          : result
                    }
                  </div>
                  <div className="two">@{result}</div>
                </div>
                <ListItemIcon className="done_icon"><DoneIcon /></ListItemIcon>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>{t('addAccount')}</MenuItem>
            <MenuItem onClick={handleLogout}>{t('logout', { username: result })}</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;





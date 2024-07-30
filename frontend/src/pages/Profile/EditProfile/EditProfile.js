import React from 'react';
import './EditProfile.css'
import { Box, IconButton, Modal, TextField } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const style ={
  position:'absolute',
  top:'50%',
  left:'50%',
  transform:'translate(-50%,-50%)',
  width:600,
  height:600,
  bgcolor:'background.paper',
  boxShadow:24,
  borderRadius:8,
}
function EditChild ({dob,setDob}){
  const [open,setOpen]=React.useState(false);
  const { t } = useTranslation();
  const handleOpen=()=>{
    setOpen(true);
  };
  const handleClose = ()=>{
    setOpen(false);
  };
  return(
    <React.Fragment>
      <div className='birthdate-section' onClick={handleOpen}>
        <text>{t('Edit')}</text>
      </div>
      <Modal hideBackdrop open={open} onClose={handleClose}  aria-labelledby="child-modal-title"
  aria-describedby="child-modal-description">
<Box sx={{...style,width:300,height:400}}>
<div className="text">
  <h2>{t( 'Edit date Of Birth?')}</h2>
  <p> {t('This can only be changed a few times. Make sure you enter the age of the person using account')}</p>
  <input type='date' onChange={e=>setDob(e.target.value)}></input>
  <button className='e-button'onClick={()=>{setOpen(false)}}>{t('cancel')}</button>
</div>
</Box>
      </Modal>
    </React.Fragment>
  )
}
export default function EditProfile ({user,LoggedInUser}){
  const { t } = useTranslation();
  const[open,setOpen]=React.useState(false);
  const[name,setName]=React.useState(false);
  const[bio,setBio]=React.useState(false);
  const[location,setLocation]=React.useState(false);
  const[website,setWebsite]=React.useState(false);
  const[dob,setDob]=React.useState(false);
const HandleSave=async()=>{
  const editdInfo={
      name,
      bio,
      location,
      website,
      dob,
  }
  if(editdInfo){
    await axios.patch(`https://twitter-dd3q.onrender.com/userUpdates/${user?.email}`,editdInfo)
    setOpen(false);
  }
 
}
    return (
   <div> 
     <button className='Edit-profile-btn' onClick={()=>setOpen(true)}>{t('Edit Profile')}</button>
     <Modal open={open}   aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description">
<Box sx={style} className='modal'>
<div className='header'>
  <IconButton onClick={()=>{setOpen(false)}}><CloseIcon/></IconButton>
  <h2 className='header-title'>{t('Edit Profile')}</h2>
  <button className='save-btn' onClick={HandleSave}>{t('Save')}</button>
</div>
<form className='fill-content'>
  <TextField className='text-field' fullWidth label={t('Name')} id='fullWidth' variant='filled' 
  onChange={(e)=>setName(e.target.value)} defaultValue={LoggedInUser[0]?.name?LoggedInUser[0].name:''}/>
    <TextField className='text-field' fullWidth label={t('Bio')} id='fullWidth' variant='filled' 
  onChange={(e)=>setBio(e.target.value)} defaultValue={LoggedInUser[0]?.bio?LoggedInUser[0].bio:''}/>
    <TextField className='text-field' fullWidth label={t('Location')} id='fullWidth' variant='filled' 
  onChange={(e)=>setLocation(e.target.value)} defaultValue={LoggedInUser[0]?.location?LoggedInUser[0].location:''}/>
    <TextField className='text-field' fullWidth label={t('Website')} id='fullWidth' variant='filled' 
  onChange={(e)=>setWebsite(e.target.value)} defaultValue={LoggedInUser[0]?.website?LoggedInUser[0].website:''}/>
</form>
<div className='birthdate-section'>
  <p>{t('Birth date')}</p>
  <p>.</p>
  <EditChild dob={dob} setDob={setDob}/>
</div>
<div className='last-section'>
  {
    LoggedInUser[0]?.dob?<h2>{LoggedInUser[0]?.dob}</h2>:<h2>{
      dob?dob:t('addYourDateOfBirth') }</h2>
  }
  <div className="last-btn">
    <h2>{t('Switch to Professional')}</h2>
    <ChevronRightIcon/>
  </div>
</div>
</Box>
     </Modal>
   </div>
    )
  }


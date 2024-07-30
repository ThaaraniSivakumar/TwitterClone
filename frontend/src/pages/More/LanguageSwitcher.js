import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../page.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import auth from '../../firebase.init.js';
import './i18n.js'

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation(); 
  const [theme, setTheme] = useState('default');
  const [showInputs, setShowInputs] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(''); 
  const [confirmationResult, setConfirmationResult] = useState(null); 

    useEffect(() => {
    const storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.getElementById('root').className = storedTheme;
    }
  }, []);

  useEffect(() => {
    document.getElementById('root').className = theme; 
  }, [theme]);

  const sendOtp = async () => {
    try {
      console.log('Setting up RecaptchaVerifier');
      const recaptcha = new RecaptchaVerifier(auth,'recaptcha',{
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA solved, response:', response);
        }});
      console.log('Sending OTP with phone number:', phone);
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      setConfirmationResult(confirmation);
      console.log(confirmation);
      setShowInputs(true);
      console.log('Auth instance:', auth);
console.log('Recaptcha element:', document.getElementById('recaptcha'));
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
  };
  
  const verifyOtp =async () => {
    try{
    if(otp.length===6 && confirmationResult){
      await confirmationResult.confirm(otp); 
      i18n.changeLanguage(selectedLanguage);
      updateTheme(selectedLanguage);
      alert('Language changed successfully');
      setConfirmationResult(null); 
      setShowInputs(false);
      setPhone('');
      setOtp('');
      setUser('');
      setSelectedLanguage('');
      updateTheme(selectedLanguage);
    }
    }catch(err){
      console.log(err)
    }
   
  };
   const updateTheme = (language) => {
    switch (language) {
      case 'en':
        setTheme('english-theme');
        localStorage.setItem('selectedTheme', 'english-theme');
        break;
      case 'es':
        setTheme('spanish-theme');
        localStorage.setItem('selectedTheme', 'spanish-theme');
        break;
      case 'hi':
        setTheme('hindi-theme');
        localStorage.setItem('selectedTheme', 'hindi-theme');
        break;
      case 'fr':
        setTheme('french-theme');
        localStorage.setItem('selectedTheme', 'french-theme');
        break;
      case 'ta':
        setTheme('tamil-theme');
        localStorage.setItem('selectedTheme', 'tamil-theme');
        break;
      case 'pt':
        setTheme('portuguese-theme');
        localStorage.setItem('selectedTheme', 'portuguese-theme');
        break;
      case 'bn':
        setTheme('bengali-theme');
        localStorage.setItem('selectedTheme', 'bengali-theme');
        break;
      default:
        setTheme('default');
        localStorage.setItem('selectedTheme', 'default');
    }
  };
  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    setShowInputs(true); 
  };
 
  return (
    <div className='language-container'>
      <div>
        <button style={{marginTop:'0px'}} className="language_tweet" onClick={() => handleLanguageClick('en')}>{t('English')}</button>
        <button className="language_tweet" onClick={() => handleLanguageClick('es')}>{t('Spanish')}</button>
        <button className="language_tweet" onClick={() => handleLanguageClick('hi')}>{t('Hindi')}</button>
        <button className="language_tweet" onClick={() => handleLanguageClick('fr')}>{t('French')}</button>
        <button className="language_tweet" onClick={() => handleLanguageClick('ta')}>{t('Tamil')}</button>
        <button className="language_tweet" onClick={() => handleLanguageClick('pt')}>{t('Portuguese')}</button>
        <button className="language_tweet" onClick={() => handleLanguageClick('bn')}>{t('Bengali')}</button>
      </div>

      {showInputs && (
        <div >
          <p style={{ fontSize: '13px' }}>To switch the language, please enter your phone number to get the OTP</p>
          <PhoneInput style={{width:'40%'}}
            country={'in'}
            value={phone}
            onChange={(phone) => setPhone("+" + phone)}
          />
          <button className="language_tweet" onClick={sendOtp}>{t('Send OTP')}</button>
          <div id="recaptcha"></div>
          <input
  className='language-input'
  type="text"
  placeholder="Enter OTP"
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
/>

{otp && otp.length === 6 && (
  <button className='lang-btn' onClick={verifyOtp}>{t('Verify OTP')}</button>
)}

        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;


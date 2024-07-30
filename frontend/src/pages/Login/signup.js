

import React, { useState, useEffect } from "react";
import X from '../../assests/X.png';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from "../../firebase.init";
import GoogleButton from 'react-google-button';
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import axios from "axios";
import UAParser from 'ua-parser-js';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [UserName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [showOtpFields, setShowOtpFields] = useState(false);
  const [isSafari, setIsSafari] = useState(false); // Add state for detecting Safari
  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

   // Function to check user status
   const checkUserStatus = async (email) => {
    try {
      const response = await axios.get(`https://twitter-dd3q.onrender.com/loggedInUser?email=${email}`);
      const userData = response.data[0];
      if (userData.subscription.status === "inactive") {
        alert("You have been logged out due to inactivity.");
        navigate('/login');
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    }
  };

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();
    const getIP = async () => {
      const res = await axios.get('https://api.ipify.org?format=json');
      return res.data.ip;
    };
    getIP().then(ip => {
      setUserInfo({
        browser: result.browser.name,
        os: result.os.name,
        device: result.device.type || 'desktop',
        ip: ip
      });

      // Show OTP fields if the device is a Mac
      if (result.browser.name === 'Safari') {
        setShowOtpFields(true);
        setIsSafari(true); // Set Safari detection state
      }      
      //if the user use mobile then this condition works
      if (result.device.type === 'mobile') {
        alert("Twitter will automatically log out after 7 days of inactivity.");
      }
    });
  }, []);

  useEffect(() => {
    if (user || googleUser) {
      const email = user ? user.user.email : googleUser.user.email;
      const name = user ? user.user.displayName : googleUser.user.displayName;
      const photoURL = user ? user.user.photoURL : googleUser.user.photoURL;
      const firebaseUid = user ? user.user.uid : googleUser.user.uid;
      const username = UserName;

      const newUser = {
        email: email,
        name: name,
        photoURL: photoURL,
        firebaseUid: firebaseUid,
        username: username
      };

      // Send user data to the backend
      axios.post("https://twitter-dd3q.onrender.com/register", newUser)
        .then(response => {
          console.log('User registered successfully:', response.data);
          navigate("/");
        })
        .catch(error => {
          console.error('Error registering user:', error);
        });
    }
  }, [user, googleUser]);

  useEffect(() => {
    const email = user ? user.user.email : googleUser ? googleUser.user.email : null;
    if (email) {
      checkUserStatus(email);
    }
  }, [user, googleUser]);


  useEffect(() => {
    console.log("User:", user);
    console.log("GoogleUser:", googleUser);
  
    if (user) {
      console.log("Email User:", user.user.email);
    }
    if (googleUser) {
      console.log("Google User:", googleUser.user.email);
    }
  
    if (user || googleUser) {
      navigate('/');
    }
  }, [user, googleUser, navigate]);
  

  const sendOtp = async () => {
    const recaptchaVerifier= new RecaptchaVerifier(auth,'recaptcha',{
      'size': 'invisible',
      'callback': (response) => {
        console.log('reCAPTCHA solved, response:', response);
      }});
    const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    setConfirmationResult(confirmation);
  };

  const verifyOtp = async () => {
    if (otp.length === 6 && confirmationResult) {
      try {
        await confirmationResult.confirm(otp);
        handleSubmit();
      } catch (err) {
        console.error('Error verifying OTP:', err);
      }
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    createUserWithEmailAndPassword(email, password);
    const user = {
      UserName: UserName,
      name: name,
      email: email,
      phone: phone,
      browser: userInfo.browser,
      os: userInfo.os,
      device: userInfo.device,
      ip: userInfo.ip,
    };
    console.log('User Information to be Sent to Backend:', user);

    try {
      const {data } = await axios.post('https://twitter-dd3q.onrender.com/register', user);
      console.log(data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleGoogleSignin = () => {
    signInWithGoogle();
  };

  return (
    <div className="login-container signup-container">
      <div className="image-container">
        <img className="image" src={X} alt="" />
      </div>
      <div className="signup-form">
        <div className="form-box">
          <h2 className="heading6">Happening Now</h2>
          <h3 className="heading7">Join Twitter Today</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="display-name"
              placeholder="@UserName"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input type="text"className="display-name" placeholder="Enter Full Name" onChange={(e) => setName(e.target.value)} />
            <input
              type="email"
              className='email'
              placeholder='Email address'
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className='password'
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
            {showOtpFields && (
              <>
                <input
                  type="tel"
                  className='display-name'
                  placeholder='Enter phone number to get OTP [+91 ########## ]'
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div id="recaptcha"></div>
                <div className='btn-login'>
                  <button
                    type='button'
                    style={{width:"77%",padding:"10px",borderRadius:"5px",backgroundColor:"black",color:"white"}}
                    onClick={sendOtp}
                  >
                    Send OTP
                  </button>
                </div>
                <input
                  type="text"
                  style={{ marginTop: '0px' }}
                  className='display-name'
                  placeholder='Enter OTP'
                  onChange={(e) => setOtp(e.target.value)}
                />
                <div className='btn-login'>
                  <button
                    type='button'
                    className='btn'
                    style={{ backgroundColor: 'black', color: 'white' }}
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}
            {!isSafari && (
  <button type='submit' className='btn'>Sign Up</button>
)}
          </form>
          <hr />
          <div className="google-button">
            <GoogleButton
              style={{ padding: '0 50px', margin: '10px 20px' }}
              className="g-btn"
              type="light"
              onClick={handleGoogleSignin}
            />
          </div>
          <div style={{ marginLeft: '20px' }}>
            Already have an account?
            <Link to='/login' style={{ textDecoration: 'none', color: 'skyblue', fontWeight: 600, marginLeft: '5px' }}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

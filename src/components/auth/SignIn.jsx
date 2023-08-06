import React, { useState } from 'react';
import { auth } from "../../firebase";
import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import AtomicSpinner from 'atomic-spinner';
import { TextField, InputAdornment, Button } from '@mui/material';
import { Phone, Send } from '@mui/icons-material';


export default function SignIn(props) {
  const [loading, setLoading] = useState(false);

  async function handleLogInClick(event) {

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(props.ph);
        // Make the GET request using Axios
        const response = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/get-orgs/+972${props.ph.slice(1)}`);
        // const response = await axios.get(`http://localhost:3001/api/organzations/get-orgs/+972${props.ph}`);
        console.log(response.data);
        if (response.data.result.length > 0) {
          props.onClick();
          props.setShowOTP(true);
          props.setManager(response.data.manager);
        } else {
          alert('מספר זה אינו עדכני במערכת, אנא פנו אלינו במייל או בפלפון (איש קשר: 0543257745)');
        }
        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }

  function handleSentCodeClick(event) {
    props.onOTPVerify();
    props.setShowOTP(true);
  }

  const removeSymbols = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, '');
  };

  return (
    <div>
      {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
      <div className="centered-container">
        <div className="m-3">
          {!props.showOTP && (<>
            <TextField
              style={{ direction: 'ltr' }}
              label="מספר פלפון"
              variant="outlined"
              value={props.ph}
              onChange={(e) => props.setPh(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <Button
              className="m-3"
              variant="contained"
              color="primary"
              startIcon={<Send />}
              onClick={handleLogInClick}
            >
              <span className="pe-3"> שלח קוד אימות </span>

            </Button>
          </>)
          }
          {props.showOTP && (
            <>
              <TextField
                className="m-3"
                style={{ direction: 'ltr' }}
                label="קוד אימות שנשלח לפלפון"
                variant="outlined"
                value={props.otp} onChange={(e) => props.setOtp(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <Button
                className="m-3"
                variant="contained"
                color="primary"
                startIcon={<Send />}
                onClick={handleSentCodeClick}
              >
                <span className="pe-3"> אמת </span>

              </Button>
            </>)
          }
          {/* {!props.showOTP && (
            <>
              <input type="text" placeholder="Phone number" value={props.ph} onChange={(e) => props.setPh(e.target.value)} />
              <button onClick={handleLogInClick}>Log In</button></>)
          } */}
          {/* {props.showOTP && (<>
            <input type="text" placeholder="OTP code" value={props.otp} onChange={(e) => props.setOtp(e.target.value)} />
            <button onClick={handleSentCodeClick}>Send Code</button>
          </>)} */}
        </div>
      </div>



    </div>
  );
}
import React, { useState } from 'react';
import { auth } from "../../firebase";
import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import AtomicSpinner from 'atomic-spinner';


export default function SignIn(props) {
  const [loading, setLoading] = useState(false);

  async function handleLogInClick(event) {

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(props.ph);
        // Make the GET request using Axios
        const response = await axios.get(`https://templates-api.myvarno.io/api/organzations/get-orgs/+972${props.ph}`);
        // const response = await axios.get(`http://localhost:3001/api/organzations/get-orgs/+972${props.ph}`);
        console.log(response.data);
        if ( response.data.length > 0) {
          props.onClick();
          props.setShowOTP(true);
        } else {
          alert('מספר זה אינו עדכני במערכת, אנא פנו אלינו במייל או בפלפון');
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

  return (
    <div>
      {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
      {!props.showOTP && (
        <>
          <input type="text" placeholder="Phone number" value={props.ph} onChange={(e) => props.setPh(e.target.value)} />
          <button onClick={handleLogInClick}>Log In</button></>)
      }
      {props.showOTP && (<>
        <input type="text" placeholder="OTP code" value={props.otp} onChange={(e) => props.setOtp(e.target.value)} />
        <button onClick={handleSentCodeClick}>Send Code</button>
      </>)}


    </div>
  );
}
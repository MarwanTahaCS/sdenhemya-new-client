import React, { useState } from 'react';
import { auth } from "../../firebase";
import firebase from 'firebase/app';
import 'firebase/auth';

export default function SignIn(props) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);



    function handleLogInClick(event){
        props.onClick();
        props.setShowOTP(true);
    }

    function handleSentCodeClick(event){
        props.onOTPVerify();
        props.setShowOTP(true);
    }
    
      return (
        <div>
          {/* {isCodeSent ? (
            <div>
              <input type="text" placeholder="Verification code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
              <button onClick={handleSignInWithCode}>Sign In</button>
            </div>
          ) : (
            <div>
              <input type="text" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <button onClick={handleSendCode}>Send Code</button>
            </div>
          )} */}
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
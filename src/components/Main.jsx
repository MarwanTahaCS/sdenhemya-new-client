import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useRouteMatch, NavLink } from 'react-router-dom';
import Axios from "axios";
import Fillable from "./Fillable";
import AddFormFieldToPdf from "./AddFormFieldsToPDF";
import '../index.css';

import SignIn from './auth/SignIn';
import { auth } from "../firebase.js";
import {
  RecaptchaVerifier, signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import AtomicSpinner from 'atomic-spinner';

import PdfSign from "./PdfSign";
import CreateOrg from "./CreateOrg";
import OrgsBoard from "./OrgsBoard";
import LoggedIn from "./LoggedIn";
import Org from "./Org";
import Bundle from "./Bundle";
import CreateTemplate from "./CreateNewTemplate";
import SentPage from './SentPage';

export default function Main(props) {

  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchAuth() {
      try {
        setLoading(true);

        await onAuthStateChanged(auth, (data) => {
          console.log(data);
          setUser(data);
          setLoading(false);
        });


      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchAuth();

  }, [])

  function onCaptchaVerify() {
    if (!window.recapchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          onSignup();
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        }
      });
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchaVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = '+972' + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success('Otp sended successfully!');
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult.confirm(otp).then(async (res) => {
      console.log(res)
      setUser(res.user)
      setLoading(false)
    }).catch(err => {
      console.log(err);
      setLoading(false);
    });
  }

  return (
    <div className="bg-light" style={{ height: '100%', textAlign: 'left' }}>
      {/* <Header switchLanguage={handleClick} /> */}
      {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
      {user && <nav dir="ltr" className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <NavLink className="navbar-brand" to="/">Template Manager</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink exact className="nav-link" to="/">Organizations</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/create-org">Create new organization</NavLink>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-sm mx-3" onClick={() => signOut(auth)} >Log out</button>

              </li>
            </ul>
          </div>
        </div>
      </nav>}

      <Routes>

        <Route path="/create-org" element=
          {<>
            {user ?
              <CreateOrg /> :
              <>
                {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
                <>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container" ></div>
                  <SignIn onClick={onSignup} ph={ph} setPh={setPh}
                    otp={otp} setOtp={setOtp}
                    showOTP={showOTP} setShowOTP={setShowOTP}
                    onOTPVerify={onOTPVerify} />
                </></>
            }
          </>}
        />

        <Route path="/" element=
          {<>
            {user ?
              <OrgsBoard phoneNumber={user.phoneNumber} /> :
              <>
                {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
                <>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container" ></div>
                  <SignIn onClick={onSignup} ph={ph} setPh={setPh}
                    otp={otp} setOtp={setOtp}
                    showOTP={showOTP} setShowOTP={setShowOTP}
                    onOTPVerify={onOTPVerify} />
                </></>
            }
          </>}
        />
        <Route path="/org/:key" element=
          {<>
            {user ?
              <Org /> :
              <>
                {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
                <>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container" ></div>
                  <SignIn onClick={onSignup} ph={ph} setPh={setPh}
                    otp={otp} setOtp={setOtp}
                    showOTP={showOTP} setShowOTP={setShowOTP}
                    onOTPVerify={onOTPVerify} />
                </></>
            }
          </>}
        />

        <Route path="/create-template/:key" element=
          {<>
            {user ?
              <CreateTemplate /> :
              <>
                {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
                <>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container" ></div>
                  <SignIn onClick={onSignup} ph={ph} setPh={setPh}
                    otp={otp} setOtp={setOtp}
                    showOTP={showOTP} setShowOTP={setShowOTP}
                    onOTPVerify={onOTPVerify} />
                </></>
            }
          </>}
        />


        {/* <Route path="/create-org" element={<CreateOrg />} /> */}
        {/* <Route path="/orgs" element={<OrgsBoard />} />
        <Route path="/org/:key" element={<Org />} />
        <Route path="/create-template/:key" element={<CreateTemplate />} /> */}

        <Route path="/template/:key" element={<PdfSign />} />
        <Route path="/bundle/:key" element={<Bundle />} />
        <Route path="/success/:key" element={ <SentPage />
          } />



        {/* <Route path="/success" element={<SentPage t={t} />} /> */}
      </Routes>

    </div>
  );
}

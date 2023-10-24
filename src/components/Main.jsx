import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useRouteMatch, NavLink } from 'react-router-dom';
import axios from "axios";
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
import Submitted from './Submitted';
import UpdateTemplate from './UpdateTemplate';
import NavBar from './NavBar';

export default function Main(props) {

  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [manager, setManager] = useState(false);

  useEffect(() => {
    async function fetchAuth() {
      try {
        setLoading(true);

        await onAuthStateChanged(auth, (data) => {
          console.log(data);
          setUser(data);
        });
        // const isManager = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/manager/${props.user}`);
        // setManager(isManager);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setLoadingAuth(false);
      }
    }

    fetchAuth();

    setLoadingAuth(false);

  }, []);

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
    <div className="bg-light" style={{ height: '100%' }}>
      {/* <Header switchLanguage={handleClick} /> */}
      {(loading||loadingAuth) && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
      {user && <NavBar user={user.phoneNumber} signOut={() => signOut(auth)} />}

      <Routes>

        <Route path="/create-org" element=
          {loadingAuth ?
            <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>
            :
            <>
              {user ?
                <CreateOrg /> :
                <>
                  {loading ? <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div> :
                    <>
                      <Toaster toastOptions={{ duration: 4000 }} />
                      <div id="recaptcha-container" ></div>
                      <SignIn onClick={onSignup} ph={ph} setPh={setPh}
                        otp={otp} setOtp={setOtp}
                        showOTP={showOTP} setShowOTP={setShowOTP}
                        onOTPVerify={onOTPVerify} setManager={setManager} />
                    </>}
                </>
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
                    onOTPVerify={onOTPVerify} setManager={setManager} />
                </></>
            }
          </>}
        />
        <Route path="/org/:key" element=
          {<>
            {user ?
              <Org user={user.phoneNumber} /> :
              <>
                {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
                <>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container" ></div>
                  <SignIn onClick={onSignup} ph={ph} setPh={setPh}
                    otp={otp} setOtp={setOtp}
                    showOTP={showOTP} setShowOTP={setShowOTP}
                    onOTPVerify={onOTPVerify} setManager={setManager} />
                </></>
            }
          </>}
        />

        <Route path="/submitted/:key" element=
          {<>
            {user ?
              <Submitted /> :
              <>
                {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
                <>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container" ></div>
                  <SignIn onClick={onSignup} ph={ph} setPh={setPh}
                    otp={otp} setOtp={setOtp}
                    showOTP={showOTP} setShowOTP={setShowOTP}
                    onOTPVerify={onOTPVerify} setManager={setManager} />
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
                    onOTPVerify={onOTPVerify} setManager={setManager} />
                </></>
            }
          </>}
        />

        <Route path="/update-doc/:key" element=
          {<>
            {user ?
              <UpdateTemplate /> :
              <>
                {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}
                <>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container" ></div>
                  <SignIn onClick={onSignup} ph={ph} setPh={setPh}
                    otp={otp} setOtp={setOtp}
                    showOTP={showOTP} setShowOTP={setShowOTP}
                    onOTPVerify={onOTPVerify} setManager={setManager} />
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
        <Route path="/success/:key" element={<SentPage />
        } />



        {/* <Route path="/success" element={<SentPage t={t} />} /> */}
      </Routes>

    </div>
  );
}

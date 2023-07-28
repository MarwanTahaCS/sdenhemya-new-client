import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Axios from "axios";
import Fillable from "./Fillable";
import AddFormFieldToPdf from "./AddFormFieldsToPDF";

import PdfSign from "./PdfSign";


export default function App(props) {

  const [inputFields, setInputFields] = useState([]);

  useEffect(() => {
    console.log(["from app",inputFields]);
  }, [inputFields])

  const localUrl = "http://localhost:3001/api/documentSign/";
  // const localUrl = "https://yelotapi.myvarno.io/api/documentSign";

  async function saveData(newDocumentData) {
    try {
      console.log("in save data class")
      const response = await Axios.post(localUrl, newDocumentData)
      console.log(localUrl);
      console.log(response);
    }
    catch (err) {
      console.log(err);
    }

  }

  function handleInputFieldsChange(inputFields){
    setInputFields(inputFields);
  }


  

  return (
    <div className="bg-light">
      {/* <Header switchLanguage={handleClick} /> */}

        <Routes>
          <Route exact path="/" element=
            {
              <AddFormFieldToPdf handleInputFieldsChange={handleInputFieldsChange}  />
            } />

             <Route path="/:key" element={<PdfSign inputFields={inputFields} />} />
          
          {/* <Route path="/success" element={<SentPage t={t} />} /> */}
        </Routes>

    </div>
  );
}

import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Axios from "axios";
import Fillable from "./Fillable";
import AddFormFieldToPdf from "./AddFormFieldsToPDF";

import PdfSign from "./PdfSign";


export default function App(props) {

  useEffect(() => {

  }, [])

  // const localUrl = "http://localhost:3001/api/documentSign/";
  const localUrl = "https://api.myvarno.io/api/documentSign";

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


  var inputs = [
    { x: 2, y: 0.359375, value: '[object Object]', page: 1, isCursor: false, click: {x: 1.3007438894792773, y: 0.23387428101889896} },
    { x: 1, y: 2.359375, value: '[object Object]', page: 2, isCursor: false, click: {x: 0.6503719447396387, y: 1.5354354971240758} },
    {x: 273, y: 327.359375, value: '[object Object]', page: 1, isCursor: false, click: {x: 177.55154091392137, y: 213.03913311421528}},
    {x: 462, y: 328.359375, value: '[object Object]', page: 1, isCursor: false, click: {x: 300.4718384697131, y: 213.6899137222679}},
  ];

  return (
    <div className="bg-light">
      {/* <Header switchLanguage={handleClick} /> */}

      <Router>
        <Routes>
          <Route exact path="/" element=
            {
              <AddFormFieldToPdf />
            } />
          <Route path="/FillDocument" element={<PdfSign inputs={inputs} />} />
          {/* <Route path="/success" element={<SentPage t={t} />} /> */}
        </Routes>
      </Router>

    </div>
  );
}

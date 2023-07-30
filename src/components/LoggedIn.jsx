
import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AddFormFieldToPdf from "./AddFormFieldsToPDF";

import CreateOrg from "./CreateOrg";
import OrgsBoard from "./OrgsBoard";
import Org from "./Org";
import CreateTemplate from "./CreateNewTemplate";


export default function LoggedIn(props) {


  return (
    <div className="bg-light">

      <Routes>
        <Route exact path="/" element={<AddFormFieldToPdf />} />

        {/* <Route path="/create-org" element={<CreateOrg />} />
        <Route exact path="/orgs" element={<OrgsBoard />} />
        <Route path="/org/:key" element={<Org />} />
        <Route path="/create-template/:key" element={<CreateTemplate />} /> */}

      </Routes>

    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOrg = () => {
  const [orgName, setOrgName] = useState('');
  const [orgMembers, setOrgMembers] = useState('');

  const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();

    // const localUrl = "http://localhost:3001/api/organzations/createorg/";
    const localUrl = `${window.AppConfig.serverDomain}/api/organzations/createorg/`;

    const formData = {
        orgName: orgName,
        orgMembers: orgMembers,
      };
    // Add more fields as needed

    try {
      const response = await axios.post(localUrl, formData);

      console.log(response.data.orgID);
      
      navigate('/');

      // Do something with the response if needed
    } catch (error) {
      console.error('Error:', error);
    }

    
  };

  return (
    <form className="container" dir="ltr" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="org-name">Organization Name:</label>
        <input
          type="text"
          id="org-name"
          className='form-control'
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="org-members">Organization Members:</label>
        <input
          type="text"
          id="org-members"
          className='form-control'
          value={orgMembers}
          onChange={(e) => setOrgMembers(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-sm mx-3">Submit</button>
    </form>
  );
};

export default CreateOrg;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AtomicSpinner from 'atomic-spinner';
import { Typography, Card, CardContent } from '@mui/material';

const OrgsBoard = (props) => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    // Function to fetch data from the backend server
    const fetchData = async () => {
      try {
        setLoading(true);
        // Make the GET request using Axios
        const response = await axios.get(`https://templates-api.myvarno.io/api/organzations/get-orgs/${props.phoneNumber}`);
        // const response = await axios.get(`http://localhost:3001/api/organzations/get-orgs/${props.phoneNumber}`);
        console.log(response.data);
        setOrgs(response.data); // Update the state with the fetched data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();

  }, []);

  return (
    <div style={{ direction: 'ltr' }}>

      {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}

      

      <div className="container">
      <h1>Organizations</h1>
        {
          orgs.map((org, index) => (
            <Card key={index} style={{ marginBottom: '10px' }} onClick={()=>navigate(`/org/${org.orgID}`)}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {org.orgName}
                </Typography>
                <Typography color="text.secondary">
                  <b>Org ID:</b> {org.orgID}<br /><br />
                  <b>Members:</b> {org.members.map((member, index) => <div key={index}>{`${index}: ${member}`}<br /></div>)}<br />
                  <b>Templates:</b> {org.templates.map((template, index) => <div key={index}>{`${index}: ${template.name}`}<br /></div>)}
                </Typography>
                {/* Add more card content based on your item data */}
              </CardContent>
            </Card>
          )
          )}
      </div>


    </div>
  );
};

export default OrgsBoard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AtomicSpinner from 'atomic-spinner';
import { Typography, Card, CardContent} from '@mui/material';

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
        const response = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/get-orgs/${props.phoneNumber}`);
        // const response = await axios.get(`http://localhost:3001/api/organzations/get-orgs/${props.phoneNumber}`);
        console.log(response.data.result);
        setOrgs(response.data.result); // Update the state with the fetched data
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
    <div style={{ direction: 'rtl',textAlign:"right" }}>

      {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}



      <div className="container">
        <h1>ארגונים</h1>
        <h6>בחר ארגון:</h6>
        {
          orgs.map((org, index) => (
            <Card key={index} style={{ marginBottom: '10px' }} onClick={() => navigate(`/org/${org.orgID}`)}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {org.orgName} <span> ({org.orgID}) </span>
                </Typography>
                <Typography color="text.secondary">
                  <b>משתמשים:</b> {org.members.map((member, index) => <div key={index}>{` ${member}`}<br /></div>)}<br />
                  {/* <b>Templates:</b> {org.templates.map((template, index) => <div key={index}>{` ${template.name}`}<br /></div>)} */}
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

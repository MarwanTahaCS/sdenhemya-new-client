import React, { useState, useEffect } from 'react';
import axios from "axios";
import { NavLink } from 'react-router-dom';

function CounterComponent(props) {

    const [manager, setManager] = useState(false);

    useEffect(() => {
        async function fetchAuth() {
            try {

                const isManager = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/manager/${props.user}`);
                setManager(isManager);
                console.log(isManager.data);
                console.log(props.user);

            } catch (err) {
                console.error(err);

            }
        }

        fetchAuth();

    }, [])

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">

          <NavLink className="navbar-brand" to="/"><img src="/logo-transparent.png" height="50" alt="varno logo" /></NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink exact className="nav-link" to="/">ארגונים</NavLink>
              </li>
              {manager && <li className="nav-item">
                <NavLink className="nav-link" to="/create-org">צור ארגון חדש</NavLink>
              </li>}

            </ul>
            <ul class="navbar-nav me-auto">
              <li className="nav-item">
                <button className="btn btn-danger btn-sm mx-1" onClick={props.signOut} >התנתק</button>

              </li>
            </ul>

          </div>
        </div>
      </nav>
    );
}

export default CounterComponent;

import * as React from "react";
import {useParams} from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'


const SentPage = (props) => {

  const {key} = useParams();

  return (
    <div className="success p-5">
      <section className="py-5 text-center container card " style={{fontSize:"12px"}}>
        <div className="row py-lg-5">
        <h5 className="lead text-muted" style={{fontSize:"14px"}}>
                המסמך נשלל לשדה נחמיה בהצלחה
            </h5>
          <div className="col-lg-6 col-md-8 mx-auto">
            <img className="m-3" src="/success-35.png" width="50px" ></img>

            <h5 className="lead text-muted" style={{fontSize:"14px"}}>
                תוכל לצפות במסמך החתום אם תלחץ על הכפתור "הורד מסמך" למטה:
            </h5>

            <a className="btn btn-outline-primary" href={ `https://api.myvarno.io/api/documentSign/${key}.pdf` }> הורד מסמך </a>
            
            <h5 className=" ">
              תודה רבה!
            </h5>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SentPage;

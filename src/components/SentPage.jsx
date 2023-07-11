import * as React from "react";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const SentPage = (props) => {
  return (
    <div className="success p-5">
      <section class="py-5 text-center container card w-50">
        <div class="row py-lg-5">
        <h5 class="lead text-muted">
                המסמך נשלל לשדה נחמיה בהצלחה
            </h5>
          <div class="col-lg-6 col-md-8 mx-auto">
            <img className="img-fluid p-5" src="success-35.png"></img>

            <h5 class="lead text-muted">
                תוכל לצפות במסמך החתום את תלחץ על הכפתור "הורד מסמך"
            </h5>

            {props.isLoading ? (
              <Skeleton height={40} count={1} /> // Adjust the height and count as per your needs
            ) : (<a className="btn btn-outline-primary" href={ `https://api.myvarno.io/api/documentSign/${props.childId}.pdf` }> הורד מסמך </a>)}
            
            <h5 class=" ">
              תודה רבה!
            </h5>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SentPage;

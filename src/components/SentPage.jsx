import * as React from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'


const SentPage = (props) => {
  return (
    <div className="success p-5">
      <section className="py-5 text-center container card w-50">
        <div className="row py-lg-5">
        <h5 className="lead text-muted">
                המסמך נשלל לשדה נחמיה בהצלחה
            </h5>
          <div className="col-lg-6 col-md-8 mx-auto">
            <img className="img-fluid p-5" src="success-35.png"></img>

            <h5 className="lead text-muted">
                תוכל לצפות במסמך החתום אם תלחץ על הכפתור "הורד מסמך" למטה:
            </h5>

            {props.isLoading ? (
              <Skeleton height={40} count={1} /> // Adjust the height and count as per your needs
            ) : (<a className="btn btn-outline-primary" href={ props.documentURL }> הורד מסמך </a>)}
            
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

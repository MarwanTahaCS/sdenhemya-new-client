import * as React from "react";

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

import * as React from "react";
import {useState} from "react";
import {useParams} from "react-router-dom";


const SentPage = (props) => {
    const { key } = useParams();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  return (
    <div className=" p-5" style={{fontSize: `${windowWidth / 40}px`}}>
      <section className="py-5 text-center container card w-75">
        <div className="row py-lg-5">
        <h5 className=" text-muted" style={{fontSize: `${windowWidth / 40}px`}}>
                המסמך נשלח בהצלחה
            </h5>
          <div className="">
            <img className="img-fluid p-3" src="/success-35.png" width={`100px`}></img>

            <h5 className=" text-muted" style={{fontSize: `${windowWidth / 40}px`}}>
                תוכל לצפות במסמך החתום אם תלחץ על הכפתור "הורד מסמך" למטה:
            </h5>

            <a className="btn btn-outline-primary" href={ `${window.AppConfig.serverDomain}/api/documentSign/${key}.pdf` } style={{fontSize: `${windowWidth / 35}px`}}> הורד מסמך </a>
            
            <h5 className=" pt-3" style={{fontSize: `${windowWidth / 35}px`}}>
              תודה רבה!
            </h5>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SentPage;
import React, { useState } from "react";
import SignatureCanvas from 'react-signature-canvas';

export default function SignatureModal(props) {

  const [sign, setSign] = useState();
  const [url, setUrl] = useState();

  function handleClear() {
    sign.clear();
  }

  function handleGenerate() {
    let signatureBlob = sign.toDataURL('img/png');
    setUrl(signatureBlob);
    props.setUrl(signatureBlob);

    props.updateSignature(props.id, signatureBlob);
  }

  return (
    <div>


      {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#exampleModal${props.id}`}>
        לחץ כאן כדי לחתום/לעדכן חתימה <br/>
      </button> */}

      <div className="fixed-size" data-bs-toggle="modal" data-bs-target={`#exampleModal${props.id}`}>
        לחץ כאן כדי לחתום <br/>
        <img src={props.url} alt="signature" width="100"  /> 
      </div>

      


      <div class="modal fade" id={`exampleModal${props.id}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5 " id="exampleModalLabel"> <span className="ms-5"> נא לחתום כאן (באצבע או בעט מגע) </span></h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex justify-content-center bg-light">
              <SignatureCanvas penColor='green'
                canvasProps={{ width: 340, height: 200, className: 'sigCanvas' }} 
                ref={data=>setSign(data)} 
                backgroundColor={'rgba(0,0,0,0.05)'} />
            </div>
            <div class="modal-footer">
              {/* <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">סגור</button> */}
              <button type="button" class="btn btn-success" onClick={ handleGenerate } data-bs-dismiss="modal">שמור </button>
              <button type="button" class="btn btn-warning" onClick={ handleClear } >נקה</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
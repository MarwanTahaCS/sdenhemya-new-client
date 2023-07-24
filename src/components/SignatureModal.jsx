import React, { useState } from "react";
import SignatureCanvas from 'react-signature-canvas';
import '../index.css';

export default function SignatureModal(props) {

  const [sign, setSign] = useState();

  function handleClear() {
    sign.clear();
  }

  function handleGenerate() {
    let signatureBlob = sign.toDataURL('img/png');

    console.log(signatureBlob);

    props.updateSignature(props.index, signatureBlob);
  }

  return (
    <>

      <div className="fixed-size" data-bs-toggle="modal" data-bs-target={`#exampleModal${props.index}`}>

        <div style={{ position: 'relative' }}>
          <img src={props.url} alt="signature" width="100%" />
          <div style={{
            position: 'absolute',
            top: '0%',
            left: '0%',
            width: '100%',
            // transform: 'translate(-100%, -100%)',
            textAlign: 'center'
          }}>
            <h6> לחץ כאן כדי לחתום  </h6>
          </div>
        </div>
      </div>




      <div key={props.index} class="modal fade" id={`exampleModal${props.index}`} tabIndex="-1" aria-labelledby={`exampleModalLabel${props.index}`} aria-hidden="true">
        <div key={props.index} class="modal-dialog">
          <div key={props.index} class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5 " id={`exampleModalLabel${props.index}`}> <span className="ms-5"> נא לחתום כאן (באצבע או בעט מגע) </span></h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex justify-content-center bg-light">
              <SignatureCanvas key={props.index} penColor='green'
                canvasProps={{ width: 340, height: 200, className: 'sigCanvas' }}
                ref={data => setSign(data)}
                backgroundColor={'rgba(0,0,0,0.05)'} />
            </div>
            <div class="modal-footer">
              {/* <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">סגור</button> */}
              <button type="button" class="btn btn-success" onClick={handleGenerate} data-bs-dismiss="modal">שמור </button>
              <button type="button" class="btn btn-warning" onClick={handleClear} >נקה</button>
            </div>
          </div>
        </div>
      </div>

    </ >
  );
}
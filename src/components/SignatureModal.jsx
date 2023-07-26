import React, { useState } from "react";
import SignatureCanvas from 'react-signature-canvas';
import '../index.css';
import '../SlideInOverlay.css'; 

export default function SignatureModal(props) {

  const [sign, setSign] = useState();

  function handleClear() {
    sign.clear();
  }

  function handleGenerate() {
    let signatureBlob = sign.toDataURL('img/png');

    console.log(signatureBlob);

    props.updateSignature(props.index, signatureBlob);
    handleToggleOverlay();
  }

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOverlay = () => {
    const oldState = isOpen;
    props.setHoveredIndex(oldState);
    setIsOpen(!oldState);
    props.setSignatureOpen(!oldState);
  };

  return (
    <>

      <div className="fixed-size" onClick={handleToggleOverlay}>

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




      <div className={`overlay ${isOpen ? 'open' : ''} box1`} tabIndex={3} >
          <div class="card">
            <div class="card-header">
              <h1 class="modal-title fs-5 " > <span className="ms-5"> נא לחתום כאן (באצבע או בעט מגע) </span></h1>
              <button type="button" class="btn-close" onClick={handleToggleOverlay} aria-label="Close"></button>
            </div>
            <div class="card-body d-flex justify-content-center bg-light">
              <SignatureCanvas  penColor='green'
                canvasProps={{ width: 340, height: 200, className: 'sigCanvas' }}
                ref={data => setSign(data)}
                backgroundColor={'rgba(0,0,0,0.05)'} />
            </div>
            <div class="card-footer ">
              {/* <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">סגור</button> */}
              <button type="button" class="btn btn-success" onClick={handleGenerate} >שמור </button>
              <button type="button" class="btn btn-warning" onClick={handleClear} >נקה</button>
            </div>
          </div>
      </div>

    </ >
  );
}
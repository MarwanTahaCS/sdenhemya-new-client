import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



export default function FormStepper({ visibleDiv, setVisibleDiv, requestedFiles, handleNextClick }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  let steps = ['חתימת המסמך', ' צירוף מסמכים דרושים', 'הגשה'];

  const handleStep = (step) => () => {
    
    if(visibleDiv === 0 && step === 1){
      handleNextClick();
    } else if (visibleDiv === 0 && step === 2) {
      handleNextClick();
    } else if (visibleDiv === 1 && step === 0) {
      setVisibleDiv(step);
    } else if (visibleDiv === 1 && step === 2) {
      handleNextClick();
    } else if (visibleDiv === 2) {
      setVisibleDiv(step);
    }
  };

  return (
    <div className="my-3">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ maxWidth: '800px', width: '100%' }}>
          <Stepper nonLinear activeStep={visibleDiv}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]} >
                <StepButton color="inherit" onClick={handleStep(index)} >
                  <div className="m-1">{label}</div>
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>

          </div>
        </Box>
      </Box>
    </div>
  );
}

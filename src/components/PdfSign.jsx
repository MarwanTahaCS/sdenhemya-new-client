import React, { useState, useEffect, useRef } from "react";
import { PDFDocument as PDFLibDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf/renderer';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Import the required CSS file
import "react-pdf/dist/esm/Page/TextLayer.css";
import { PDFViewer, PDFDownloadLink, Page as PdfPage, Text, View, Document as PdfDocument, StyleSheet } from '@react-pdf/renderer';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import fontkit from '@pdf-lib/fontkit';
import '../index.css';
import { FaEdit } from 'react-icons/fa';
import Slider from '@mui/material/Slider';
import { Typography, TextField, Autocomplete } from '@mui/material';
import SignatureModal from "./SignatureModal.jsx";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axios from "axios";
import { useParams } from 'react-router-dom';
import AtomicSpinner from 'atomic-spinner';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfSign(props) {
  const [inputFields, setInputFields] = useState([
    // { x: 0.016697588126159554, y: 0.8501120071684588, value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC", page: 1, isCursor: false, editor: { state: false, width: 0.25, height: 1, font: 1, inputType: { label: 'חתימה', value: 'signature1' } } },
    // { x: 0.24397031539888683, y: 0.11247759856630825, value: '', page: 1, isCursor: false, editor: { state: false, width: 0.12, height: 1, font: 1, inputType: { label: 'השנה', value: 'year' } } },
    // { x: 0.3562152133580705, y: 0.11247759856630825, value: '', page: 1, isCursor: false, editor: { state: false, width: 0.07, height: 1, font: 1, inputType: { label: 'השנה', value: 'year' } } },
    // { x: 0.45640074211502785, y: 0.11247759856630825, value: '', page: 1, isCursor: false, editor: { state: false, width: 0.05, height: 1, font: 1, inputType: { label: 'השנה', value: 'year' } } },
    // { x: 0.2894248608534323, y: 0.2845206093189964, value: '', page: 1, isCursor: false, editor: { state: false, width: 0.25, height: 1, font: 1, inputType: { label: 'השנה', value: 'year' } } },
    // { x: 0.49165120593692024, y: 0.2845206093189964, value: '', page: 2, isCursor: false, editor: { state: false, width: 0.23, height: 1, font: 1, inputType: { label: 'השנה', value: 'year' } } },
    // { x: 0.512987012987013, y: 0.3275313620071685, value: '', page: 2, isCursor: false, editor: { state: false, width: 0.17, height: 1, font: 1, inputType: { label: 'השנה', value: 'year' } } },
    // { x: 0.3395176252319109, y: 0.3282482078853047, value: '', page: 3, isCursor: false, editor: { state: false, width: 0.16, height: 1, font: 1, inputType: { label: 'השנה', value: 'year' } } },
    // { x: 0.18274582560296845, y: 0.3268145161290323, value: '', page: 3, isCursor: false, editor: { state: false, width: 0.15, height: 1, font: 1, inputType: { label: 'השנה', value: 'year' } } },
    // { x: 0.016697588126159554, y: 0.8501120071684588, value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC", page: 2, isCursor: false, editor: { state: false, width: 0.25, height: 1, font: 1, inputType: { label: 'חתימה', value: 'signature1' } } },
  ]);
  const [signatures, setSignatures] = useState([]);
  const [containerBounds, setContainerBounds] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [clickX, setClickX] = useState(null);
  const [clickY, setClickY] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(null);
  const [pageHeight, setPageHeight] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approverPhoneNumber, setApproverPhoneNumner] = useState("");

  // Access the parameter using useParams
  const { key } = useParams();

  const [addingTextInputField, SetAddingTextInputField] = useState(false);
  const [addingSignatureInputField, SetAddingSignatureInputField] = useState(false);

  const pdfFile = `${window.AppConfig.serverDomain}/api/documentSign/${key}.pdf`;
  // const pdfFile = `http://localhost:3001/api/documentSign/${key}.pdf`;
  const fontFileUrl = '../Alef-Regular.ttf';

  const [windowWidth, setWindowWidth] = useState((!(window.innerWidth - window.visualViewport.width > 1)? window.innerWidth: window.visualViewport.width));


  const handleResize = () => {
    setWindowWidth((!(window.innerWidth - window.visualViewport.width > 1)? window.innerWidth: window.visualViewport.width));
  };

  // Add event listener to handle window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    setContainerBounds(containerRef.current.getBoundingClientRect());

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);





  useEffect(() => {
    const fetchNumPages = async () => {
      try {
        setWindowWidth((!(window.innerWidth - window.visualViewport.width > 1)? window.innerWidth: window.visualViewport.width));

        const pdf = await pdfjs.getDocument(pdfFile).promise;
        setNumPages(pdf.numPages);

        const firstPage = await pdf.getPage(1);
        const { width, height } = firstPage.getViewport({ scale: 1 });

        console.log([width, height]);
        setPageWidth(width);
        setPageHeight(height);

      } catch (error) {
        console.error('Error occurred while fetching PDF:', error);
      }
    };

    fetchNumPages();
  }, []);

  useEffect(() => {
    // Function to fetch data from the backend server
    const fetchData = async () => {
      try {
        // Make the GET request using Axios
        const response = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/document-input-fields/${key}`);
        // const response = await axios.get(`http://localhost:3001/api/organzations/document-input-fields/${key}`);
        setInputFields(response.data.inputFields); // Update the state with the fetched data
        console.log(response.data.inputFields);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);


  const handleInputChange = (event, index) => {
    console.log(inputFields[index].editor.inputType.label);

    const updatedInputFields = [...inputFields];

    inputFields.forEach((field, index2) => {
      if (field.editor.inputType.value === inputFields[index].editor.inputType.value) {
        updatedInputFields[index2].value = event.target.value;
      }
    })
    setInputFields(updatedInputFields);
  };

  const handlePageChange = (newPage) => {
    console.log(newPage);
    setCurrentPage(newPage);
    // setClickY(null); // Reset clickY when the page changes
  };

  const handleOpenPDF = async () => {

    if(approverPhoneNumber.length <9 ){
      alert('אנא הכנס את מספר הפלפון שלך בשדה מתחתית חלון זה.');
      return;
    }



    console.log(inputFields);
    try {
      setLoading(true);
      // Load the existing PDF document
      var existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());

      console.log("after fetch");
      const pdfDoc = await PDFLibDocument.load(existingPdfBytes);

      // Register the fontkit instance
      pdfDoc.registerFontkit(fontkit);

      // Load the custom font file
      const fontBytes = await fetch(fontFileUrl).then(res => res.arrayBuffer());

      // Embed the font in the PDF document
      const customFont = await pdfDoc.embedFont(fontBytes);

      // Add the input field values as text on each page
      const pages = pdfDoc.getPages();
      inputFields.forEach(async inputField => {
        if (inputField.editor.inputType.value !== 'signature1' && inputField.editor.inputType.value !== 'signature2') {
          const { value } = inputField;
          const { x, y } = inputField;
          pages.forEach((page, index) => {
            if (inputField.page === index + 1) {
              const pageHeight = page.getHeight();
              const sizeFont = 12;
              const adjustedY = pageHeight - y * (pageHeight) - sizeFont; // Adjust the y-coordinate
              page.drawText(value, { x: x * (pageWidth), y: adjustedY, font: customFont, size: sizeFont, color: rgb(0, 0, 0) });
            }
          });
        } else if (inputField.editor.inputType.value === 'signature1' || inputField.editor.inputType.value == 'signature2') {
          console.log(inputField.value);
          // Embed the image in the PDF document
          // const imageBytes = await fetch(inputField.value).then(res => res.arrayBuffer());
          const image = await pdfDoc.embedPng(inputField.value);
          // const pngImage = await pdfDoc.embedPng(inputField.value);
          const pngDims = image.scale(0.27)
          const { x, y } = inputField;
          pages.forEach((page, index) => {
            if (inputField.page === index + 1) {
              const pageHeight = page.getHeight();

              const adjustedY = pageHeight - y * (pageHeight) - pngDims.height; //- sizeFont; // Adjust the y-coordinate
              // page.drawText(value, { x: x * (pageWidth), y: adjustedY, font: customFont, size: sizeFont, color: rgb(0, 0, 0) });
              // page.moveTo(393, 80);
              page.drawImage(image, {
                x: x * (pageWidth), y: adjustedY,
                width: pngDims.width,
                height: pngDims.height
              })
            }
          });
        }
      });

      // Generate the modified PDF document
      const modifiedPdfBytes = await pdfDoc.save();

      // Create a Blob object from the PDF data
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

      //------------------------------------------
      // send pdf to server
      await submitSignedData(modifiedPdfBlob);
      //------------------------------------------

      // Create a URL for the Blob object
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

      // Open the modified PDF in a new window
      const pdfWindow = window.open(modifiedPdfUrl);
      pdfWindow.focus();
      setLoading(false);
    } catch (error) {
      console.log('Error opening PDF:', error);
      setLoading(false);
    }
  };

  function extractValues(input) {
    var extracted = data;

    input.forEach(field => {
      extracted = {
        ...extracted,
        [field.editor.inputType.value]: field.value,
      }
    });
    return extracted;
  }

  const submitSignedData = async (modifiedPdfBlob) => {
    // const localUrl = "http://localhost:3001/api/organzations/submit/";
    const localUrl = `${window.AppConfig.serverDomain}/api/organzations/submit/`;

    console.log(inputFields);

    const data = new FormData();
    data.append('data', JSON.stringify(extractValues(inputFields)));
    data.append('templateID', key.split('_').pop());
    data.append('pdf', modifiedPdfBlob, `${key}_${approverPhoneNumber}.pdf`);
    data.append('approverPhone', approverPhoneNumber)
    // Add more fields as needed

    try {
      const response = await axios.post(localUrl, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(`${response.data}`);

      // Do something with the response if needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMouseEnter = (event, index) => {
    if (!signatureOpen) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!signatureOpen) {
      setHoveredIndex(null);
    }
  };

  function updateSignature(index, url) {

    setInputFields(prevInputFields => {
      const updatedInputFields = [...prevInputFields]; // Copy the existing array
      inputFields.forEach((field, index2) => {
        if (field.editor.inputType.value === inputFields[index].editor.inputType.value) {
          updatedInputFields[index2].value = url;
        }
      })
      // console.log(updatedInputFields);
      return updatedInputFields; // Set the updated array as the new state
    });

  }

  async function handlePdfLoadSuccess() {
    setWindowWidth((!(window.innerWidth - window.visualViewport.width > 1)? window.innerWidth: window.visualViewport.width));

    setDocumentLoaded(true);
  }

  // Use the documentBytes as needed, e.g., display the PDF
  return (
    <div>
      <h1 className="text-center david"> הגשת מסמכים דיגיטלית </h1>
      {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}

      <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', position: 'relative' }} >
        <Document file={pdfFile}  >
          <div style={{ pointerEvents: `${addingTextInputField || addingSignatureInputField ? 'auto' : 'none'}` }} >

            <Page onLoadSuccess={handlePdfLoadSuccess} key={currentPage - 1} pageNumber={currentPage} width={containerRef.current?.clientWidth} />


          </div>
        </Document>
        {documentLoaded &&
          <>{inputFields.map((inputField, index) => (
            (inputField.page === currentPage) ?
              <div key={index}>
                {
                  (inputField.editor.inputType.value === 'signature1' || inputField.editor.inputType.value === 'signature2') ? (
                    <div key={index}
                      style={{
                        opacity: `${hoveredIndex === index || inputField.editor.state ? 0.8 : 1}`,
                        position: 'absolute', top: inputField.y * (windowWidth) * ((pageHeight) / pageWidth), left: inputField.x * (windowWidth),
                        fontSize: `${windowWidth / 40}px`,
                        width: `${(windowWidth * inputField.editor.width / 1.5)}px`,
                        padding: '4px',
                      }}
                      onMouseEnter={(event) => handleMouseEnter(event, index)}
                      onMouseLeave={handleMouseLeave}
                    >

                      <SignatureModal key={index} setHoveredIndex={setHoveredIndex} setSignatureOpen={setSignatureOpen} updateSignature={updateSignature} url={inputField.value} index={index} signer={"חתימה ראשונה"} />

                    </div>) : (<input
                      key={index}
                      type="text"
                      value={inputField.value}
                      onChange={(event) => handleInputChange(event, index)}
                      style={{
                        opacity: `${hoveredIndex === index || inputField.editor.state ? 0.8 : 1}`,
                        position: 'absolute', top: inputField.y * (windowWidth) * ((pageHeight) / pageWidth), left: inputField.x * (windowWidth),
                        width: `${(windowWidth * inputField.editor.width / 1.5)}px`,
                        height: `${windowWidth * inputField.editor.height / 40}px`,
                        fontSize: `${windowWidth / 60}px`,
                        padding: '4px',
                        // ...(windowWidth <= 768 && {
                        //   width: '50px',
                        //   height: '14px',
                        //   fontSize: '8px',
                        //   padding: '2px',
                        // }),
                      }}
                      onMouseEnter={(event) => handleMouseEnter(event, index)}
                      onMouseLeave={handleMouseLeave}
                    // className="input-field"
                    />)
                }


              </div> : <div></div>

          ))}</>}


      </div>
      <div className="d-flex justify-content-center">
      <button className="btn btn-secondary m-1" onClick={() => handlePageChange((currentPage === 1) ? currentPage : currentPage - 1)}><KeyboardArrowRightIcon /></button>
      <button className="btn btn-secondary m-1" onClick={() => handlePageChange((currentPage === numPages) ? currentPage : currentPage + 1)}><KeyboardArrowLeftIcon /></button>
      </div>
      <br />
      <div className="d-flex justify-content-center">
      <input  type="text" style={{ maxWidth:"200px"}}value={approverPhoneNumber} className="form-control" id="numberInput" placeholder="Enter a phone number" onChange={(event) => setApproverPhoneNumner(event.target.value)} />

      <button className="btn btn-primary m-1" onClick={handleOpenPDF}>הגש מסמך</button>
      </div>

    </div>
  );

}

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    fontSize: 12,
  },
  textContainer: {
    position: 'absolute',
    border: '1px solid black',
    padding: '5px',
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: '14px', // Adjust the font size for smaller screens
    padding: '4px' // Adjust the padding for smaller screens
  }
});

const BootstrapButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#0063cc',
  borderColor: '#0063cc',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#0069d9',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});

const options = [
  { label: 'שם הילד', value: 'childName' },
  { label: 'מספר תעודת תלמיד', value: 'childId' },
  { label: 'חתימה 1', value: 'signature1' },
  { label: 'חתימה 2', value: 'signature2' },
  { label: 'היום', value: 'day' },
  { label: 'החודש', value: 'month' },
  { label: 'השנה', value: 'year' },
  { label: 'שם הורה 1', value: 'parentName1' },
  { label: 'מספר תעודת הורה 1', value: 'parentId1' },
  { label: 'מספר פלפון הורה 1', value: 'phoneNumber1' },
  { label: 'שם הורה 2', value: 'parentName2' },
  { label: 'מספר תעודת הורה 2', value: 'parentId2' },
  { label: 'מספר פלפון הורה 2', value: 'phoneNumber2' },
  { label: 'שם גן', value: 'kindergarten' },
  { label: 'שנה עברית', value: 'hebrewYear' },
  { label: 'שם ילד פרטי', value: 'childFirstName' },
  { label: 'שם משפחה', value: 'childLastName' },
  { label: 'יום הולדת', value: 'dateOfBirth' },
  { label: 'ארץ לידה', value: 'countryOfBirth' },
  { label: 'שנת עליה', value: 'yearOfArrival' },
  { label: 'כתובת', value: 'address' },
  { label: 'מיקוד - ZIP', value: 'zip' },
  { label: 'תאריך לידה', value: 'dateOfBirth' },
  { label: 'אח ראשון', value: 'brother1' },
  { label: 'אח שני', value: 'brother2' },
  { label: 'אח שלישי', value: 'brother3' },
  { label: 'אח רביעי', value: 'brother4' },
  { label: 'מקצוע הורה ראשון', value: 'parentJob1' },
  { label: 'מספר פלפון הורה ראשון', value: 'parentHomeNumber1' },
  { label: 'אימייל הורה ראשון', value: 'parentEmailAddress1' },
  { label: 'מקצוע הורה שני', value: 'parentJob2' },
  { label: 'מספר פלפון הורה שני', value: 'parentHomeNumber2' },
  { label: 'אימייל הורה שני', value: 'parentEmailAddress2' },
  { label: 'שם קרוב משפחה ראשון', value: 'relativeName1' },
  { label: 'סטטוס קרבות משפחה ראשון', value: 'relativeStatus1' },
  { label: 'מספר פ. קרוב משפחה ראשון', value: 'relativeNumber1' },
  { label: 'שם קרוב משפחה שני', value: 'relativeName2' },
  { label: 'סטטוס קרבות משפחה שני', value: 'relativeStatus2' },
  { label: 'מספר פ. קרוב משפחה שני', value: 'relativeNumber2' },
  { label: 'האם קיימת בעיה בריאותית', value: 'healthIssueExist' },
  { label: 'בעיה בריאותית וטיפול בה', value: 'healthIssueAndSolution' },
  { label: 'אלרגיה לתרופות', value: 'allergyToMedication' },
  { label: 'אלרגיה לאוכל', value: 'allergyToFood' },
  { label: 'מחלות קודמות', value: 'pastDiseases' },
  { label: 'אלרגיות', value: 'allergies' },
  { label: 'האם קיבל חיסונים מלאים', value: 'receivedFullVaccination' },
  { label: 'חיסונים שלא קיבל הילד', value: 'nonReceivedVaccinations' },
  { label: 'קופת חולים', value: 'hmo' },
  { label: 'הערות', value: 'remarks' },
  { label: 'תאריך התחלת הנוכחות', value: 'attendanceStartingDate' },
  { label: 'מ- (כתובת)', value: 'from' },
  { label: 'תאריך חתימה (היום)', value: 'signingDate' },
  { label: 'שם כיתה', value: 'className' },
  { label: 'סכום תשלום חודשה', value: 'monthlyPayment' },
  { label: 'אמצעי תשלום', value: 'paymentMethod' },
  { label: 'האם ההורים מאשרים לצילום הילד פנימי', value: 'allowsPhotographingInternal' },
  { label: 'האם ההורים מאשרים לצילום הילד חוץ', value: 'allowsPhotographingExternal' },
  { label: 'שם החותם', value: 'approverName' },
  { label: 'סטטוס קרבות החותם', value: 'approverStatus' },
  { label: 'כתובת החותם', value: 'approverAddress' },
  { label: 'מס. פלפון החותם', value: 'approverPhoneNumber' },
  { label: 'אחר', value: 'other' },
];

const data = {
  day: "",
  month: "",
  year: "",
  childName: "",
  childId: "",
  parentName1: "",
  parentId1: "",
  phoneNumber1: "",
  parentName2: "",
  parentId2: "",
  phoneNumber2: "",
  kindergarten: "",
  hebrewYear: "",
  childFirstName: "",
  childLastName: "",
  dateOfBirth: "",
  countryOfBirth: "",
  yearOfArrival: "",
  address: "",
  zip: "",
  brother1: "",
  brother2: "",
  brother3: "",
  brother4: "",
  parentJob1: "",
  parentHomeNumber1: "",
  parentEmailAddress1: "",
  parentJob2: "",
  parentHomeNumber2: "",
  parentEmailAddress2: "",
  relativeName1: "",
  relativeStatus1: "",
  relativeNumber1: "",
  relativeName2: "",
  relativeStatus2: "",
  relativeNumber2: "",
  healthIssueExist: "false",
  healthIssueAndSolution: "",
  allergyToMedication: "",
  allergyToFood: "",
  pastDiseases: "",
  allergies: "",
  receivedFullVaccination: "true",
  nonReceivedVaccinations: "",
  hmo: "",
  remarks: "",
  attendanceStartingDate: "",
  from: "",
  signingDate: "",
  className: "",
  monthlyPayment: "",
  paymentMethod: "12-checks",
  allowsPhotographingInternal: "false",
  allowsPhotographingExternal: "false",
  approverName: "",
  approverStatus: "",
  approverAddress: "",
  approverPhoneNumber: "",

  signature1: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC",
  signature2: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC",

};
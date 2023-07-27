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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function AddFormFieldsToPDF(props) {
  const [inputFields, setInputFields] = useState([]);
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
  const [hoveredIndex, setHoveredIndex] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [signatureOpen, setSignatureOpen] = useState(false);

  const emptySignature = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC");

  const [addingTextInputField, SetAddingTextInputField] = useState(false);
  const [addingSignatureInputField, SetAddingSignatureInputField] = useState(false);

  const pdfFile = 'parents_agreement_fixed.pdf';
  const fontFileUrl = 'DavidLibre-Regular.ttf';

  const [windowWidth, setWindowWidth] = useState(window.visualViewport.width);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleResize = () => {
    setWindowWidth(window.visualViewport.width);
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
        setWindowWidth(window.visualViewport.width);

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
  }, [pdfFile]);

  useEffect(() => {
    const fetchNumPages = async () => {
      try {
        const existingPdfBytes = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFLibDocument.load(existingPdfBytes);
        setNumPages(pdfDoc.getPageCount());

        const page = pdfDoc.getPage(1);
        const { width, height } = page.getSize();

        console.log([width, height]);
        setPageWidth(width);
        setPageHeight(height);

      } catch (error) {
        console.error('Error occurred while fetching PDF:', error);
      }
    };

    fetchNumPages();

    setWindowWidth(window.visualViewport.width);

  }, [selectedFile]);



  const handlePageClick = (event, inputType) => {

    const containerBounds = containerRef.current.getBoundingClientRect();
    const containerX = containerBounds.left;
    const containerY = containerBounds.top;

    setContainerBounds(containerBounds);

    const containerwidthX = containerBounds.right - containerBounds.left;
    const containerwidthY = containerBounds.bottom - containerBounds.top;

    // console.log([containerwidthX, containerwidthY]);
    const clickXtemp = ((event.clientX - containerX) / containerwidthX);
    const clickYtemp = ((event.clientY - containerY) / containerwidthY);

    setClickX(clickXtemp);
    setClickY(clickYtemp);

    if (inputType === 1) {
      const newInputField = {
        x: clickXtemp,
        y: clickYtemp,
        value: "",
        page: currentPage,
        isCursor: false,
        editor: {
          state: false,
          width: 0.25,
          height: 1,
          font: 1,
          inputType: { label: 'אחר', value: 'other' },
        }
      };

      setInputFields([...inputFields.filter(field => !field.isCursor), newInputField]);


      SetAddingTextInputField(false);

    } else if (inputType === 2) {

      const newSignature = {
        x: clickXtemp,
        y: clickYtemp,
        value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC",
        page: currentPage,
        isCursor: false,
        editor: {
          state: false,
          width: 1,
          height: 1,
          font: 1,
          inputType: { label: 'חתימה', value: 'signature1' },
        }
      };

      setSignatures([...inputFields.filter(field => !field.isCursor), inputFields]);

      SetAddingSignatureInputField(false);
    }

    console.log(signatures);

  };

  const handleMouseMove = (event, inputType) => {
    const containerBounds = containerRef.current.getBoundingClientRect();
    const containerX = containerBounds.left;
    const containerY = containerBounds.top;

    setContainerBounds(containerBounds);

    const containerwidthX = containerBounds.right - containerBounds.left;
    const containerwidthY = containerBounds.bottom - containerBounds.top;

    // console.log([containerwidthX, containerwidthY]);
    const clickXtemp = ((event.clientX - containerX) / containerwidthX);
    const clickYtemp = ((event.clientY - containerY) / containerwidthY);

    setClickX(clickXtemp);
    setClickY(clickYtemp);

    const newClick = { x: clickXtemp * pageWidth, y: clickYtemp * pageHeight };
    setClicks([...clicks, newClick]);

    if (inputType === 1) {

      const newInputField = {
        x: clickXtemp,
        y: clickYtemp,
        value: '',
        page: currentPage,
        isCursor: true,
        editor: {
          state: false,
          width: 0.25,
          height: 1,
          font: 1,
          inputType: { label: 'אחר', value: 'other' },
        }
      };

      setInputFields([...inputFields.filter(field => !field.isCursor), newInputField]);

      console.log([window.scrollX, window.scrollY, inputFields.find(field => field.isCursor)]);
    } else if (inputType === 2) {
      const newInputField = {
        x: clickXtemp,
        y: clickYtemp,
        value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC",
        page: currentPage,
        isCursor: true,
        editor: {
          state: false,
          width: 0.25,
          height: 1,
          font: 1,
          inputType: { label: 'חתימה', value: 'signature1' },
        }
      };

      setInputFields([...inputFields.filter(field => !field.isCursor), newInputField]);

      console.log([window.scrollX, window.scrollY, inputFields.find(field => field.isCursor)]);
    }
  };

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
    setCurrentPage(newPage);
    setClickY(null); // Reset clickY when the page changes
  };

  const handleOpenPDF = async () => {

    if (!selectedFile) {
      console.log('Please select a PDF file.');
      return;
    }

    console.log(inputFields);
    try {
      // Load the existing PDF document
      var existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());

      if (selectedFile) {
        // existingPdfBytes = await selectedFile.arrayBuffer();
      }

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
        if (inputField.editor.inputType.value !== 'signature1') {
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
        } else if (inputField.editor.inputType.value === 'signature1') {
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

      // Create a URL for the Blob object
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

      // Open the modified PDF in a new window
      const pdfWindow = window.open(modifiedPdfUrl);
      pdfWindow.focus();
    } catch (error) {
      console.log('Error opening PDF:', error);
    }
  };

  // const renderPdfContent = () => {
  //   return (
  //     <PdfPage>
  //       {
  //         inputFields.map((field, index) => (
  //           clicks.map((click, index) => (
  //             <View key={index} style={[styles.textContainer, { top: click.y, left: click.x }]}>
  //               <Text>Your Text Field</Text>
  //             </View>
  //           ))
  //         ))
  //       }

  //     </PdfPage>
  //   );
  // };

  const handleAddingTextInputField = () => {
    SetAddingTextInputField(true);
  }

  const handleAddingSignatureInputField = () => {
    console.log(addingSignatureInputField);
    SetAddingSignatureInputField(true);
  }

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

  const switchEditorState = (index) => {
    const fieldToEdit = inputFields[index];
    fieldToEdit.editor.state = !fieldToEdit.editor.state;
    setInputFields([...inputFields.filter((field, liveIndex) => liveIndex !== index), fieldToEdit]);
  }

  const deleteField = (index) => {
    setInputFields([...inputFields.filter((field, liveIndex) => liveIndex !== index)]);
  }

  const handleSliderChange = (event, newValue, index) => {
    console.log([index, newValue]);
    setInputWidth(newValue, index);
  };

  const setInputWidth = (newValue, index) => {
    // const fieldToEdit = inputFields[index];
    // fieldToEdit.editor.width = newValue / 100;
    // setInputFields([...inputFields.filter((field, liveIndex) => liveIndex !== index), fieldToEdit]);
    setInputFields(prevInputFields => {
      const updatedInputFields = [...prevInputFields]; // Copy the existing array
      updatedInputFields[index].editor.width = newValue / 100; // Update the desired item
      return updatedInputFields; // Set the updated array as the new state
    });

  };

  const handleDragStart = (event) => {
    event.preventDefault();
  };

  const handleDragMove = (event, index) => {
    const delta = event.movementY;

    if (delta > 0) {
      setInputWidth(inputFields[index].filter.width * 100 - 1, index);
    } else if (delta < 0) {
      setInputWidth(inputFields[index].filter.width * 100 + 1, index);
    }
  };

  const handleHeightSliderChange = (event, newValue, index) => {
    console.log([index, newValue]);
    setInputHeight(newValue, index);
  };

  const handleHeightDragStart = (event) => {
    event.preventDefault();
  };

  const setInputHeight = (newValue, index) => {
    // const fieldToEdit = inputFields[index];
    // fieldToEdit.editor.width = newValue / 100;
    // setInputFields([...inputFields.filter((field, liveIndex) => liveIndex !== index), fieldToEdit]);
    setInputFields(prevInputFields => {
      const updatedInputFields = [...prevInputFields]; // Copy the existing array
      updatedInputFields[index].editor.height = newValue / 100; // Update the desired item
      return updatedInputFields; // Set the updated array as the new state
    });

  };

  const handleHeightDragMove = (event, index) => {
    const delta = event.movementY;

    if (delta > 0) {
      setInputWidth(inputFields[index].filter.height * 100 - 1, index);
    } else if (delta < 0) {
      setInputWidth(inputFields[index].filter.height * 100 + 1, index);
    }
  };

  const handleIndexChange = (event, index, coordinateType) => {
    console.log(inputFields[index]);
    const newValue = event.target.value;
    setInputFields(prevInputFields => {
      const updatedInputFields = [...prevInputFields]; // Copy the existing array
      if (coordinateType === 'x') {
        updatedInputFields[index].x = ((newValue < windowWidth) ? newValue : windowWidth) / windowWidth; // Update the desired item
      } else {
        updatedInputFields[index].y = ((newValue < (windowWidth * ((pageHeight) / pageWidth))) ? newValue : (windowWidth * ((pageHeight) / pageWidth))) / (windowWidth);
      }

      return updatedInputFields; // Set the updated array as the new state
    });
  }

  const handleInputTypeChange = (event, value, index) => {
    setInputFields(prevInputFields => {
      const updatedInputFields = [...prevInputFields]; // Copy the existing array
      updatedInputFields[index].editor.inputType = value;
      if (value.value === 'signature1') {
        updatedInputFields[index].value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC";
      } else {
        updatedInputFields[index].value = "";
      }
      console.log(updatedInputFields);
      return updatedInputFields; // Set the updated array as the new state
    });
  }

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

  function saveInputFields() {
    props.handleInputFieldsChange(inputFields);

    handleSubmit();
  }

  const handleSubmit = async () => {
    const localUrl = "http://localhost:3001/api/documentSign/";
  // const localUrl = "https://yelotapi.myvarno.io/api/documentSign";

  console.log(inputFields);

    const data = new FormData();
    data.append('pdf', selectedFile);
    data.append('data', JSON.stringify(inputFields));
    data.append('templateName', selectedFile.name);
    // Add more fields as needed

    try {
      const response = await axios.post(localUrl, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      // Do something with the response if needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function handlePdfLoadSuccess() {
    setWindowWidth(window.visualViewport.width);
  }

  // Use the documentBytes as needed, e.g., display the PDF
  return (
    <>
      <h1> הוספת טופס</h1>
      {selectedFile && <>
        <BootstrapButton variant="contained" onClick={handleAddingTextInputField} disableRipple>
          הוסף שדה קלט
        </BootstrapButton>
        <BootstrapButton variant="contained" onClick={handleAddingSignatureInputField} disableRipple>
          הוסף לוח חתימה
        </BootstrapButton>
      </>}

      {!selectedFile && <div className="m-3">
        <label for="formFile" className="form-label">בחר קובץ PDF</label>
        <input className="form-control" id="formFile" type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>}

      <div ref={containerRef} style={{ width: '100%', overflow: 'visible', position: 'relative' }} onMouseMove={addingTextInputField ? (event) => handleMouseMove(event, 1) : addingSignatureInputField ? (event) => handleMouseMove(event, 2) : null}>
        <Document file={selectedFile}  >
          {/* {Array.from(new Array(numPages), (el, index) => (
            <Page key={index} pageNumber={index + 1} onClick={handlePageClick} width={containerRef.current?.clientWidth} />
          ))} */}
          <div style={{ pointerEvents: `${addingTextInputField || addingSignatureInputField ? 'auto' : 'none'}` }} >

            <Page onLoadSuccess={handlePdfLoadSuccess} key={currentPage - 1} pageNumber={currentPage} onClick={addingTextInputField ? (event) => handlePageClick(event, 1) : addingSignatureInputField ? (event) => handlePageClick(event, 2) : null} width={containerRef.current?.clientWidth} />


          </div>
        </Document>
        {inputFields.map((inputField, index) => (
          (inputField.page === currentPage) ?
            <>
              {
                inputField.editor.inputType.value === 'signature1' ? (
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



              {hoveredIndex === index && (
                <FaEdit
                  onMouseEnter={(event) => handleMouseEnter(event, index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => switchEditorState(index)}
                  style={{
                    height: `${windowWidth / 40}px`, marginLeft: `${windowWidth / 200}px`, cursor: 'pointer', position: 'absolute', top: (inputField.y * (windowWidth) * ((pageHeight) / pageWidth)), left: (inputField.x * (windowWidth)),
                  }} />
              )} {inputField.editor.state && (
                <div className="pt-3" style={{
                  position: 'absolute',
                  top: (inputField.y * (windowWidth) * ((pageHeight) / pageWidth)) + windowWidth / 40,
                  left: (inputField.x * (windowWidth)),
                  width: `${windowWidth > 700 ? windowWidth / 4 : windowWidth / 2}px`
                }}>
                  <div class="card p-1" >
                    <h6 style={{ fontSize: `${windowWidth / 60}px` }}>רוחב:</h6>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        userSelect: 'none',
                        cursor: 'grab',
                      }}
                      className=""
                      draggable
                      onDragStart={handleDragStart}
                      onDrag={(event) => handleDragMove(event, index)}
                    >
                      <Typography variant="body1" inputProps={{
                        style: {
                          fontSize: `${windowWidth / 50}px`,
                        },
                      }}>{Math.trunc(inputField.editor.width * 100)}</Typography>
                      <Slider
                        value={inputField.editor.width * 100}
                        min={5}
                        max={100}
                        step={1}
                        size="small"
                        aria-label="Small"
                        onChange={(event, newValue) => handleSliderChange(event, newValue, index)}
                      />
                    </div>
                    <h6 style={{ fontSize: `${windowWidth / 60}px` }}>אורך:</h6>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        userSelect: 'none',
                        cursor: 'grab',
                      }}
                      className=""
                      draggable
                      onDragStart={handleHeightDragStart}
                      onDrag={(event) => handleHeightDragMove(event, index)}
                    >
                      <Typography variant="body1" inputProps={{

                        style: {
                          fontSize: `${windowWidth / 50}px`,
                        },
                      }}>{Math.trunc(inputField.editor.height * 100)}</Typography>
                      <Slider
                        value={inputField.editor.height * 100}
                        min={5}
                        max={100}
                        step={1}
                        size="small"
                        aria-label="Small"
                        onChange={(event, newValue) => handleHeightSliderChange(event, newValue, index)}
                      />
                    </div>

                    <div className="row">
                      <div className="col d-flex justify-content-center py-3">
                        <TextField

                          type="number"
                          label="Horizontal"
                          value={Math.trunc(inputField.x * windowWidth)}
                          onChange={(event) => handleIndexChange(event, index, 'x')}
                          inputProps={{
                            min: 0,
                            max: windowWidth,
                            step: 5,
                            style: {
                              fontSize: `${windowWidth / 50}px`,
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              // fontSize: `${windowWidth / 60}px`, // Set the desired font size for the label
                            },
                          }}
                        />
                      </div>
                      <div className="col d-flex justify-content-center py-3">
                        <TextField
                          style={{ fontSize: `${windowWidth / 60}px` }}

                          type="number"
                          label="Vertical"
                          value={Math.trunc(inputField.y * (windowWidth))}
                          onChange={(event) => handleIndexChange(event, index, 'y')}
                          inputProps={{
                            min: 0,
                            max: (windowWidth * ((pageHeight) / pageWidth)),
                            step: 5,
                            style: {
                              fontSize: `${windowWidth / 50}px`,
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              // fontSize: `${windowWidth / 60}px`, // Set the desired font size for the label
                            },
                          }}
                        />
                      </div>
                    </div>
                    {/* <Autocomplete
                    className="pb-2"
                    options={options}
                    // getOptionLabel={(option) => option.label}
                    // getOptionSelected={(option, value) => option.value === value.value}
                    value={inputField.editor.inputType}
                    renderInput={(params) => (
                      <TextField {...params} label="סוג קלט" variant="outlined" />
                    )}
                    onChange={(event, value) => handleInputTypeChange(event,value, index)}
                  /> */}
                    <Autocomplete
                      className="mb-2"
                      disablePortal
                      options={options}
                      onChange={(event, value) => handleInputTypeChange(event, value, index)}
                      value={inputField.editor.inputType}
                      renderInput={(params) => <TextField {...params} label="סוג קלט" />}
                    />
                    <div className="row">
                      <div className="col col-7 d-flex justify-content-center ps-1">
                        <button className="btn btn-success w-100" style={{ fontSize: `${windowWidth / 60}px` }} onClick={() => switchEditorState(index)}> Save</button>

                      </div>
                      <div className="col col-5 d-flex justify-content-center pe-1">
                        <button className="btn btn-danger w-100" style={{ fontSize: `${windowWidth / 60}px` }} onClick={() => deleteField(index)}> Delete</button>

                      </div>
                    </div>
                  </div>


                </div>
              )}
            </> : <></>

        ))}

        {/* {signatures.map((signature, index) => (
          (signature.page === currentPage) ?
            <div key={index}
              style={{
                opacity: `${hoveredIndex || signature.editor.state ? 0.8 : 1}`,
                position: 'absolute', top: signature.y * (windowWidth) * ((pageHeight) / pageWidth), left: signature.x * (windowWidth),
                fontSize: `${windowWidth / 60}px`,
                padding: '4px',
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}>

              <SignatureModal updateSignature={updateSignature} url={signature.value} index={index} signer={"חתימה ראשונה"} />

            </div> : <div></div>

        ))} */}
      </div>
      {selectedFile && <div className="m-1">
        <button className="btn btn-secondary m-1" onClick={() => handlePageChange((currentPage === 1) ? currentPage : currentPage - 1)}><KeyboardArrowRightIcon /></button>
        <button className="btn btn-secondary m-1" onClick={() => handlePageChange((currentPage === numPages) ? currentPage : currentPage + 1)}><KeyboardArrowLeftIcon /></button>

        <br />
        <button className="btn btn-primary m-1" onClick={handleOpenPDF}>Open PDF</button>

        <button className="btn btn-primary m-1" onClick={saveInputFields}>Save Input Fields</button>

      </div>}



    </>
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
  { label: 'חתימה', value: 'signature1' },
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
  { label: '1', value: 'countryOfBirth' },
  { label: '2', value: 'yearOfArrival' },
  { label: '3', value: 'address' },
  { label: '4', value: 'zip' },
  { label: '5', value: 'dateOfBirth' },
  { label: '6', value: 'brother1' },
  { label: '7', value: 'brother2' },
  { label: '8', value: 'brother3' },
  { label: '9', value: 'brother4' },
  { label: '10', value: 'parentJob1' },
  { label: '11', value: 'parentHomeNumber1' },
  { label: '12', value: 'parentEmailAddress1' },
  { label: '13', value: 'parentJob2' },
  { label: '14', value: 'parentHomeNumber2' },
  { label: '15', value: 'parentEmailAddress2' },
  { label: '16', value: 'relativeName1' },
  { label: '17', value: 'relativeStatus1' },
  { label: '18', value: 'relativeNumber1' },
  { label: '19', value: 'relativeName2' },
  { label: '20', value: 'relativeStatus2' },
  { label: '21', value: 'relativeNumber2' },
  { label: '22', value: 'healthIssueExist' },
  { label: '23', value: 'healthIssueAndSolution' },
  { label: '24', value: 'allergyToMedication' },
  { label: '25', value: 'allergyToFood' },
  { label: '26', value: 'pastDiseases' },
  { label: '27', value: 'allergies' },
  { label: '28', value: 'receivedFullVaccination' },
  { label: '29', value: 'nonReceivedVaccinations' },
  { label: '30', value: 'hmo' },
  { label: '31', value: 'remarks' },
  { label: '32', value: 'attendanceStartingDate' },
  { label: '33', value: 'from' },
  { label: '34', value: 'signingDate' },
  { label: '35', value: 'className' },
  { label: '36', value: 'monthlyPayment' },
  { label: '37', value: 'paymentMethod' },
  { label: '38', value: 'allowsPhotographingInternal' },
  { label: '39', value: 'allowsPhotographingExternal' },
  { label: '40', value: 'approverName' },
  { label: '41', value: 'approverStatus' },
  { label: '42', value: 'approverAddress' },
  { label: '43', value: 'approverPhoneNumber' },
  { label: '45', value: 'signature2' },
  { label: 'אחר', value: 'other' },
];

const inputTypes = [
  "day",
  "month",
  "year",
  "childName",
  "childId",
  "parentName1",
  "parentId1",
  "phoneNumber1",
  "parentName2",
  "parentId2",
  "phoneNumber2",
  "kindergarten",
  "hebrewYear",
  "childFirstName",
  "childLastName",
  "dateOfBirth",
  "countryOfBirth",
  "yearOfArrival",
  "address",
  "zip",
  "brother1",
  "brother2",
  "brother3",
  "brother4",
  "parentJob1",
  "parentHomeNumber1",
  "parentEmailAddress1",
  "parentJob2",
  "parentHomeNumber2",
  "parentEmailAddress2",
  "relativeName1",
  "relativeStatus1",
  "relativeNumber1",
  "relativeName2",
  "relativeStatus2",
  "relativeNumber2",
  "healthIssueExist",
  "healthIssueAndSolution",
  "allergyToMedication",
  "allergyToFood",
  "pastDiseases",
  "allergies",
  "receivedFullVaccination",
  "nonReceivedVaccinations",
  "hmo",
  "remarks",
  "attendanceStartingDate",
  "from",
  "signingDate",
  "className",
  "monthlyPayment",
  "paymentMethod",
  "allowsPhotographingInternal",
  "allowsPhotographingExternal",
  "approverName",
  "approverStatus",
  "approverAddress",
  "approverPhoneNumber",
  "signature1",
  "signature2",
  "temp1",
  "temp2",
  "temp3",
  "temp4",

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
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
import Typography from '@mui/material/Typography';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function AddFormFieldsToPDF(props) {
  const [inputFields, setInputFields] = useState([]);
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

  const [addingTextInputField, SetAddingTextInoutField] = useState(false);

  const pdfFile = 'parents_agreement_fixed.pdf';
  const fontFileUrl = 'DavidLibre-Regular.ttf';

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Add event listener to handle window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    setContainerBounds(containerRef.current.getBoundingClientRect());

    console.log(containerBounds.bottom - containerBounds.top);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    const fetchNumPages = async () => {
      try {
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



  const handlePageClick = (event) => {
    console.log("at handle click");
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

    const clickX = event.clientX - containerX;
    const clickY = event.clientY - containerY;

    const newInputField = {
      x: clickXtemp,
      y: clickYtemp,
      value: `${newClick}`,
      page: currentPage,
      isCursor: false,
      click: newClick,
      editor: {
        state: false,
        width: 0.25,
        height: 1,
        font: 1
      }
    };

    setInputFields([...inputFields.filter(field => !field.isCursor), newInputField]);

    SetAddingTextInoutField(false);
  };

  const handleInputChange = (event, index) => {
    const updatedInputFields = [...inputFields];
    updatedInputFields[index].value = event.target.value;
    setInputFields(updatedInputFields);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setClickY(null); // Reset clickY when the page changes
  };

  const handleOpenPDF = async () => {
    console.log(inputFields);
    try {
      // Load the existing PDF document
      const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
      const pdfDoc = await PDFLibDocument.load(existingPdfBytes);

      // Register the fontkit instance
      pdfDoc.registerFontkit(fontkit);

      // Load the custom font file
      const fontBytes = await fetch(fontFileUrl).then(res => res.arrayBuffer());

      // Embed the font in the PDF document
      const customFont = await pdfDoc.embedFont(fontBytes);

      // Add the input field values as text on each page
      const pages = pdfDoc.getPages();
      inputFields.forEach(inputField => {
        const { value } = inputField;
        const { x, y } = inputField.click;
        pages.forEach((page, index) => {
          if (inputField.page === index + 1) {
            const pageHeight = page.getHeight();
            const sizeFornt = 10;
            const adjustedY = pageHeight - y - sizeFornt; // Adjust the y-coordinate
            page.drawText(value, { x, y: adjustedY, font: customFont, size: sizeFornt, color: rgb(0, 0, 0) });
          }
        });
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
    SetAddingTextInoutField(true);
  }

  const handleMouseMove = (event) => {
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

    const newInputField = {
      x: clickXtemp,
      y: clickYtemp,
      value: '',
      page: currentPage,
      isCursor: true,
      click: { x: 0, y: 0 },
      editor: {
        state: false,
        width: 0.25,
        height: 1,
        font: 1
      }
    };

    setInputFields([...inputFields.filter(field => !field.isCursor), newInputField]);

    console.log([window.scrollX, window.scrollY, inputFields.find(field => field.isCursor)]);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const switchEditorState = (index) => {
    const fieldToEdit = inputFields[index];
    fieldToEdit.editor.state = !fieldToEdit.editor.state;
    setInputFields([...inputFields.filter((field, liveIndex) => liveIndex !== index), fieldToEdit]);
  }

  const handleSliderChange = (event, newValue, index) => {
    setInputWidth(newValue, index);
  };

  const setInputWidth = (newValue, index) => {
    const fieldToEdit = inputFields[index];
    fieldToEdit.editor.width = newValue / 100;
    setInputFields([...inputFields.filter((field, liveIndex) => liveIndex !== index), fieldToEdit]);
  };


  const handleDragStart = (event) => {
    event.preventDefault();
  };

  const handleDragMove = (event, index) => {
    const delta = event.movementY;

    console.log(index);

    if (delta > 0) {
      setInputWidth(inputFields[index].filter.width - 1, index);
    } else if (delta < 0) {
      setInputWidth(inputFields[index].filter.width + 1, index);
    }
  };

  // Use the documentBytes as needed, e.g., display the PDF
  return (
    <div>
      <h1> add form field </h1>
      <BootstrapButton variant="contained" onClick={handleAddingTextInputField} disableRipple>
        Add Text Input Field
      </BootstrapButton>
      <div>
        Click coordinates: {clickX}, {clickY}
      </div>

      <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', position: 'relative' }} onMouseMove={addingTextInputField ? handleMouseMove : null}>
        <Document file={pdfFile}>
          {/* {Array.from(new Array(numPages), (el, index) => (
            <Page key={index} pageNumber={index + 1} onClick={handlePageClick} width={containerRef.current?.clientWidth} />
          ))} */}
          <div style={{ pointerEvents: `${addingTextInputField ? 'auto' : 'none'}` }} >
            {addingTextInputField ?
              (<Page key={currentPage - 1} pageNumber={currentPage} onClick={handlePageClick} width={containerRef.current?.clientWidth} />)
              : (<Page key={currentPage - 1} pageNumber={currentPage} width={containerRef.current?.clientWidth} />)}
          </div>
        </Document>
        {inputFields.map((inputField, index) => (
          (inputField.page === currentPage) ?
            <div><input
              key={index}
              type="text"
              value={inputField.value}
              onChange={(event) => handleInputChange(event, index)}
              style={{
                position: 'absolute', top: inputField.y * (windowWidth - 18) * ((pageHeight) / pageWidth), left: inputField.x * (windowWidth - 18),
                width: `${(windowWidth * inputField.editor.width / 1.5)}px`,
                height: `${windowWidth / 40}px`,
                fontSize: `${windowWidth / 60}px`,
                padding: '4px',
                // ...(windowWidth <= 768 && {
                //   width: '50px',
                //   height: '14px',
                //   fontSize: '8px',
                //   padding: '2px',
                // }),
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            // className="input-field"
            /> {hoveredIndex === index && (
              <FaEdit
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => switchEditorState(index)}
                style={{
                  height: `${windowWidth / 40}px`, marginLeft: `${windowWidth / 200}px`, cursor: 'pointer', position: 'absolute', top: (inputField.y * (windowWidth - 18) * ((pageHeight) / pageWidth)), left: (inputField.x * (windowWidth - 18)),
                }} />
            )} {inputField.editor.state && (
              <div style={{
                position: 'absolute',
                top: (inputField.y * (windowWidth - 18) * ((pageHeight) / pageWidth)) + windowWidth / 40,
                left: (inputField.x * (windowWidth - 18)),
                width: `${windowWidth / 4}px`
              }}>
                <div class="card p-1" >
                  <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        userSelect: 'none',
                        cursor: 'grab',
                      }}
                      draggable
                      onDragStart={handleDragStart}
                      onDrag={(event) => handleDragMove(event, index)}
                    >
                      <Typography variant="body1" style={{fontSize: `${windowWidth / 60}px`}}>{Math.trunc(inputField.editor.width * 100)}</Typography>
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
                    <button className="btn btn-success" style={{fontSize: `${windowWidth / 60}px`}} onClick={() => switchEditorState(index)}> Save</button>
                </div>

                
              </div>
            )}
            </div> : <div></div>

        ))}
      </div>
      <div>
        Current page: {currentPage}
      </div>
      <button onClick={() => handlePageChange((currentPage == 1) ? currentPage : currentPage - 1)}>Previous Page</button>
      <button onClick={() => handlePageChange((currentPage == numPages) ? currentPage : currentPage + 1)}>Next Page</button>


      <button onClick={handleOpenPDF}>Open PDF</button>


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
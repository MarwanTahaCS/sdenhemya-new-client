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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function AddFormFieldsToPDF(props) {
    const [inputFields, setInputFields] = useState(props.inputs);
    const [containerBounds, setContainerBounds] = useState([]);
    const [clicks, setClicks] = useState([]);
    const [clickX, setClickX] = useState(null);
    const [clickY, setClickY] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const containerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageWidth, setPageWidth] = useState(null);
    const [pageHeight, setPageHeight] = useState(null);

    const [addingTextInputField, SetAddingTextInoutField] = useState(false);

    const pdfFile = 'parents_agreement_fixed.pdf';
    const fontFileUrl = 'DavidLibre-Regular.ttf';


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

                const containerBounds = containerRef.current.getBoundingClientRect();
                setContainerBounds(containerBounds);

                console.log(inputFields);

            } catch (error) {
                console.error('Error occurred while fetching PDF:', error);
            }
        };

        fetchNumPages();
    }, [pdfFile]);

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

    // const handleMouseMove = (event) => {
    //     const containerBounds = containerRef.current.getBoundingClientRect();
    //     const containerX = containerBounds.left;
    //     const containerY = containerBounds.top;

    //     setContainerBounds(containerBounds);

    //     const clickX = event.clientX - containerX;
    //     const clickY = event.clientY - containerY;

    //     const newInputField = {
    //         x: clickX,
    //         y: clickY,
    //         value: '',
    //         page: currentPage,
    //         isCursor: true,
    //         click: { x: 0, y: 0 },
    //     };

    //     setInputFields([...inputFields.filter(field => !field.isCursor), newInputField]);

    //     console.log([window.scrollX, window.scrollY, inputFields.find(field => field.isCursor)]);
    // };

    // Use the documentBytes as needed, e.g., display the PDF
    return (
        <div>
            <h1> Sign Document </h1>

            <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', position: 'relative' }} >
                <Document file={pdfFile}>
                    <div style={{ pointerEvents: 'none' }} >
                        <Page key={currentPage - 1} pageNumber={currentPage} width={containerRef.current?.clientWidth} />
                    </div>
                </Document>
                {inputFields.map((inputField, index) => (
                    (inputField.page === currentPage) ?
                        <input
                            key={index}
                            type="text"
                            value={inputField.value}
                            onChange={(event) => handleInputChange(event, index)}
                            style={{  position: 'absolute', top: inputField.y  , left: inputField.x }}
                            className="input-field"
                        /> : <div></div>

                ))}
            </div>

            

            <div className="text-fields" style={{ marginTop: '20px', position: 'relative'  }}>
                
            </div>

            <div>
                Current page: {currentPage}
            </div>

            <button onClick={() => handlePageChange((currentPage == 1) ? currentPage : currentPage - 1)}>Previous Page</button>
            <button onClick={() => handlePageChange((currentPage == numPages) ? currentPage : currentPage + 1)}>Next Page</button>

            <br />
            <br />
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
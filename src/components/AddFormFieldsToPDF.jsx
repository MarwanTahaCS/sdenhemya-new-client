import React, { useState, useEffect, useRef } from "react";
import { PDFDocument, rgb } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf/renderer';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Import the required CSS file
import "react-pdf/dist/esm/Page/TextLayer.css";
import { PDFDownloadLink, Page as PdfPage, Text, View, Document as PdfDocument, StyleSheet } from '@react-pdf/renderer';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function AddFormFieldsToPDF(props) {
  const [clicks, setClicks] = useState([]);
  const [clickX, setClickX] = useState(null);
  const [clickY, setClickY] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(null);
  const [pageHeight, setPageHeight] = useState(null);

  const pdfFile = 'parents_agreement_fixed.pdf';

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

    const containerwidthX = containerBounds.right - containerBounds.left;
    const containerwidthY = containerBounds.bottom - containerBounds.top;

    // console.log([containerwidthX, containerwidthY]);
    const clickXtemp = ((event.clientX - containerX) / containerwidthX) * pageWidth;
    const clickYtemp = ((event.clientY - containerY) / containerwidthY) * pageHeight;
    setClickX(clickXtemp);
    setClickY(clickYtemp);

    const newClick = { x: clickXtemp, y: clickYtemp };
    setClicks([...clicks, newClick]);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setClickY(null); // Reset clickY when the page changes
  };

  const renderPdfContent = () => {
    return (
      <PdfPage>
        {/* <Text style={[styles.text, { top: clickY, left: clickX }]}>Your Text Field</Text> */}
        {clicks.map((click, index) => (
          <View key={index} style={[styles.textContainer, { top: click.y, left: click.x }]}>
            <Text>Your Text Field</Text>
          </View>
        ))}
      </PdfPage>
    );
  };

  // Use the documentBytes as needed, e.g., display the PDF
  return (
    <div>
      <h1> add form field </h1>

      <div>
        Click coordinates: {clickX}, {clickY}
      </div>

      <div ref={containerRef} style={{ width: '100%', overflow: 'hidden' }}>
        <Document file={pdfFile}>
          {/* {Array.from(new Array(numPages), (el, index) => (
            <Page key={index} pageNumber={index + 1} onClick={handlePageClick} width={containerRef.current?.clientWidth} />
          ))} */}
          <Page key={currentPage - 1} pageNumber={currentPage} onClick={handlePageClick} width={containerRef.current?.clientWidth} />
        </Document>
      </div>
      <div>
        Current page: {currentPage}
      </div>
      <button onClick={() => handlePageChange((currentPage == 1) ? currentPage : currentPage - 1)}>Previous Page</button>
      <button onClick={() => handlePageChange((currentPage == numPages) ? currentPage : currentPage + 1)}>Next Page</button>

      <div style={{ marginTop: '20px' }}>
        <PDFDownloadLink document={
          <PdfDocument>
            {
              renderPdfContent()
            }
          </PdfDocument>
        } fileName="modified_document.pdf">
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download modified document'
          }
        </PDFDownloadLink>
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
});
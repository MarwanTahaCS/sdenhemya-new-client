import { useState, useEffect } from "react";
import React from "react";
import Axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function App(props) {
    const [loading, setIsLoading] = useState(false);
    const [submittedData, setSubmittedData] = useState([]);
    const [error, setError] = useState(null);

    // const localUrl = "http://localhost:3001/api/documentSign";
    const localUrl = "https://api.myvarno.io/api/documentSign";

    useEffect(() => {

        async function getSubmittedData() {
            setIsLoading(true);
            try {
                console.log("fetching submitted data");
                const response = await Axios.get(localUrl);
                console.log(response.data);
                setSubmittedData(response.data);
                setIsLoading(false);
            }
            catch (err) {
                setError(err);
                console.log(err);
                setIsLoading(false);
            }
        }


        getSubmittedData();


    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <ErrorIcon color="error" />
                Error: {error.message}
            </div>
        );
    }

    const createExcelFile = async () => {
        if (submittedData.length === 0) {
            return; // Return if no data is available
        }

        const keys = Object.keys(submittedData[0]);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SubmittedData');
        console.log("keys:");
        console.log(keys);
        // Add header row
        const headerRow = worksheet.addRow(keys);
        headerRow.font = { bold: true };

        // Add data rows
        submittedData.forEach(documentData => {
            worksheet.addRow(Object.values(documentData));
        });

        const blob = new Blob([await workbook.xlsx.writeBuffer()], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        saveAs(blob, 'הגשות.xlsx');
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'center', /* Horizontally center */
                alignItems: 'center',
                padding: '5px'
            }}>
                <Button variant="contained" color="primary" onClick={createExcelFile}>
                    הורד רשימה מלאה
                </Button>
            </div>

            <TableContainer component={Paper}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ת"ז</TableCell>
                            <TableCell>שם הילד</TableCell>
                            <TableCell>שם הורה 1</TableCell>
                            <TableCell>מספר פ. הורה 1</TableCell>
                            <TableCell>שם הורה 2</TableCell>
                            <TableCell>מספר פ. הורה 2</TableCell>
                            <TableCell>קישור למסמך החתום</TableCell>
                            {/* <TableCell>Email</TableCell> */}
                            {/* ... other table header cells */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submittedData.map((document, index) => (
                            <TableRow key={index}>
                                <TableCell>{document.childId}</TableCell>
                                <TableCell>{document.childName}</TableCell>
                                <TableCell>{document.parentName1}</TableCell>
                                <TableCell>{document.phoneNumber1}</TableCell>
                                <TableCell>{document.parentName2}</TableCell>
                                <TableCell>{document.phoneNumber2}</TableCell>
                                <TableCell style={{ direction: 'ltr' }}><Link href={document.pdfFileURL} target="_blank" rel="noopener noreferrer">
                                    {document.pdfFileURL}
                                </Link></TableCell>
                                {/* <TableCell>{user.email}</TableCell> */}
                                {/* ... other table cells */}
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
                {submittedData.length === 0 && <h6 style={{ textAlign: 'center', display: 'block' }}>הרשימה עדיין ריקה</h6>}
            </TableContainer>
        </div>
    );
}

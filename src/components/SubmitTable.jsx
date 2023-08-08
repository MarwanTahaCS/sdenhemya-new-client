import { useState, useEffect } from "react";
import React from "react";
import Axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

export default function App(props) {
    const [loading, setIsLoading] = useState(false);
    const [submittedData, setSubmittedData] = useState([]);
    const [error, setError] = useState(null);

    const localUrl = "http://localhost:3001/api/documentSign";
    // const localUrl = "https://api.myvarno.io/api/documentSign";

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



    return (
        <div>
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

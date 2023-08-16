import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { Form, Button } from 'react-bootstrap';
import Resizer from 'react-image-file-resizer';

// imports for radio form
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormControl } from "@mui/material";
import Axios from 'axios';
import { Error as ErrorIcon } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

import 'bootstrap/dist/css/bootstrap.min.css';


import SignatureModal from "./SignatureModal.jsx";


export default function Reception(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [documentData, setDocumentData] = useState(props.documentData);
    const [url1, setUrl1] = useState(props.documentData.signature1);
    const [url2, setUrl2] = useState(props.documentData.signature1);
    const [internal, setInternal] = useState("");
    const [allergyExistance, setAllergyExistance] = useState({
        allergyToMedication: "false",
        allergyToFood: "false",
        pastDiseases: "false",
        allergies: "false",
    });

    const navigate = useNavigate();

    const [selectedImage1, setSelectedImage1] = useState(null);
    const [selectedImage2, setSelectedImage2] = useState(null);

    const handleImageChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            Resizer.imageFileResizer(
                file,
                650, // Set the maximum width in pixels
                650, // Set the maximum height in pixels
                'JPEG', // Output format
                70, // Compression quality (0-100)
                0, // Rotation (0-360)
                (uri) => {
                    if (index === 1) {
                        setSelectedImage1(uri);
                    } else {
                        setSelectedImage2(uri);
                    }

                },
                'base64', // Output type ('base64', 'blob', or 'file')
                400, // Set the maximum file size in bytes
                400 // Set the maximum file size in bytes for iOS
            );
        }
    };

    const options = [
        { value: "", label: "בחר גן/פעוטון" },
        { value: "פעוטון בית קשת", label: "פעוטון בית קשת" },
        { value: "סנונית – גנון", label: "סנונית – גנון" },
        { value: "רימון – גן צעיר", label: "רימון – גן צעיר" },
        { value: "שיטה – גן בוגר", label: "שיטה – גן בוגר" },
    ];

    const yearOptions = [
        { value: "", label: "בחר שנתון" },
        { value: "2017", label: "2017" },
        { value: "2018", label: "2018" },
        { value: "2019", label: "2019" },
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
    ];

    function updateDocumentData(event) {
        const { value, name } = event.target;
        setDocumentData((prevValue) => {
            return {
                ...prevValue,
                [name]: value,
            };
        });

        console.log({
            ...documentData,
            [name]: value,
        })

        // props.setDocumentData({
        //   ...orgDetailsData,
        //   [name]: value,
        // });
    }

    function updateKindergarten(event) {
        const { value, name } = event.target;



        setDocumentData((prevValue) => {
            return {
                ...prevValue,
                [name]: value,
                ["monthlyPayment"]: getPrice(value, internal),
            };
        });
    }

    function updateMonthlyPayment(event) {
        const { value, name } = event;
        setDocumentData((prevValue) => {
            return {
                ...prevValue,
                [name]: value,
            };
        });

        // props.setDocumentData({
        //   ...orgDetailsData,
        //   [name]: value,
        // });
    }

    function updateSignature(id, url) {
        setDocumentData((prevValue) => {
            return {
                ...prevValue,
                [`signature${id}`]: url,
            };
        });
    }

    function getPrice(kindergarten, internal) {
        if (internal === "true") {
            console.log("in true")
            switch (kindergarten) {
                case "פעוטון בית קשת":
                    return "3400";
                case "סנונית – גנון":
                    return "3150";
                case "רימון – גן צעיר":
                    return "1750";
                case "שיטה – גן בוגר":
                    return "1700";
            }
        } else {
            console.log("in false")
            switch (kindergarten) {
                case "פעוטון בית קשת":
                    return "3800";
                case "סנונית – גנון":
                    return "3550";
                case "רימון – גן צעיר":
                    return "2150";
                case "שיטה – גן בוגר":
                    return "2100";
            }
        }
    }

    function updatePrice(eventTargetValue) {
        const value = eventTargetValue;
        setInternal(value);
        if (value === "true") {
            console.log("in true")
            switch (documentData.kindergarten) {

                case "פעוטון בית קשת":
                    updateMonthlyPayment({ value: "3,400", name: "monthlyPayment" });
                    break;
                case "סנונית – גנון":
                    updateMonthlyPayment({ value: "3,150", name: "monthlyPayment" });
                    break;
                case "רימון – גן צעיר":
                    updateMonthlyPayment({ value: "1,750", name: "monthlyPayment" });
                    break;
                case "שיטה – גן בוגר":
                    updateMonthlyPayment({ value: "1,700", name: "monthlyPayment" });
                    break;
            }
        } else {
            console.log("in false")
            switch (documentData.kindergarten) {

                case "פעוטון בית קשת":
                    updateMonthlyPayment({ value: "3,800", name: "monthlyPayment" });
                    break;
                case "סנונית – גנון":
                    updateMonthlyPayment({ value: "3,550", name: "monthlyPayment" });
                    break;
                case "רימון – גן צעיר":
                    updateMonthlyPayment({ value: "2,150", name: "monthlyPayment" });
                    break;
                case "שיטה – גן בוגר":
                    updateMonthlyPayment({ value: "2,100", name: "monthlyPayment" });
                    break;
            }
        }

        console.log(documentData);
    }

    //   const localUrl = "http://localhost:3001/api/documentSign";
    const localUrl = "https://api.myvarno.io/api/documentSign";

    async function saveData(newDocumentData, selectedImage, selectedImage2) {
        setLoading(true);

        try {
            console.log("in save data class")
            const response = await Axios.post(localUrl, {
                image: selectedImage,
                image2: selectedImage2,
                data: newDocumentData,
            });
            // console.log(localUrl);

            console.log(response.data.documentURL);
            setLoading(false);
            return response.data.documentURL;
        }
        catch (err) {
            console.log(err);
            setLoading(false);
            setError(err);
            return err;
        }



    }

    async function printOnDocument(event) {
        event.preventDefault();

        const importantfields = ["month", "year", "day", "childId", "childName", "approverName", "approverStatus", "approverAddress", "approverPhoneNumber", 
            "hebrewYear", "childFirstName", "childLastName", "dateOfBirth", "address", "zip", "relativeName1", "relativeStatus1", "relativeNumber1", "hmo",
            "attendanceStartingDate", "signingDate", "className", "paymentMethod", "kindergarten"]
        const unfilledFields = Object.keys(documentData).filter(fieldName => documentData[fieldName] === '' && importantfields.includes(fieldName));

        if (unfilledFields.length === 0) {
            if (documentData.childId === '' || documentData.childName === '' || documentData.approverName === ''
                || documentData.approverStatus === '' || documentData.approverAddress === '' || documentData.approverPhoneNumber === ''
                || documentData.month === '' || documentData.year === '' || documentData.day === ''

                || documentData.hebrewYear === '' || documentData.childFirstName === '' || documentData.childLastName === ''
                || documentData.dateOfBirth === '' || documentData.address === '' || documentData.zip === ''
                || documentData.relativeName1 === '' || documentData.relativeStatus1 === '' || documentData.relativeNumber1 === ''
                || documentData.hmo === '' || documentData.attendanceStartingDate === ''
                || documentData.signingDate === '' || documentData.kindergarten === '') {
                alert('אנא מלא את כל שדות הקלט');
                return;
            } else if ((documentData.parentId1 === '' || documentData.phoneNumber1 === '' || documentData.parentName1 === '')
            && (documentData.parentId2 === '' || documentData.phoneNumber2 === '' || documentData.parentName2 === '')) {
                document.querySelector(`#parentJob1`).scrollIntoView({ behavior: 'smooth' });
                alert('חובה למלא לפחות נתוני אחד מבין ההורים.');
                return;
            } else if (selectedImage1 === null) {
                alert('אנא חזור לנספח ג, וצרף צילום תעודת הזהות של ההורים וצילום הספח בו רשום הילד(ודא שקובץ הצלום הוא תמונה ולא סוג קובץ אחר).');
                return;
            } else if (selectedImage2 === null && ((documentData.parentId2 !== '' && documentData.phoneNumber2 !== '' && documentData.parentName2 !== '') 
                && (documentData.parentId1 !== '' && documentData.phoneNumber1 !== '' && documentData.parentName1 !== '')) ) {
                alert('שמנו לב שהכנסתם נתוני הורה שני, אך לא צירפתם תעודת זהות הורה שני, אנא חזורו לנספח ג, וצרף צילום תעודת הזהות של ההורה השני עם צילום הספח בו רשום הילד(ודא שקובץ הצלום הוא תמונה ולא סוג קובץ אחר).');
                return;
            } else if (documentData.paymentMethod === '') {
                alert('אנא חזור לנספח ד סעיף 6, ובחר אמצעי תשלום .');
                return;
            } else if (internal === '') {
                alert('אנא חזור לנספח ד סעיף 3, ובחר האם אתה תושב שדה נחמיה או תושב חוץ .');
                return;
            } else if (documentData.signature1 === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC") {
                alert('בבקשה תוודאו שחתמתם את המסמך');
                return;
            } else if (documentData.signature2 === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAADICAYAAAC3QRk5AAAAAXNSR0IArs4c6QAABmJJREFUeF7t1DENADAMBLEEQPnTrVQKvdEB8IMV3c7MGUeAAAEC3wIrqN+GBggQIPAEBNUjECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIEBNUPECBAIBIQ1AjSDAECBATVDxAgQCASENQI0gwBAgQE1Q8QIEAgEhDUCNIMAQIELjoXCvGAGlIAAAAAAElFTkSuQmCC"
                && ((documentData.parentId2 !== '' && documentData.phoneNumber2 !== '' && documentData.parentName2 !== '') 
                    && (documentData.parentId1 !== '' && documentData.phoneNumber1 !== '' && documentData.parentName1 !== ''))) {
                alert('שמנו לב שהוספתם פרטי הורי שני, לכן אננא הוסיפו חתימת הורה שני.');
                return;
            }

            const result = await saveData(documentData, selectedImage1, selectedImage2);

            navigate(`/success/${result.split('/').pop().split('.')[0]}`);
        } else {
            // Redirect user to first unfilled field
            const firstUnfilledField = unfilledFields[0];
            document.querySelector(`#${firstUnfilledField}`).scrollIntoView({ behavior: 'smooth' });
            alert('אנא וודא שלא פספסת קלט ריק');
        }

        console.log(unfilledFields);

    }

    const [fontSize, setFontSize] = useState(14); // Initial font size
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1200) {
            setFontSize(16);
        } else if (screenWidth >= 768) {
            setFontSize(15);
        } else if (screenWidth >= 435) {
            setFontSize(14);
        } else if (screenWidth >= 395) {
            setFontSize(13);
        } else if (screenWidth >= 365) {
            setFontSize(12);
        } else {
            setFontSize(10);
        }
    };

    useEffect(() => {

        handleResize();

        // Add event listener when the component mounts
        window.addEventListener('resize', handleResize);

        // Remove event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function MyComponent() {
        return (
            <div>
                 <img src="/holidays.png" alt="My Image" width="90%" />
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh' /* Set a minimum height to fill the viewport */
            }}>
                <CircularProgress /> {/* Or any loading indicator you prefer */}
            </div>
        );
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
        <div className="container py-3">
            <form onSubmit={printOnDocument}>
                <div className="p-3 text-center">
                    <button type="submit" className="btn btn-primary btn-sm" >
                        הגשה
                    </button>
                </div>
                <div className="card m-1">
                    <h5 className="p-3 text-center david">
                        <b> <u> הסכם חינוך גיל רך </u></b> {/* {props.t("Reception.1")} */}
                    </h5>
                    <div className=" px-1 pb-3 text-center david " style={{ fontSize: `${fontSize - 1}px` }}  >

                        {/* <div className="text-nowrap"> שנערך ונחתם בקיבוץ שדה נחמיה ביום </div> */}
                        <b>
                            שנערך ונחתם בקיבוץ שדה נחמיה ביום <input
                                className=""
                                onChange={updateDocumentData}
                                type="text"
                                name="day"
                                // placeholder={props.t("OrgDetails.3")}
                                autoComplete="off"
                                id="day"
                                value={documentData.day}
                                style={{ width: `${fontSize * 2}px` }}
                            /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> לחודש <input
                                className=""
                                onChange={updateDocumentData}
                                type="text"
                                name="month"
                                // placeholder={props.t("OrgDetails.3")}
                                autoComplete="off"
                                id="month"
                                value={documentData.month}
                                style={{ width: `${fontSize * 2}px` }}
                            /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> שנת <input
                                className=""
                                onChange={updateDocumentData}
                                type="text"
                                name="year"
                                // placeholder={props.t("OrgDetails.3")}
                                autoComplete="off"
                                id="year"
                                value={documentData.year}
                                style={{ width: `${fontSize * 2}px` }}
                            /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}>*</span>
                        </b>
                    </div>
                    {/* ------- בין: ----------------------------------------------------------------- */}
                    < div className="container   pb-3 david " style={{ fontSize: `${fontSize + 1}px` }}>
                        <div className="row mx-auto">
                            <div className="col-2 px-0"><b> בין: </b></div>
                            <div className="col-10"><b>מתיישבי שדה נחמיה אגודה שיתופית להתיישבות קהילתית בע"מ </b><br />
                                מקיבוץ שדה נחמיה <br />
                                ד.נ. גליל עליון <br />
                                (להלן: <b>"האגודה"</b>) <br />
                                <p className="text-start"> <b><u> מצד אחד; </u></b></p>
                            </div>
                        </div>
                        <div className="row mx-auto">
                            <div className="col-2 px-0"> <b>לבין: </b></div>
                            <div className="col-10">הורי הילד <input
                                className=""
                                onChange={updateDocumentData}
                                type="text"
                                name="childName"
                                // placeholder={props.t("OrgDetails.3")}
                                autoComplete="off"
                                id="childName"
                                value={documentData.childName}
                                style={{ width: `${fontSize * 5}px` }}
                            /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> ת"ז <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="childId"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="childId"
                                    value={documentData.childId}
                                    style={{ width: `${fontSize * 5}px` }}
                                /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> <br />
                                (להלן: <b>"הילד"</b>) <br />
                                1.	שםֹ  ההורה <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="parentName1"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="parentName1"
                                    value={documentData.parentName1}
                                    style={{ width: `${fontSize * 5}px` }}
                                /> <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  	ת"ז  <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="parentId1"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="parentId1"
                                    value={documentData.parentId1}
                                    style={{ width: `${fontSize * 5}px` }}
                                /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  {windowWidth < 550 ? <br /> : null} פלאפון  <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="phoneNumber1"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="phoneNumber1"
                                    value={documentData.phoneNumber1}
                                    style={{ width: `${fontSize * 5}px` }}
                                /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> <br />
                                2.	שםֹ  ההורה  <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="parentName2"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="parentName2"
                                    value={documentData.parentName2}
                                    style={{ width: `${fontSize * 5}px` }}
                                /> 	ת"ז  <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="parentId2"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="parentId2"
                                    value={documentData.parentId2}
                                    style={{ width: `${fontSize * 5}px` }}
                                /> {windowWidth < 550 ? <br /> : null} פלאפון  <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="phoneNumber2"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="phoneNumber2"
                                    value={documentData.phoneNumber2}
                                    style={{ width: `${fontSize * 5}px` }}
                                /> <br />
                                (להלן ביחד ולחוד: <b>"ההורים"</b>) <br />
                                <p className="text-start"><b><u> מצד שני;</u></b> </p>
                            </div>
                        </div>
                        <div className="row mx-auto">
                            <div className="col-2 px-0"> <b>הואיל </b></div>
                            <div className="col-10 mb-3"><div>והאגודה מנהלת ומחזיקה בתחום קיבוץ שדה נחמיה בתי ילדים ובהם גן/פעוטון "
                                <select style={{ fontSize: `${fontSize + 1}px`, fontWeight: 'bold' }}
                                    name="kindergarten"
                                    value={documentData.kindergarten}
                                    onChange={updateKindergarten}
                                    id="kindergarten">
                                    {options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> " המיועד לילדי שדה נחמיה לשנתון
                                <>
                                    <select
                                        style={{ fontSize: `${fontSize + 1}px`, fontWeight: 'bold' }}
                                        name="hebrewYear"
                                        value={documentData.hebrewYear}
                                        onChange={updateDocumentData}
                                        id="hebrewYear">
                                        {yearOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                                </>
                                (להלן: <b>"בתי הילדים"</b>); </div>
                            </div>
                        </div>
                        <div className="row mx-auto">
                            <div className="col-2 px-0"> <b> והואיל </b></div>
                            <div className="col-10">
                                <p className="">
                                    והשירותים הניתנים בבית הילדים רחבים מסל שירותים הבסיסיים בגני חובה/פעוטונים לפי הכללים של משרד החינוך ו/או התקנים של משרד הכלכלה: מבחינת ימי ושעות הפעילות, לרבות הפעילות בחופשים; מבחינת סל התרבות והיצע הפעילויות הניתנים לילד; מבחינת ההיצע והאיכות של המזון המוגש לילד מדי יום; ומבחינת תוספת שעות טיפול במהלך יום הפעילות.
                                </p>
                            </div>
                        </div>
                        <div className="row mx-auto">
                            <div className="col-2 px-0"> <b> הואיל </b></div>
                            <div className="col-10">
                                <p>
                                    וההורים, פנו לאגודה בבקשה כי תתיר לילד לשהות בבית הילדים של האגודה בהתאם לגילו בשנה"ל תשפ"ד, לאחר ובכפוף להעברת פעילות החינוך לידי האגודה כאמור לעיל;
                                </p>
                            </div>
                        </div>
                        <div className="row mx-auto">
                            <div className="col-2 px-0"> <b> הואיל </b> </div>
                            <div className="col-10">
                                <p>
                                    והאגודה הסכימה לקליטת הילד בבית הילדים לאחר ובכפוף להעברת פעילות החינוך לידי האגודה כאמור לעיל וזאת בהתאם להוראות הסכם זה;
                                </p>
                            </div>
                        </div>

                        {/* ---------------------------------------------------------------------- */}
                    </div >
                    <div className=" px-3 pb-3 text-center david" style={{ fontSize: `${fontSize + 4}px` }}>
                        <b> <u> על כן הותנה, הוצהר והוסכם כלהלן:</u></b>
                    </div>

                    {/* ------- על כן הותנה ----------------------------------------------------------------- */}
                    <div style={{ fontSize: `${fontSize}px` }}>
                        {/* ---------- 1. --------------------------------------------------- */}
                        <div className="container   pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>1.   <u>מבוא</u></b></div>
                            </div>
                            <div className="row  mx-0" style={{ fontSize: `${fontSize}px` }}>
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">1.1.</div>
                                            <div className="col-11 ">
                                                המבוא להסכם זה מהווה חלק בלתי נפרד ממנו.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">1.2.</div>
                                            <div className="col-11 ">
                                                כותרות ההסכם תשמשנה לנוחות בלבד ולא תשמשנה לפירוש תוכן הסעיפים.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">1.3.</div>
                                            <div className="col-11 ">
                                                הנספחים להסכם זה מהווים חלק בלתי נפרד ממנו.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* --------- 2. ---------------------------------------------------------------- */}
                        <div className="container   pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>2.	<u>אורחות חיים וחינוך</u></b></div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david" style={{ fontSize: `${fontSize}px` }}>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">2.1.</div>
                                            <div className="col-11">
                                                אורחות החיים, דרכי החינוך, התכניות והטיפול בבית הילדים יהיו כנהוג ביישוב שדה נחמיה ו/או באגודה ויהיו נתונים לשיקול צוות החינוך של האגודה והנהלתה, לרבות כל הנוגע לשינויים במבנה בית הילדים ו/או שינויים בצוות המחנך.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">2.2.</div>
                                            <div className="col-11">
                                                הילד יהיה חלק ממסגרת בית הילדים, ישהה בה וישתתף בפעילויות כשאר הילדים. מוסכם כי הילד מהווה חלק ממסגרת בית הילדים וכל יציאה שלו ממנה פוגעת בתפקוד השוטף והמלא של בית הילדים.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* -------- 3. ----------------------------------------------------------------- */}
                        <div className="container   pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>3.	<u>מועדי שהייה בבית הילדים</u></b></div>
                            </div>
                            {/* ---------- 3.1. ---------------------------------------------------- */}
                            <div className="row  mx-0">
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    3.1.	<u>ימי ושעות פעילות:</u>
                                </div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    <div className=" px-0 pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0"></div>
                                            <div className="col-11 px-0">
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.1.1</div>
                                                    <div className="col-10">
                                                        בימים א'-ה': 7:00-16:00.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.1.2</div>
                                                    <div className="col-10">
                                                        בימי ו' : 7:00-13:00.  <br /> בערבי חג , הגנים  יהיו פתוחים, עד השעה 12:00.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.1.3</div>
                                                    <div className="col-10">
                                                        ההורים מודעים ומסכימים כי חריגה מהזמנים המצוינים בסעיף זה תביא לפגיעה בתפקוד השוטף של בית הילדים ולעיכוב ביציאת הצוות הביתה.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.1.4</div>
                                                    <div className="col-10">
                                                        האחריות על הילד על פי כל דין עד למועד פתיחת בית הילדים ולאחר השעה 16:00 תחול על ההורים בלבד.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.1.5</div>
                                                    <div className="col-10">
                                                        ההורים מתבקשים לאסוף את ילדיהם 10 דקות לפני סגירת הגנים ובכל מקרה לא יאוחר מהאמור בשעות הפעילות.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ----- 3.2. -------------------------------------------------------------------- */}
                            <div className="row  mx-0">
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0" style={{ fontSize: `${fontSize}px` }}>
                                    3.2.	<u>חגים:</u>
                                </div>
                            </div>
                            <div className="row  mx-0 " style={{ fontSize: `${fontSize}px` }}>
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    <p>
                                        בית הילדים יהיה סגורים בחגים  עפ"י לוח החופשות המצורף בהסכם זה <b>(נספח "א")</b>.
                                    </p>
                                </div>
                            </div>
                            {/* ---- 3.3. ---------------------------------------------------------------------------- */}
                            <div className="row  mx-0" style={{ fontSize: `${fontSize}px` }}>
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    3.3.	<u>סגירת בית הילדים:</u>
                                </div>
                            </div>
                            <div className="row  mx-0 " style={{ fontSize: `${fontSize}px` }}>
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    <p>
                                        האגודה שומרת לעצמה את הזכות לשנות את שעות הפעילות של בית הילדים ו/או לסגור את בית הילדים במקרים הבאים:
                                    </p>
                                </div>
                            </div>
                            <div className="row  mx-0" style={{ fontSize: `${fontSize}px` }}>
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    <div className=" px-0 pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0"></div>
                                            <div className="col-11 px-0">
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.3.1</div>
                                                    <div className="col-10">
                                                        באירועים מיוחדים כגון: מסיבות, או אירועים חריגים  וכד'.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.3.2</div>
                                                    <div className="col-10">
                                                        בחודש אוגוסט למשך 10 ימי עבודה, לצורך הערכות לקראת שנה"ל שלאחר מכן.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.3.3</div>
                                                    <div className="col-10">
                                                        לצורך "גשר" – ימים בודדים בין חגים ושבתות, בהתאם ללוח השנה וליום בו יחול החג.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.3.4</div>
                                                    <div className="col-10">
                                                        לפי הנחיות משרד הבריאות ו/או הנחיות הממשלה ו/או כל גוף מוסמך אחר.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.3.5</div>
                                                    <div className="col-10">
                                                        כל סיבה אחרת שלא תאפשר את פתיחת בית הילדים במתכונת מלאה, (לרבות אילוץ היעדרות של מספר מטפלות מעבודתן עקב מחלה).
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ------ 3.4. ----------------------------------------- */}
                            <div className="row  mx-0" style={{ fontSize: `${fontSize}px` }}>
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    <div className="row mx-0 ">
                                        <div className="col-1 px-0">3.4. </div>
                                        <div className="col-11 px-0">
                                            בכל מקרה תועבר לידי ההורים הודעה בכתב על דבר השינויים ו/או סגירת בתי הילדים לכל הפחות שבועיים מראש, אלא במקרה חירום או כח עליון ו/או במקרים של הנחיות גופים מוסמכים כאמור בסעיף 3.3.4 לעיל.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* --------- 3.5. -------------------------------------------- */}
                            <div className="row  mx-0">
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    3.5.	<u>חופשה:</u>
                                </div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"> </div>
                                <div className="col-11 px-0">
                                    <div className=" px-0 pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0"></div>
                                            <div className="col-11 px-0">
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.5.1</div>
                                                    <div className="col-10">
                                                        ההורים יהיו רשאים לקחת את הילד לחופשה לאחר תאום מראש עם הצוות המחנך באגודה, התיאום ייעשה זמן סביר מראש בהתאם לאורך החופשה הצפויה.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">3.5.2</div>
                                                    <div className="col-10">
                                                        מובהר ומוסכם בזאת כי תשלום דמי השהייה, כמפורט בסעיף ‏12 להלן, יימשך כסדרו גם בתקופת החופשה כאמור לעיל.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 4. --------------------------------------------- */}
                        <div className="container   pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>4.	<u>אוכל</u></b></div>
                            </div>
                            <div className="row  mx-0" style={{ fontSize: `${fontSize}px` }}>
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">4.1.</div>
                                            <div className="col-11">
                                                האגודה תספק לילד 2 ארוחות ו- אחת או שתי ארוחות ביניים במהלך יום פעילות מלא.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">4.2.</div>
                                            <div className="col-11">
                                                בימי ו' ו/או ערבי חג, תספק האגודה לילד ארוחה אחת וארוחת ביניים אחת.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">4.3.</div>
                                            <div className="col-11">
                                                היה ותידרש דיאטת מזון מיוחדת, יסופק האוכל ע"י ההורים.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 5. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row  mx-0">
                                <div className="col-1 px-0" style={{ fontSize: `${fontSize}px` }}><b>5.</b></div>
                                <div className="col-11 px-0" >
                                    <div style={{ fontSize: `${fontSize}px` }}><b><u> ביגוד והנעלה </u></b></div> <div style={{ fontSize: `${fontSize}px` }}>ההורים ידאגו להבאת בגדים ונעלים לילד, ללקיחתם ולניקיונם, לפי הנחיות האגודה. מומלץ לסמן את הבגדים נגד אובדן. </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 6. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row  mx-0">
                                <div className="col-1 px-0" style={{ fontSize: `${fontSize}px` }}><b>6.</b></div>
                                <div className="col-11 px-0">
                                    <div style={{ fontSize: `${fontSize}px` }}><b><u> מגבות וכלי מיטה </u></b> </div><div style={{ fontSize: `${fontSize}px` }}> ההורים יביאו מגבת גדולה, מגבות קטנות, כלי מיטה ושמיכות לשימוש הילד באגודה וידאגו לניקיונם מעת לעת. </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 7. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row  mx-0">
                                <div className="col-1 px-0"><b>7.</b></div>
                                <div className="col-11 px-0">
                                    <b><u> מנוחה </u></b><br /> האגודה תספק לילד מזרון ו/או מיטה למנוחת הצהריים לילד שזקוק לו.
                                </div>
                            </div>
                        </div>
                        {/* ----------- 8. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>8.    <u>בריאות</u></b></div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.1.</div>
                                            <div className="col-11">
                                                האחריות לשמירת בריאותו של הילד וכל הטיפול הרפואי בו, לרבות חיסונים, מעקב התפתחותי וטיפול שיניים, מוטלת על ההורים.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.2.</div>
                                            <div className="col-11">
                                                מוצהר במפורש כי השהייה בבית הילדים אינה כוללת טיפולים רפואיים, טיפולים פרה רפואיים, טיפולים מיוחדים וחיסונים.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.3.</div>
                                            <div className="col-11">
                                                באחריות ההורים לדאוג לניקיון הראש של הילד: כינים וכו'.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.4.</div>
                                            <div className="col-11">
                                                עזרה ראשונה תינתן על ידי הקיבוץ לפי המקובל באגודה ועל חשבון ההורים, למעט במקרה שיש לכך כיסוי על ידי קופת חולים.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.5.</div>
                                            <div className="col-11">
                                                ההורים מסמיכים בזאת את האגודה לדאוג למתן עזרה ראשונה לילד לפי שיקול דעתה ומשחררים אותה מאחריות לכל נזק שעלול להיגרם לילד עקב טיפול שכזה.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.6.</div>
                                            <div className="col-11">
                                                ההורים מצהירים כי הם חברי קופת חולים כלשהי ומתחייבים להמציא לאגודה אישור על זכות הילד לקבל עזרה רפואית ע"י קופת – חולים.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.7.</div>
                                            <div className="col-11">
                                                ההורים משחררים בזאת את האגודה מכל אחריות למחלה כלשהי שהילד יחלה בה בזמן או עקב שהותו בבית הילדים.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.8.</div>
                                            <div className="col-11">
                                                ההורים ידווחו לאגודה על מצבו הבריאותי של הילד ושל המשפחה ועל כל אירוע חריג או מיוחד שיקרה לילד או למשפחה.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.9.</div>
                                            <div className="col-11">
                                                האגודה מתחייבת לדווח להורים במהירות האפשרית על כל אירוע מיוחד או חריג שיקרה לילד.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-1 px-0">8.10.</div>
                                            <div className="col-11">
                                                הילד יימצא בבית הילדים רק במקרה שהוא בריא. בכל מקרה של חשש למחלה מדבקת או במקרה של חום גבוהה (מעל 38 מעלות) יישאר הילד בבית ההורים לשם קבלת טיפול רפואי נאות. הילד יוכל לחזור לבית הילדים רק לאחר קבלת אישור רופא כי הבריא מאותה מחלה והצגת אישרו זה בפני האגודה, פירוט ההנחיות בנוגע להכנסת ילדים חולים לבית הילדים  מצ"ב <b>בנספח "ב"</b> להסכם זה.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 9. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row  mx-0">
                                <div className="col-1 px-0"><b>9.</b></div>
                                <div className="col-11 px-0">
                                    <b><u>  קשר עם ההורים </u></b><br /> על ההורים ליידע את האגודה על מקום הימצאם במשך השעות בהן נמצא הילד בבית הילדים כדי שניתן יהיה למסור להם מידע דחוף הקשור בילד, לשם כך ימלאו ההורים את הפרטים כנדרש <b>בנספח "ג"</b>.
                                </div>
                            </div>
                        </div>
                        {/* ----------- 10. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>10. <u>ביטוח ונזקים </u></b></div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">10.1.</div>
                                            <div className="col-10">
                                                ביטוח הבריאות של הילד יהיה במסגרת ביטוח הוריו בקופת חולים, ועל חשבונם.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">10.2.</div>
                                            <div className="col-10">
                                                האגודה תבטח את הילד לגבי שהותו בבית הילדים בביטוח תאונות אישיות לתלמידים כמקובל באגודה.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">10.3.</div>
                                            <div className="col-10">
                                                האגודה לא תישא בכל אחריות או בתשלום מעבר לסכום הביטוח כלעיל במקרה של נזק כלשהו שיגרם לילד בתחומי היישוב או מחוצה לו.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">10.4.</div>
                                            <div className="col-10">
                                                ההורים יהיו אחראים לנזק שהילד יגרום לרכוש או לגוף וישלמו את כל הפיצוי בגין נזק שיגרם כאמור מיידית עם קבלת דרישת האגודה לתשלום כאמור.
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 11. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>11. <u>תקופת ההסכם, סיומו והפסקתו</u></b></div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">11.1.</div>
                                            <div className="col-10">
                                                הסכם זה ייכנס לתוקפו ביום 1.9.2023 ויעמוד בתוקפו עד ליום 21.8.2024.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">11.2.</div>
                                            <div className="col-10">
                                                מובהר, למען הסר כל ספק כי הסכם זה מתייחס לשנת הלימודים תשפ"ד בלבד וכי אין בו כדי לחייב את האגודה לקליטת הילד בבתי הילדים של האגודה בשנות הלימודים הבאות. אפשרות קליטת הילד בבתי הילדים של האגודה תיבחן לגבי כל שנת לימודים בנפרד וייחתם בין הצדדים הסכם שהייה מתאים עבור כל שנת לימודים כאמור בנפרד.
                                            </div>
                                        </div>
                                        {/* ---------- 11.3.--------------------------------------------------- */}
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">11.3.</div>
                                            <div className="col-10 px-0">
                                                <div className="row  mx-0 "><p>
                                                    על אף האמור לעיל, האגודה תהא רשאית להביא הסכם זה לידי סיום לפי שיקול דעתה המוחלט בכל מקרה ולרבות בכל אחד מהמקרים המפורטים להלן:
                                                </p>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">11.3.1</div>
                                                    <div className="col-10 ">
                                                        ההורים לא עמדו בתנאי התשלום על פי הסכם זה.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">11.3.2</div>
                                                    <div className="col-10">
                                                        ההורים אינם ממלאים אחר התחייבויותיהם כנדרש בהסכם זה או אינם נשמעים להנחיות האגודה באשר לטיפול בילד.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">11.3.3</div>
                                                    <div className="col-10">
                                                        הילד נמצא על ידי האגודה כבלתי מתאים מבחינה בריאותית ו/או נפשית ו/או פיסית.
                                                    </div>
                                                </div>
                                                <div className="row mx-auto">
                                                    <div className="col-2 px-0">11.3.4</div>
                                                    <div className="col-10">
                                                        בכל מקרה בו תחליט האגודה על הפסקת ההסכם היא תמסור להורים הודעה בכתב וההסכם יבוא לידי סיום בתום 30 ימים מיום מסירת ההודעה.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">11.4.</div>
                                            <div className="col-10">
                                                למרות האמור לעיל, במקרה חריג שעלול לפגוע בסדר התקין של עבודה בבית הילדים, זכאית האגודה, לפי שיקול דעתה הבלעדי, להביא הסכם זה לידי סיום באופן מיידי.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">11.5.</div>
                                            <div className="col-10">
                                                ההורים מצהירים ומסכימים כי הילד ישהה בבית הילדים למשך כל תקופת ההסכם.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">11.6.</div>
                                            <div className="col-10">
                                                החליטו ההורים להוציא את הילד מבית הילדים לפני כן ולהביא הסכם זה לסיומו המוקדם, יודיעו על כך לאגודה בכתב לא פחות מחודשיים ימים לפני מועד היציאה (להלן: <b>"תקופת ההודעה המוקדמת</b>").
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">11.7.</div>
                                            <div className="col-10">
                                                מוסכם בזאת כי בתקופת ההודעה המוקדמת ישלמו ההורים לאגודה את התמורה הנזכרת בסעיף ‏12.1 להלן עבור התקופה של ההודעה מראש הנ"ל, גם אם הופסקה שהייתו של הילד בפועל באגודה.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">11.8.</div>
                                            <div className="col-10">
                                                במקרה בו הופסקה שהייתו של הילד בבתי הילדים על ידי ההורים ללא הודעה מוקדמת כנדרש בסעיף ‏11.7 לעיל, ישלמו ההורים דמי שהייה בגין חודשיים נוספים.
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 12. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>12. <u>התמורה</u></b></div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">12.1.</div>
                                            <div className="col-10">
                                                דמי השהייה החודשיים במועד החתימה על הסכם זה הינם כמפורט <b>בנספח "ד" </b>להסכם זה (להלן: <b>"דמי השהייה"</b>).
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">12.2.</div>
                                            <div className="col-10">
                                                תשלום דמי השהייה יתבצע מדי חודש על פי ההסדר המפורט בנספח "ד".
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">12.3.</div>
                                            <div className="col-10">
                                                דמי השהיה יהיו קבועים, אך במידה והמדד או שכר המינימום יעלה על 3% במשך השנה, האגודה שומרת לעצמה את הזכות לעדכן את המחיר בהתאם.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">12.4.</div>
                                            <div className="col-10">
                                                ההורים ישלמו לאגודה תשלום נוסף בגין שירותים נוספים אשר יינתנו לילד מעבר לאמור בהסכם זה, אם סוכם על נתינת שירותים אלה עם ההורים.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">12.5.</div>
                                            <div className="col-10">
                                                דמי השהיה דלעיל, ישולמו לאגודה בכל מקרה, כולל במקרה של היעדרות הילד מבית הילדים מסיבה כלשהי.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">12.6.</div>
                                            <div className="col-10"><b>
                                                דמי השהייה ישולמו לאגודה גם במקרה של סגירת בתי הילדים מכל סיבה שהיא ו/או מפאת הוצאת המטפלות לבידוד בעקבות נגיף הקורונה (או כל מגיפה אחרת) ו/או במקרה שנכפה על האגודה להוציא את המטפלות לחל"ת עד 30 יום.
                                            </b></div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 13. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>13. <u>בוררות</u></b></div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">13.1.</div>
                                            <div className="col-10">
                                                כל מחלוקת שתתעורר בקשר להסכם זה לרבות עריכתו, פירושו וסיומו אשר הצדדים לא יישבו בכוחות עצמם, תועבר לבוררות אצל בורר יחיד אשר ימונה ע"י מרכז המחלקה לחינוך במועצה האזורית גליל עליון.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">13.2.</div>
                                            <div className="col-10">
                                                פסיקת הבורר תהיה סופית, תחייב את הצדדים ואין עליה ערעור.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">13.3.</div>
                                            <div className="col-10">
                                                הבורר לא יהיה כפוף לסדרי הדין ולדין המהותי ולא יהיה חייב לנמק את פסקו.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">13.4.</div>
                                            <div className="col-10">
                                                חתימת הצדדים על הסכם זה מהווה חתימה על הסכם בוררות כמשמעו בחוק הבוררות.
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 14. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row  mx-0">
                                <div className="col-1 px-0"><b>14.</b></div>
                                <div className="col-11 px-0">
                                    <b><u> קיזוז </u></b><br /> האגודה תהא רשאית לקזז מההורים כל חוב לפי הסכם זה מכל סכום אשר יהיו זכאים לקבל מהאגודה.
                                </div>
                            </div>
                        </div>
                        {/* ----------- 15. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>15. <u>שונות </u></b></div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">15.1.</div>
                                            <div className="col-10">
                                                הסכם זה כולל את כל המוסכם בין הצדדים.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">15.2.</div>
                                            <div className="col-10">
                                                כל שינוי, תיקון או תוספת להסכם זה יהיו בתוקף אך ורק לאחר חתימת הצדדים על מסמך המעיד על כך.
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------- 16. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row  mx-0">
                                <div className="col-1 px-0"><b>16.</b></div>
                                <div className="col-11 px-0">
                                    <b><u> ניסוח ההסכם</u></b><br /> הסכם זה נחתם על דעת שני הצדדים ולפיכך לא יתפרש כנגד אחד מהם משום שהיה כביכול מנסחו.
                                </div>
                            </div>
                        </div>
                        {/* ----------- 17. --------------------------------------------- */}
                        <div className="container   pb-3 david ">
                            <div className="row mx-auto">
                                <div className="col-12 px-0"><b>17. <u>הודעות </u></b></div>
                            </div>
                            <div className="row  mx-0">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 px-0">
                                    <div className="mx-0   pb-3 david ">
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">17.1.</div>
                                            <div className="col-10">
                                                כתובות הצדדים להסכם זה הן כקבוע במבוא לו.
                                            </div>
                                        </div>
                                        <div className="row mx-auto">
                                            <div className="col-2 px-0">17.2.</div>
                                            <div className="col-10">
                                                כל הודעה שתישלח בדואר רשום לצד האחר על פי כתובתו כאמור תחשב כאילו התקבלה ע"י הנמען 72 שעות לאחר מסירתה למשרד הדואר, ואם נמסרה ביד – בעת מסירתה.
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" px-3 pb-3 text-center david" style={{ fontSize: `${fontSize + 2}px` }}>
                        <b> ולראייה באו הצדדים על החתום</b>
                    </div>

                    <div className="px-3 row align-items-start text-center  david" style={{ fontSize: `${fontSize + 2}px` }}>
                        <div className="col-4">
                            <SignatureModal updateSignature={updateSignature} url={url1} id={1} signer={"חתימה ראשונה"} setUrl={setUrl1} /> <br /><b> הורה</b><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                        </div>
                        <div className="col-4">
                            <SignatureModal updateSignature={updateSignature} url={url2} id={2} signer={"חתימה שניה"} setUrl={setUrl2} /> <br /><b> הורה</b>
                        </div>
                        <div className="col-4">
                            ____________ <br /> <b>האגודה</b>
                        </div>
                    </div>

                    {/* ----------- רשימת נספחים ------------------------------------------ */}
                    <br /><br />

                    <div className="container   pb-3 david ">
                        <div className="row mx-auto">
                            <div className="col-12 px-0" style={{ fontSize: `${fontSize + 3}px` }}><b><u> רשימת נספחים</u></b></div>
                        </div>
                        <div className="row  mx-0" style={{ fontSize: `${fontSize + 2}px` }}>
                            <div className="col-1 px-0"></div>
                            <div className="col-11 px-0">
                                <div className="mx-0   pb-3 david ">
                                    <div className="row mx-auto">
                                        <div className="col-3 px-0"><b> נספח א' -</b></div>
                                        <div className="col-9 ">
                                            לוח חופשות תשפ"ד.
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-3 px-0"><b> נספח ב' - </b></div>
                                        <div className="col-9 ">
                                            תקנון בריאות בבית הילדים.
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-3 px-0"><b> נספח ג' - </b></div>
                                        <div className="col-9 ">
                                            שאלון פרטים על הילד וההורים.
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-3 px-0"><b> נספח ד' - </b></div>
                                        <div className="col-9 ">
                                            נספח תשלום דמי שהייה.
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-3 px-0"><b> נספח ה' - </b></div>
                                        <div className="col-9 ">
                                            טופס אישור צילום.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ----------- נספח א'------------------------------------------ */}
                    <div className=" px-3 pb-3 text-center david" style={{ fontSize: `${fontSize + 2}px` }}>
                        <b><u> נספח א'- לוח חופשות תשפ"ד </u></b>
                        <br />
                        <br />
                        <MyComponent />
                    </div>
                    <br /><br />

                    {/* ----------- נספח ב'------------------------------------------ */}
                    <div>
                        <div className=" px-3 pb-3 text-center david" style={{ fontSize: `${fontSize + 2}px` }}>
                            <b>נספח ב' <br />
                                <u> תקנון בריאות</u></b>
                        </div>

                        <div className=" px-3 pb-3  david " style={{ fontSize: `${fontSize + 2}px` }} >
                            <b><u> הקדמה: </u></b> המטפלות <b><u>אינן רשאיות</u></b>, על פי הוראות משרד התמ"ת ומשרד החינוך, לתת תרופות כלשהן לילדים בבתי הילדים ובכלל זה אקמול.
                        </div>

                        {/* ----------- הנחיות כלליות: ------------------------------------------ */}

                        <div className="px-3 pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto" style={{ fontSize: `${fontSize + 2}px` }}>
                                <div className="col-1 px-0"></div>
                                <div className="col-11 ">
                                    <b><u>  הנחיות כלליות:</u></b>
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">1.</div>
                                <div className="col-11 ">
                                    ילד/ה שידוע כחולה במחלה כרונית כלשהי: אסטמה למשל, הוריו מתבקשים להביא מכתב חתום על ידי רופא המפרט את מחלתו ואופן הטיפול הנדרש במקרה של התקף או כל מצב חירום רפואי אחר.
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">2.</div>
                                <div className="col-11 ">
                                    צוות הגן יפעיל שיקול דעת לגבי כל מצב בו ילד חש ברע ויפעל על פי ההנחיות המפורטות.
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0"><b>3.</b></div>
                                <div className="col-11 ">
                                    <b> בכל מקרה בו ילד אינו חש בטוב צוות הגן יעריך את מצבו הספציפי ואת מידת יכולתו של הילד להשתתף במהלך סדר היום הרגיל . במקרה בו ילד יחוש ברע במידה בה צוות הגן יצטרך להצמיד אליו מטפלת, ההורים יתבקשו לקחתו מהגן.</b>
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">4.</div>
                                <div className="col-11 ">
                                    במצב חירום רפואי, מרפאת הקיבוץ תטפל בכל הילדים, ילד שאינו מבוטח בקופת חולים כללית יקבל טיפול ראשוני ויפנה להמשך טיפול במרפאת האם שלו.
                                </div>
                            </div>
                        </div>

                        {/* ----------- הנחיות כלליות: ------------------------------------------ */}

                        <div className="px-3 pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto" style={{ fontSize: `${fontSize + 2}px` }}>
                                <div className="col-1 px-0"></div>
                                <div className="col-11 ">
                                    <b><u> הנחיות מפורטות:</u></b>
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0"><b>1.</b></div>
                                <div className="col-11 ">
                                    <b>שלשולים</b> - במידה וישנם שלושה שלשולים/יציאות רכות ומעלה במהלך שהות הילד בגן, ההורים יתבקשו לקחתו מהגן. חזרה לגן רק לאחר 24 שעות ללא שלשול. במידה ומדובר במגפה, ההורים יתבקשו לאסוף את ילדיהם לאחר שלשול אחד.
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">2.</div>
                                <div className="col-11 ">
                                    <b>  פצעים בפה ופריחה</b> - ההורים יופנו עם הילד למרפאה, רק לאחר בדיקה במרפאה ווידוא כי לא מדובר במחלה מידבקת ניתן לחזור לגן, עם אישור בכתב מהמרפאה.
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">3.</div>
                                <div className="col-11 ">
                                    <b>  דלקות עיניים </b>- במידה והילד מאובחן בדלקת עיניים והוא מטופל רפואית, יוכל להגיע לגן רק לאחר קבלת טיפול רפואי של 24 שעות. במידה והילד אינו מטופל ובמהלך היום בגן, הצוות יבחין בהפרשה שנראית כדלקת, הצוות יפנה את ההורים למרפאה, ומשם המשך טיפול ע"פ הסעיף הקודם.
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">4.</div>
                                <div className="col-11 ">
                                    <b> הקאות </b>- במידה וישנן החל משתי הקאות ומעלה, צוות הגן יבקש לקחת את הילד הביתה ויחזור למסגרת רק לאחר 24 שעות ללא הקאות.
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">5.</div>
                                <div className="col-11 ">
                                    <b>   חום </b>- במידה וילד חולה עם חום של 38 מעלות ומעלה במהלך היום בגן הצוות יבקש מההורים לקחתו הביתה ויחזור למסגרת רק לאחר 24 שעות ללא תסמינים.
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">6.</div>
                                <div className="col-11 ">
                                    <b>    תולעים </b>- במידה והילד מאובחן בתולעים, הינו יכול להגיע לגן אך עליו לקבל טיפול רפואי.
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-1 px-0">7.</div>
                                <div className="col-11 ">
                                    <b>  מחלות מידבקות </b>- במידה והילד מאובחן במחלה מידבקת כלשהי, יוכל להגיע לגן רק 24 שעות לאחר קבלת טיפול רפואי יחד עם אישור חתום מהרופא המטפל.
                                    <br /><b> ויטמינים ותוספי מזון </b>- יינתנו על ידי ההורים בבית.
                                </div>
                            </div>
                        </div>
                    </div>
                    <br /><br />

                    {/* ----------- נספח ג'------------------------------------------ */}
                    <div>
                        <div>
                            <div className=" px-3 pb-3 text-center david" style={{ fontSize: `${fontSize + 2}px` }}>
                                <b><u> נספח ג' </u></b><br />
                                <p className="">
                                    <b>שאלון עם כניסת הילד לבית הילדים</b>
                                </p>
                                <ul className="">
                                    <li>אנא מלאו פרטים מדויקים כדי שיהיה קל יותר להכיר את הילד על צרכיו השונים</li>
                                    <li>נא לצרף צילום תעודת הזהות של ההורים וצילום הספח בו רשום הילד.</li>
                                </ul>
                            </div>
                        </div>
                        {/* ----------- Details --------------------------------------------- */}
                        <div className="container   pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="mx-0   pb-3 david">
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        שם פרטי:<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="childFirstName"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="childFirstName"
                                            value={documentData.childFirstName}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  שם משפחה: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="childLastName"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="childLastName"
                                            value={documentData.childLastName}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>   {windowWidth < 550 ? <br /> : null} מס' ת.ז.: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="childId"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="childId"
                                            value={documentData.childId}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                                    </div>
                                </p>
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        ת. לידה: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="dateOfBirth"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="dateOfBirth"
                                            value={documentData.dateOfBirth}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>   ארץ לידה:<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="countryOfBirth"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="countryOfBirth"
                                            value={documentData.countryOfBirth}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  {windowWidth < 550 ? <br /> : null} שנת עליה: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="yearOfArrival"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="yearOfArrival"
                                            value={documentData.yearOfArrival}
                                            style={{ width: `${fontSize * 5}px` }}
                                        />
                                    </div>
                                </p>
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        כתובת:<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="address"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="address"
                                            value={documentData.address}
                                            style={{ width: `${fontSize * 11}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  מיקוד: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="zip"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="zip"
                                            value={documentData.zip}
                                            style={{ width: `${fontSize * 4}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                                    </div>
                                </p>
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        שמות האחים:1.<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="brother1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="brother1"
                                            value={documentData.brother1}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /> 2. <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="brother2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="brother2"
                                            value={documentData.brother2}
                                            style={{ width: `${fontSize * 5}px` }}
                                        />{windowWidth < 550 ? <br /> : null} 3. <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="brother3"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="brother3"
                                            value={documentData.brother3}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /> 4.<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="brother4"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="brother4"
                                            value={documentData.brother4}
                                            style={{ width: `${fontSize * 5}px` }}
                                        />
                                    </div>
                                </p>
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        שם האם: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentName1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentName1"
                                            value={documentData.parentName1}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> 	ת"ז: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentId1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentId1"
                                            value={documentData.parentId1}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  {windowWidth < 550 ? <br /> : null} מקצוע: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentJob1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentJob1"
                                            value={documentData.parentJob1}
                                            style={{ width: `${fontSize * 8}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                                    </div>
                                </p>
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        נייד: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="phoneNumber1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="phoneNumber1"
                                            value={documentData.phoneNumber1}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  טלפון בבית: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentHomeNumber1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentHomeNumber1"
                                            value={documentData.parentHomeNumber1}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /> {windowWidth < 550 ? <br /> : null} דוא"ל:<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentEmailAddress1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentEmailAddress1"
                                            value={documentData.parentEmailAddress1}
                                            style={{ width: `${fontSize * 8}px` }}
                                        />
                                    </div>
                                </p>
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        שם האב: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentName2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentName2"
                                            value={documentData.parentName2}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /> 	ת"ז: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentId2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentId2"
                                            value={documentData.parentId2}
                                            style={{ width: `${fontSize * 5}px` }}
                                        />  {windowWidth < 550 ? <br /> : null} מקצוע: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentJob2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentJob2"
                                            value={documentData.parentJob2}
                                            style={{ width: `${fontSize * 8}px` }}
                                        />
                                    </div>
                                </p>
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        נייד: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="phoneNumber2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="phoneNumber2"
                                            value={documentData.phoneNumber2}
                                            style={{ width: `${fontSize * 5}px` }}
                                        />  טלפון בבית: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentHomeNumber2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentHomeNumber2"
                                            value={documentData.parentHomeNumber2}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /> {windowWidth < 550 ? <br /> : null} דוא"ל:<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="parentEmailAddress2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="parentEmailAddress2"
                                            value={documentData.parentEmailAddress2}
                                            style={{ width: `${fontSize * 8}px` }}
                                        />
                                    </div>
                                </p>
                                <br />
                                <p style={{ fontSize: `${fontSize + 2}px` }}>
                                    שמות הרשאים לקחת את הילד מבית הילדים וליצירת קשר במידה ולא ניתן להשיג את ההורים:
                                </p>
                                <p className="row mx-auto">
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        שם:<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="relativeName1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="relativeName1"
                                            value={documentData.relativeName1}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  קרבת משפחה: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="relativeStatus1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="relativeStatus1"
                                            value={documentData.relativeStatus1}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  {windowWidth < 550 ? <br /> : null} טלפון: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="relativeNumber1"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="relativeNumber1"
                                            value={documentData.relativeNumber1}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                                    </div>
                                </p>
                                <p className="row mx-auto" style={{ fontSize: `${fontSize}px` }}>
                                    <div className="col-1 px-0"></div>
                                    <div className="col-11">
                                        שם:<input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="relativeName2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="relativeName2"
                                            value={documentData.relativeName2}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /> קרבת משפחה: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="relativeStatus2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="relativeStatus2"
                                            value={documentData.relativeStatus2}
                                            style={{ width: `${fontSize * 5}px` }}
                                        /> {windowWidth < 550 ? <br /> : null} טלפון: <input
                                            className=""
                                            onChange={updateDocumentData}
                                            type="text"
                                            name="relativeNumber2"
                                            // placeholder={props.t("OrgDetails.3")}
                                            autoComplete="off"
                                            id="relativeNumber2"
                                            value={documentData.relativeNumber2}
                                            style={{ width: `${fontSize * 5}px` }}
                                        />
                                    </div>
                                </p>
                                <p >
                                    האם לילד ישנה בעיה רפואית או נפשית שעל הגננת והמטפלות לדעת עליה: כן/לא <FormControl>
                                        <RadioGroup
                                            onChange={updateDocumentData}
                                            defaultValue={false}
                                            name="healthIssueExist"
                                            id="healthIssueExist"
                                            row
                                        >
                                            <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>כן </span>} />
                                            <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>לא</span>} />
                                        </RadioGroup>
                                    </FormControl>
                                </p>
                                <p>
                                    במידה ואכן קיימת, מהי המחלה ומהם אמצעי העזרה: <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="healthIssueAndSolution"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="healthIssueAndSolution"
                                        value={documentData.healthIssueAndSolution}
                                        style={{ width: `${fontSize * 20}px` }}
                                        disabled={documentData.healthIssueExist === "false"}
                                    />
                                </p>
                                <p>
                                    רגישות לתרופות:<FormControl>
                                        <RadioGroup
                                            onChange={(event) => setAllergyExistance((prevValue) => {
                                                return {
                                                    ...prevValue,
                                                    [event.target.name]: event.target.value,
                                                };
                                            })}
                                            defaultValue={false}
                                            name="allergyToMedication"
                                            id="allergyToMedication"
                                            row
                                        >
                                            <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>יש </span>} />
                                            <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>אין</span>} />
                                        </RadioGroup>
                                    </FormControl><input
                                        className="me-5"
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="allergyToMedication"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="allergyToMedication"
                                        value={documentData.allergyToMedication}
                                        style={{ width: `${fontSize * 20}px` }}
                                        disabled={allergyExistance.allergyToMedication === "false"}
                                    />
                                </p>
                                <p>
                                    רגישות למזון:<FormControl>
                                        <RadioGroup
                                            onChange={(event) => setAllergyExistance((prevValue) => {
                                                return {
                                                    ...prevValue,
                                                    [event.target.name]: event.target.value,
                                                };
                                            })}
                                            defaultValue={false}
                                            name="allergyToFood"
                                            id="allergyToFood"
                                            row
                                        >
                                            <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>יש </span>} />
                                            <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>אין</span>} />
                                        </RadioGroup>
                                    </FormControl><input
                                        className="me-5"
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="allergyToFood"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="allergyToFood"
                                        value={documentData.allergyToFood}
                                        style={{ width: `${fontSize * 20}px` }}
                                        disabled={allergyExistance.allergyToFood === "false"}
                                    />
                                </p>
                                <p>
                                    אילו מחלות היו לילד:<FormControl>
                                        <RadioGroup
                                            onChange={(event) => setAllergyExistance((prevValue) => {
                                                return {
                                                    ...prevValue,
                                                    [event.target.name]: event.target.value,
                                                };
                                            })}
                                            defaultValue={false}
                                            name="pastDiseases"
                                            id="pastDiseases"
                                            row
                                        >
                                            <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>יש </span>} />
                                            <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>אין</span>} />
                                        </RadioGroup>
                                    </FormControl><input
                                        className="me-5"
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="pastDiseases"
                                        autoComplete="off"
                                        id="pastDiseases"
                                        value={documentData.pastDiseases}
                                        style={{ width: `${fontSize * 20}px` }}
                                        disabled={allergyExistance.pastDiseases === "false"}
                                    />
                                </p>
                                <p>
                                    האם הילד אלרגי למשהו:<FormControl>
                                        <RadioGroup
                                            onChange={(event) => setAllergyExistance((prevValue) => {
                                                return {
                                                    ...prevValue,
                                                    [event.target.name]: event.target.value,
                                                };
                                            })}
                                            defaultValue={false}
                                            name="allergies"
                                            id="allergies"
                                            row
                                        >
                                            <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>כן </span>} />
                                            <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>לא</span>} />
                                        </RadioGroup>
                                    </FormControl><input
                                        className="me-5"
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="allergies"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="allergies"
                                        value={documentData.allergies}
                                        style={{ width: `${fontSize * 20}px` }}
                                        disabled={allergyExistance.allergies === "false"}
                                    />
                                </p>
                                <p>
                                    האם הילד קיבל את כל החיסונים: כן/לא <FormControl>
                                        <RadioGroup
                                            onChange={updateDocumentData}
                                            defaultValue={true}
                                            name="receivedFullVaccination"
                                            id="receivedFullVaccination"
                                            row
                                        >
                                            <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>כן </span>} />
                                            <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>לא</span>} />
                                        </RadioGroup>
                                    </FormControl>
                                </p>
                                <p>
                                    במידה ולא, אילו חיסונים הילד לא קיבל:<input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="nonReceivedVaccinations"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="nonReceivedVaccinations"
                                        value={documentData.nonReceivedVaccinations}
                                        style={{ width: `${fontSize * 20}px` }}
                                        disabled={documentData.receivedFullVaccination === "true"}
                                    />
                                </p>
                                <p>
                                    שם קופת חולים בה מבוטח הילד: <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="hmo"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="hmo"
                                        value={documentData.hmo}
                                        style={{ width: `${fontSize * 20}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                                </p>
                                <p>
                                    הערות:<input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="remarks"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="remarks"
                                        value={documentData.remarks}
                                        style={{ width: `${fontSize * 20}px` }}
                                    />
                                </p>
                                <br />
                                <p>
                                    הריני מאשר/ת כי כל הפרטים הרשומים בשאלון לעיל נכונים, וכי הוא בלתי נפרד מההסכם.
                                </p>
                                <p>
                                    במידה ויהיו שינויים באחד מהפרטים-אודיע עליו מיד.
                                </p>
                                <br />

                                <div >
                                    <Form>
                                        <Form.Group controlId="formImage">
                                            <Form.Label><b><u>בחר תמונת ת"ז הורה ראשון: (שדה חובה) [<b> אנא העלה קובץ מסוג תמונה</b>]<span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> </u></b></Form.Label>
                                            <Form.Control type="file" accept="image/*" onChange={(event) => handleImageChange(event, 1)}
                                                style={{ width: `${windowWidth < 800 ? fontSize * 20 : fontSize * 40}px` }} />
                                        </Form.Group>
                                        {selectedImage1 && (
                                            <div className="mt-3">
                                                <img src={selectedImage1} alt="Selected" width={`${windowWidth < 800 ? fontSize * 20 : fontSize * 40}px`} />
                                            </div>
                                        )}
                                    </Form>
                                </div>

                                <div >
                                    <Form>
                                        <Form.Group controlId="formImage">
                                            <Form.Label><b><u>בחר תמונת ת"ז הורה שני:  [<b> אנא העלה קובץ מסוג תמונה</b>] </u></b></Form.Label>
                                            <Form.Control type="file" accept="image/*" onChange={(event) => handleImageChange(event, 2)}
                                                style={{ width: `${windowWidth < 800 ? fontSize * 20 : fontSize * 40}px` }} />
                                        </Form.Group>
                                        {selectedImage2 && (
                                            <div className="mt-3">
                                                <img src={selectedImage2} alt="Selected" width={`${windowWidth < 800 ? fontSize * 20 : fontSize * 40}px`} />
                                            </div>
                                        )}
                                    </Form>
                                </div>

                                <br />

                                <div className="row mx-auto">
                                    <div className="row mx-auto">
                                        <div className="col-2 px-0">חתימת ההורה: <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> </div>
                                        <div className="col-10">
                                            <SignatureModal updateSignature={updateSignature} url={url1} id={1} signer={"חתימה ראשונה"} setUrl={setUrl1} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                    <br /><br />

                    {/* ----------- נספח ד' ------------------------------------------ */}
                    <div>
                        <div className=" px-3 pb-3 text-center david" style={{ fontSize: `${fontSize + 2}px` }}>
                            <p className="">
                                <b><u>  נספח ד': להסכם חינוך מיום <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="attendanceStartingDate"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="attendanceStartingDate"
                                    value={documentData.attendanceStartingDate}
                                    style={{ width: `${fontSize * 5}px` }}
                                /></u><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> </b>
                            </p>
                            <p className="">
                                <b><u> הסדר תשלום דמי השהייה</u></b>
                            </p>

                        </div>

                        {/* ----------- ב  י  ן: ------------------------------------------ */}
                        <div className="container   pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto">
                                <div className="col-2 px-0"><b>בין:</b></div>
                                <div className="col-10"> <b> תושבי שדה נחמיה אגודה שיתופית להתיישבות קהילתית בע"מ</b><br />
                                    מקיבוץ שדה נחמיה <br />
                                    ד.נ. גליל עליון <br />
                                    (להלן: <b>"האגודה"</b>) <br />
                                    <p className="text-start"><b><u> מצד אחד; </u></b></p>
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-2 px-0"><b> לבין: </b></div>
                                <div className="col-10">
                                    1.	שםֹ  ההורה <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="parentName1"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="parentName1"
                                        value={documentData.parentName1}
                                        style={{ width: `${fontSize * 5}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>    	ת"ז  <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="parentId1"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="parentId1"
                                        value={documentData.parentId1}
                                        style={{ width: `${fontSize * 5}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  {windowWidth < 550 ? <br /> : null}  פלאפון  <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="phoneNumber1"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="phoneNumber1"
                                        value={documentData.phoneNumber1}
                                        style={{ width: `${fontSize * 5}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  <br />
                                    2.	שםֹ  ההורה  <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="parentName2"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="parentName2"
                                        value={documentData.parentName2}
                                        style={{ width: `${fontSize * 5}px` }}
                                    />  	ת"ז  <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="parentId2"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="parentId2"
                                        value={documentData.parentId2}
                                        style={{ width: `${fontSize * 5}px` }}
                                    />   {windowWidth < 550 ? <br /> : null} פלאפון  <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="phoneNumber2"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="phoneNumber2"
                                        value={documentData.phoneNumber2}
                                        style={{ width: `${fontSize * 5}px` }}
                                    />  <br />
                                    מ <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="from"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="from"
                                        value={documentData.from}
                                        style={{ width: `${fontSize * 8}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  <br />
                                    (להלן: "ההורים") <br />
                                    <p className="text-start"><b><u> מצד שני; </u></b></p>
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-2 px-0"> <b>הואיל</b></div>
                                <div className="col-10"><p> וביום <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="signingDate"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="signingDate"
                                    value={documentData.signingDate}
                                    style={{ width: `${fontSize * 5}px` }}
                                /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  נחתם בין הצדדים הסכם חינוך לפיו הילד <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="childName"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="childName"
                                        value={documentData.childName}
                                        style={{ width: `${fontSize * 5}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> , נושא ת.ז. <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="childId"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="childId"
                                        value={documentData.childId}
                                        style={{ width: `${fontSize * 5}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  (להלן: <b>"הילד"</b>) ישהה בבית הילדים <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="className"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="className"
                                        value={documentData.className}
                                        style={{ width: `${fontSize * 5}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>  באגודה בשנת הלימודים תשפ"ד (להלן: <b>"ההסכם העיקרי"</b>); </p>
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-2 px-0"><b> והואיל</b></div>
                                <div className="col-10">
                                    <p className="">
                                        וההורים מחויבים בתשלום דמי שהייה חודשיים לאגודה תמורת שהיית הילד בבית הילדים, כהגדרתם בהסכם העיקרי;
                                    </p>
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-2 px-0"> <b> הואיל </b></div>
                                <div className="col-10">
                                    <p>
                                        והאגודה הקהילתית מוכרת ופועלת כמוסד ללא כוונת רווח ששירותיו אינם חייבים במע"מ;
                                    </p>
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-2 px-0"> <b> הואיל</b> </div>
                                <div className="col-10">
                                    <p>
                                        וברצון הצדדים להסדיר את אופן תשלום דמי השהייה של הילד בבית הילדים בכלל ובהתייחס לנושא החיוב במע"מ כאמור לעיל בפרט;
                                    </p>
                                </div>
                            </div>

                            {/* ---------------------------------------------------------------------- */}
                        </div>
                        <p className=" px-3 pb-3 text-center david" style={{ fontSize: `${fontSize + 2}px` }}>
                            <b><u>  לפיכך, הוסכם, הוצהר והותנה בין הצדדים כדלקמן:</u></b>
                        </p>
                        {/* --------- לפיכך ------------------------------------------------------------- */}
                        <div className="px-3 pb-3 david " style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto">
                                <div className="col-1 px-0"></div>
                                <div className="col-11 ">
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">1.</div>
                                        <div className="col-11 ">
                                            <p>
                                                למונחים המפורטים בהסכם זה תהא משמעות זהה לזו הקבועה בהסכם העיקרי, למעט אם נקבע בהסכם זה מפורשות אחרת.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">2.</div>
                                        <div className="col-11 ">
                                            <p>
                                                הסכם זה הינו כפוף להוראות ההסכם העיקרי, למעט אם צוין בו מפורשות אחרת.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">3.</div>
                                        <div className="col-11 ">
                                            <p>
                                                עבור שהיית הילד בבית הילדים, ישלמו ההורים לאגודה דמי שהייה חודשיים על פי הטבלה המצורפת:
                                            </p>
                                            <br />
                                            <div className="container">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>שם הבית  /הפעוטון /גן</th>
                                                            <th>תושבי שדה נחמיה</th>
                                                            <th>תושבי חוץ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>בית קשת -פעוטון</td>
                                                            <td>3,400 ₪</td>
                                                            <td>3,800 ₪</td>
                                                        </tr>
                                                        <tr>
                                                            <td>סנונית –   גנון</td>
                                                            <td>3,150 ₪</td>
                                                            <td>3,550 ₪</td>
                                                        </tr>
                                                        <tr>
                                                            <td>רימון –    גן צעיר</td>
                                                            <td>1,750 ₪</td>
                                                            <td>2,150 ₪</td>
                                                        </tr>
                                                        <tr>
                                                            <td>שיטה –  גן בוגר</td>
                                                            <td>1,700 ₪</td>
                                                            <td>2,100 ₪</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <FormControl>
                                                    <RadioGroup
                                                        onChange={(event) => updatePrice(event.target.value)}
                                                        // defaultValue={false}
                                                        name="allowsPhotographingInternal"
                                                        id="allowsPhotographingInternal"
                                                        row
                                                    >
                                                        <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>תושבי שדה נחמיה (מגורי קבע ורישום בתעודת זהות) <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> </span>} />
                                                        <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>תושבי חוץ <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> </span>} />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">4.</div>
                                        <div className="col-11 ">
                                            <p>
                                                מובהר כי דמי השהייה הנם סכום כולל וסופי וההורים מוותרים בזאת על כל דרישה להחזר מהאגודה בגין תשלום דמי השהייה,.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">5.</div>
                                        <div className="col-11 ">
                                            <p>
                                                תינתן הנחת אח שני במערכת בסך 3% על המחיר הנמוך מבינהם.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">6.</div>
                                        <div className="col-11 ">
                                            <p>
                                                <p>
                                                    תשלום דמי השהייה יתבצע כדלקמן (סמן  את האפשרות המתאימה): <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                                                </p>
                                                <FormControl size="small" >
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        // defaultValue="12-checks"
                                                        onChange={updateDocumentData}
                                                        id="paymentMethod"
                                                        name="paymentMethod"
                                                    >
                                                        <FormControlLabel sx={{ margin: "10px 0px 10px auto" }} value="12-checks" control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>באמצעות 12 המחאות דחויות, שיעבירו ההורים לידי האגודה במועד החתימה על ההסכם העיקרי, המתוארכות כל אחת ליום ה-5 של החודש בגינו ניתנה. (בכל שיק יוסף סכום של 12 ₪, עבור עמלת טיפול בכל שיק דחוי). </span>} />
                                                        <FormControlLabel sx={{ margin: 0 }} value="credit-card" control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>	באמצעות חיוב כרטיס אשראי, דרך משרד הנהלת החשבונות של  האגודה. <br />  <b>•</b>	על כל חיוב, תוסף עמלה בסך 1 אחוז מהסכום. </span>} />
                                                        <FormControlLabel sx={{ margin: 0 }} value="direct-debit" control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>	הוראת קבע ללא עמלת גביה בסמל מוסד 29359.</span>} />
                                                        <FormControlLabel sx={{ margin: 0 }} value="billing-in-budget" control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>בחיוב בתקציב (חברי קיבוץ בלבד) </span>} />
                                                    </RadioGroup>
                                                </FormControl>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">7.</div>
                                        <div className="col-11 ">
                                            <p>
                                                האגודה תוציא להורים חשבונית בגין תשלום דמי השהייה אחת לחודש.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">8.</div>
                                        <div className="col-11 ">
                                            <p>
                                                מוסכם כי ספרי הנהלת החשבונות של האגודה יהוו ראיה לביצוע או אי ביצוע תשלום דמי השהייה על ידי ההורים.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-1 px-0">9.</div>
                                        <div className="col-11 ">
                                            <p>
                                                מוסכם ומוצהר בזאת כי כל שירות נוסף שיינתן לילד ו/או להורים מהאגודה, מעבר לשירותים הכלולים בשהיית הילד בבית הילדים - יהיה בתשלום נוסף כמקובל באגודה ביחס לשירותים מאותו סוג ותשלום דמי השהייה לא ייחשב בשום אופן כתשלום עבור שירותים נוספים אלו.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className=" px-3 pb-3 text-center david" style={{ fontSize: `${fontSize + 2}px` }}>
                            <b>ולראייה באו הצדדים על החתום ביום </b><input
                                className=""
                                onChange={updateDocumentData}
                                type="text"
                                name="signingDate"
                                // placeholder={props.t("OrgDetails.3")}
                                autoComplete="off"
                                id="signingDate"
                                value={documentData.signingDate}
                                style={{ width: `${fontSize * 5}px` }}
                            /> <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                        </div>

                        <div className="px-3 row align-items-start text-center david" style={{ fontSize: `${fontSize}px` }}>
                            <div className="col-4">
                                <b>הורה <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> </b><SignatureModal updateSignature={updateSignature} url={url1} id={1} signer={"חתימה ראשונה"} setUrl={setUrl1} />
                            </div>
                            <div className="col-4">
                                <b> הורה  </b><SignatureModal updateSignature={updateSignature} url={url2} id={2} signer={"חתימה שניה"} setUrl={setUrl2} />
                            </div>
                            <div className="col-4">
                                ____________ <br /><b> האגודה</b>
                            </div>
                        </div>
                    </div>
                    <br /><br />

                    {/* ----------- נספח ה'------------------------------------------ */}
                    <div>
                        <p className="pt-4 px-3 text-center david" style={{ fontSize: `${fontSize + 2}px` }}>

                            <b> נספח ה' <br />
                                <u>  טופס אישור צילום</u></b>

                        </p>
                        <p className=" px-3  david " style={{ fontSize: `${fontSize}px` }}>
                            <u><b> אני מאשר / לא מאשר</b></u>  לצלם את הילד/ה בבית הילדים ולהשתמש בתמונות לצרכים פנימיים של מערכת הגיל הרך. <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                            <FormControl>
                                <RadioGroup
                                    onChange={updateDocumentData}
                                    defaultValue={true}
                                    name="allowsPhotographingInternal"
                                    id="allowsPhotographingInternal"
                                    row
                                >
                                    <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>מאשר </span>} />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>לא מאשר</span>} />
                                </RadioGroup>
                            </FormControl>
                        </p>
                        <p className=" px-3   david " style={{ fontSize: `${fontSize}px` }}>
                            <u><b> אני מאשר / לא מאשר</b></u> לצלם את הילד/ה בבית הילדים ולהשתמש בתמונות לצרכים פנימיים של מערכת הגיל הרך. <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                            <FormControl>
                                <RadioGroup
                                    onChange={updateDocumentData}
                                    defaultValue={true}
                                    name="allowsPhotographingExternal"
                                    id="allowsPhotographingExternal"
                                    row
                                >
                                    <FormControlLabel value={true} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>מאשר </span>} />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label={<span style={{ fontSize: `${fontSize}px`, fontFamily: "'David Libre', serif" }}>לא מאשר</span>} />
                                </RadioGroup>
                            </FormControl>
                        </p>

                        <p className=" px-3  david " style={{ fontSize: `${fontSize}px` }}>
                            <b>  שם פרטי ושם משפחה של המאשר	 <input
                                className=""
                                onChange={updateDocumentData}
                                type="text"
                                name="approverName"
                                // placeholder={props.t("OrgDetails.3")}
                                autoComplete="off"
                                id="approverName"
                                value={documentData.approverName}
                                style={{ width: `${fontSize * 5}px` }}
                            /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>   <br />
                                הקשר של המאשר לילד			 <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="approverStatus"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="approverStatus"
                                    value={documentData.approverStatus}
                                    style={{ width: `${fontSize * 7}px` }}
                                /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>   <br />
                                כתובת המאשר 				 <input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="approverAddress"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="approverAddress"
                                    value={documentData.approverAddress}
                                    style={{ width: `${fontSize * 14}px` }}
                                /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>   <br />
                                מספר טלפון	 של המאשר 		<input
                                    className=""
                                    onChange={updateDocumentData}
                                    type="text"
                                    name="approverPhoneNumber"
                                    // placeholder={props.t("OrgDetails.3")}
                                    autoComplete="off"
                                    id="approverPhoneNumber"
                                    value={documentData.approverPhoneNumber}
                                    style={{ width: `${fontSize * 5}px` }}
                                /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>   <br />
                            </b>
                        </p>

                        <div className=" px-3  david" style={{ fontSize: `${fontSize}px` }}>
                            <div className="row mx-auto">
                                <div className="col-2 px-0"><b> חתימת ההורה: <span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span> </b></div>
                                <div className="col-10">
                                    <SignatureModal updateSignature={updateSignature} url={url1} id={1} signer={"חתימה ראשונה"} setUrl={setUrl1} />

                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="col-2 px-0"><b>  תאריך </b> </div>
                                <div className="col-10">
                                    <input
                                        className=""
                                        onChange={updateDocumentData}
                                        type="text"
                                        name="signingDate"
                                        // placeholder={props.t("OrgDetails.3")}
                                        autoComplete="off"
                                        id="signingDate"
                                        value={documentData.signingDate}
                                        style={{ width: `${fontSize * 5}px` }}
                                    /><span style={{ color: 'red', fontSize: `${fontSize * 1.5}px` }}><b>*</b></span>
                                </div>
                            </div>

                        </div>



                    </div>

                    {/* ----------- signature modal -------------------------------------------------------- */}

                    {/* <SignatureModal updateSignature={updateSignature} url={url1} id={1} signer={"חתימה ראשונה"} setUrl={setUrl1} />
                <SignatureModal updateSignature={updateSignature} url={url2} id={2} signer={"חתימה שניה"} setUrl={setUrl2} /> */}

                    {/* ----------- submit ------------------------------------------ */}

                    <div className="p-3 text-center">
                        <button type="submit" className="btn btn-primary btn-sm" >
                            הגשה
                        </button>
                    </div>



                </div >
            </form>
        </div >
    );
}

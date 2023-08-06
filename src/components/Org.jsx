import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AtomicSpinner from 'atomic-spinner';
import { Typography, Card, CardContent, Button, ButtonGroup, Modal, Box, TextField, Checkbox, FormControlLabel, CardActions } from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import LaunchIcon from '@mui/icons-material/Launch';

import SimpleSnackbar from './SimpleSnackbar';

export default function Org(props) {
    const [org, setOrg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newMember, setNewMember] = useState("");
    const [count, setCount] = useState(0);
    const [openBundleCreator, setOpenBundleCreator] = useState(false);
    const [bundleName, setBundleName] = useState([""]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [selectedDiv, setSelectedDiv] = useState(2);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    const navigate = useNavigate();
    const { key } = useParams();

    const location = useLocation();
    const currentPath = location.pathname;
    const currentProtocol = window.location.protocol;
    const currentDomain = window.location.hostname;
    const currentPort = window.location.port;

    useEffect(() => {

        // Function to fetch data from the backend server
        const fetchData = async () => {
            try {
                setLoading(true);
                // Make the GET request using Axios
                const response = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/get-org/${key}`);
                // const response = await axios.get(`http://localhost:3001/api/organzations/get-org/${key}`);
                console.log(response.data);
                setOrg(response.data); // Update the state with the fetched data
                setSelectedTemplates(response.data.templates.map((item, index) => ({
                    ...item, // Spread the original item's properties
                    index: index, // Add the 'age' field with a default value (you can change this as needed)
                    selected: false, // Add the 'city' field with a default value (you can change this as needed)
                })))
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        // Call the fetchData function when the component mounts
        fetchData();

    }, [count]);

    useEffect(() => {
        // Update windowWidth whenever the window is resized
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function handleCreateTemplate(event, orgID) {

        navigate(`/create-template/${orgID}`);
    }

    function convertToInternationalFormat(phoneNumber) {
        // Remove any non-digit characters from the phone number
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
      
        // Check if the cleanedNumber starts with "0" (local format)
        if (cleanedNumber.startsWith('0')) {
          // Replace the leading "0" with the country code "+972"
          return '+972' + cleanedNumber.slice(1);
        }
      
        // If the cleanedNumber does not start with "0", return it as is
        return cleanedNumber;
      }

    async function handleAddMember(event, orgID) {



        if (newMember.length < 10) {
            alert('אנא הכנס את מספר הפלפון בשלימותו בשדה שמעל כפתור ההוספה.');
            return;
        }
        const formatted = convertToInternationalFormat(newMember);

        // const localUrl = "http://localhost:3001/api/organzations/add-member/";
        const localUrl = `${window.AppConfig.serverDomain}/api/organzations/add-member/`;

        const formData = {
            orgID: orgID,
            newMember: formatted,
        };
        // Add more fields as needed
        try {
            setLoading(true);
            const response1 = await axios.post(localUrl, formData);

            console.log(response1.data.orgID);

            // Do something with the response if needed
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
        setNewMember("");

        setCount(count + 1);

    }

    function showSubmittedData(event, templateID) {
        // Function to fetch data from the backend server
        const fetchSubmittedData = async () => {
            try {
                setLoading(true);
                // Make the GET request using Axios
                // const response = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/submitted/${templateID}`);
                // const result = response.data.map((submitted) => {
                //     const { staticFields, signedPdf, submitterPhone } = submitted;
                //     const { childId, childName, parentName1, parentName2 } = staticFields;
                //     return { childId, childName, submitterPhone, parentName1, parentName2, signedPdf };
                // });
                // console.log(result);

                setLoading(false);
                navigate(`/submitted/${templateID}`);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        // Call the fetchData function when the component mounts
        fetchSubmittedData();

    }


    function downloadSubmittedData(event, templateID, templateName) {
        // Function to fetch data from the backend server
        const fetchSubmittedData = async () => {
            try {
                setLoading(true);
                // Make the GET request using Axios
                const response = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/submitted/${templateID}`);
                // const response = await axios.get(`http://localhost:3001/api/organzations/submitted/${templateID}`);
                console.log(response.data);
                const buffer = await generateExcelFile(response.data);
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `${templateName}.xlsx`);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        // Call the fetchData function when the component mounts
        fetchSubmittedData();

    }

    const generateExcelFile = async (submittedData) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        console.log(Object.keys(data).map(key => ({ header: key, key: key, width: key.length * 1.3 })));

        worksheet.columns = Object.keys(data).map(key => ({ header: key, key: key, width: key.length * 1.3 }));


        submittedData.forEach((submittedDocument, index) => {
            worksheet.addRow({ ...submittedDocument.staticFields, documentURL: submittedDocument.signedPdf });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    };


    const handleOpen = () => setOpenBundleCreator(true);
    const handleClose = () => setOpenBundleCreator(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const localUrl = `${window.AppConfig.serverDomain}/api/organzations/create-bundle/`;

        const extractedSelectedTemplates = selectedTemplates.filter((option) => option.selected).map(({ index, selected, ...rest }) => rest);

        const formData = {
            bundleName: bundleName,
            bundleTemplates: extractedSelectedTemplates,
            orgID: org.orgID
        };
        // Add more fields as needed

        try {
            const response = await axios.post(localUrl, formData);

            console.log(response.data);

            setCount(count + 1);

            // Do something with the response if needed
        } catch (error) {
            console.error('Error:', error);
        }

        handleClose();
    };

    const handleInputChange = (event) => {
        setBundleName(event.target.value);
    };
    const handleOptionChange = (optionId) => {
        setSelectedTemplates((prevOptions) =>
            prevOptions.map((option) =>
                option.index === optionId ? { ...option, selected: !option.selected } : option
            )
        );
    };

    const port = window.AppConfig.serverDomain.includes('localhost') ? ":" + currentPort : "";

    const handleDivChange = (divNumber) => {
        setSelectedDiv(divNumber);
    };

    const calculateFontSize = () => {
        // Calculate the font size based on the window width
        // You can customize the formula according to your preference
        // Here, we set the font size to be 1% of the window width
        return Math.max(windowWidth * 0.015, 12); // Minimum font size of 12px
    };

    function removeAfterLastUnderscore(str) {
        const lastUnderscoreIndex = str.lastIndexOf('_');
        if (lastUnderscoreIndex !== -1) {
            return str.substring(0, lastUnderscoreIndex);
        }
        return str;
    }

 

    return (
        <div style={{ direction: 'rtl' }}>

            {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}

            {org && (

                <div className="container" style={{ textAlign: 'right' }}>
                    <h1>{org.orgName} ({org.orgID})</h1>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', direction: 'ltr' }}>
                            <ButtonGroup variant="contained" >
                                <Button onClick={() => handleDivChange(1)} color={selectedDiv === 1 ? 'primary' : 'inherit'}>
                                    משתמשים
                                </Button>
                                <Button onClick={() => handleDivChange(3)} color={selectedDiv === 3 ? 'primary' : 'inherit'}>
                                    קבוצת מסמכים
                                </Button>
                                <Button onClick={() => handleDivChange(2)} color={selectedDiv === 2 ? 'primary' : 'inherit'}>
                                    מסמכים
                                </Button>
                            </ButtonGroup>
                        </div>

                        <Box mt={2}>
                            {selectedDiv === 1 && <div >{
                                org.members.map((member, index) => (
                                    <Card key={index} style={{ marginBottom: '10px' }}>
                                        <CardContent>
                                            <Typography variant="h5" component="div" style={{ fontSize: calculateFontSize(), direction: 'ltr' }}>
                                                { '0' + member.slice(4)}
                                            </Typography>
                                            {/* Add more card content based on your item data */}
                                        </CardContent>
                                    </Card>
                                )
                                )}
                                <div className="input-group" style={{ direction: 'ltr', fontSize: calculateFontSize() }}>
                                    <input style={{ fontSize: calculateFontSize() }} type="text" value={newMember} className="form-control" id="numberInput" placeholder="הכנס מספר פלפון" onChange={(event) => setNewMember(event.target.value)} />
                                    <button style={{ fontSize: calculateFontSize() }} className="btn btn-primary btn-sm  " onClick={(event) => handleAddMember(event, `${org.orgID}`)}> הוסף משתמש </button>
                                </div>
                                <br /></div>}
                            {selectedDiv === 2 && <div>{
                                org.templates.map((template, index) => (
                                    <Card key={index} style={{ marginBottom: '10px' }}>
                                        <CardContent>
                                            <Typography variant="h5" component="div" style={{ fontSize: calculateFontSize() }}>
                                                <b>{index + 1}. {removeAfterLastUnderscore(template.name.split('.')[0])}</b>  [מספר הגשות: {template.submitCount}]
                                            </Typography>
                                            <Typography variant="body2" style={{ fontSize: calculateFontSize() }}>
                                                <SimpleSnackbar templateLink={`${currentProtocol}//${currentDomain}${port}/template/${removeAfterLastUnderscore(template.name.split('.')[0])}_${template.id}`} />
                                            </Typography>
                                        </CardContent>
                                        <CardActions style={{ fontSize: calculateFontSize() }} sx={{ borderTop: '1px solid lightgrey', display: 'flex', justifyContent: 'space-between' }}>
                                            <Button size="small" style={{ fontSize: calculateFontSize() }} onClick={(event) => downloadSubmittedData(event, template.id, template.name)}> הורד הגשות </Button>
                                            <Button size="small" style={{ fontSize: calculateFontSize() }} onClick={(event) => showSubmittedData(event, template.id)}> הצדג הגשות </Button>
                                            <a style={{ fontSize: calculateFontSize() }} target="_blank" className="btn btn-outline-secondary btn-sm ms-3" href={`${currentProtocol}//${currentDomain}${port}/template/${removeAfterLastUnderscore(template.name.split('.')[0])}_${template.id}`}> פתח בדפדפן חדש <LaunchIcon fontSize="small" /></a>
                                        </CardActions>
                                    </Card>
                                )
                                )}
                                <Button size="small" variant="contained" color="primary" className="mb-5" onClick={(event) => handleCreateTemplate(event, `${org.orgID}`)}> צור מסמך חדש </Button>
                                <br /></div>}
                            {selectedDiv === 3 && <div>{org.bundles.map((bundle, index) => (
                                <Card key={index} style={{ marginBottom: '10px' }}>
                                    {/* <CardContent>
                                        <Typography variant="h5" component="div">
                                            <ul className="list-group px-0">
                                                <li className="list-group-item" style={{ fontSize: calculateFontSize() }} >שם: <b>{bundle.bundleName.split('.')[0]}</b> ({bundle.bundleID})</li>
                                                <li className="list-group-item" style={{ fontSize: calculateFontSize() }} >קישור לקבוצה:
                                                    <a style={{ fontSize: calculateFontSize() }} target="_blank" href={`${currentProtocol}//${currentDomain}${port}/bundle/${bundle.bundleID}`} className="btn btn-outline-secondary btn-sm ms-3">פתח בדפדפן חדש <LaunchIcon fontSize="small" /></a>
                                                    <SimpleSnackbar templateLink={`${currentProtocol}//${currentDomain}${port}/bundle/${bundle.bundleID}`} /></li>
                                                <li className="list-group-item" style={{ fontSize: calculateFontSize() }}>מסמכי הקבוצה: <b><ol className="px-0">{bundle.bundleTemplates.map((template, index) => <li className="" key={index}>{`${template.name.split('.')[0]} (id: ${template.id})`}</li>)}</ol></b></li>
                                            </ul>
                                        </Typography>
                                    </CardContent> */}
                                    <CardContent style={{ fontSize: calculateFontSize() }}>
                                        <Typography variant="h5" component="div" style={{ fontSize: calculateFontSize() }}>
                                            <b>{index + 1}. {bundle.bundleName.split('.')[0]}</b> 
                                        </Typography>
                                        <Typography variant="body2" style={{ fontSize: calculateFontSize() }}>
                                            <SimpleSnackbar templateLink={`${currentProtocol}//${currentDomain}${port}/bundle/${bundle.bundleID}`} />
                                        </Typography>
                                    </CardContent>
                                    <CardContent style={{ fontSize: calculateFontSize(), padding: '0px' }}>
                                        <Typography sx={{ borderTop: '1px solid lightgrey', paddingTop: '10px' }} style={{ fontSize: calculateFontSize() }}>
                                            <b><ol className="">{bundle.bundleTemplates.map((template, index) => <li className="" key={index}>{`${template.name.split('.')[0]} `}</li>)}</ol></b>
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ borderTop: '1px solid lightgrey', display: 'flex', justifyContent: 'space-between', fontSize: calculateFontSize() }}>
                                        <a style={{ fontSize: calculateFontSize() }} target="_blank" href={`${currentProtocol}//${currentDomain}${port}/bundle/${bundle.bundleID}`} className="btn btn-outline-secondary btn-sm ms-3">פתח בדפדפן חדש <LaunchIcon fontSize="small" /></a>
                                    </CardActions>
                                </Card>
                            )
                            )}
                                <>
                                    <Button className="mb-5" variant="contained" color="primary" onClick={handleOpen}>
                                        צור קבוצה חדשה
                                    </Button>
                                    <Modal open={openBundleCreator} onClose={handleClose}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: 400,
                                                bgcolor: 'background.paper',
                                                boxShadow: 24,
                                                p: 4,
                                            }}
                                        >
                                            <form onSubmit={handleSubmit} style={{ direction: 'ltr' }}>
                                                <TextField
                                                    label={"Bundle Name"}
                                                    value={bundleName}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{ mt: 2 }}
                                                />
                                                {selectedTemplates.map((template, index) => (
                                                    <FormControlLabel
                                                        key={template.index}
                                                        control={
                                                            <Checkbox
                                                                checked={template.selected}
                                                                onChange={() => handleOptionChange(template.index)}
                                                            />
                                                        }
                                                        label={`${template.name} (${template.id})`}
                                                    />
                                                ))}
                                                {/* Add more form fields here */}
                                                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                                    הגש
                                                </Button>
                                            </form>
                                        </Box>
                                    </Modal>
                                </></div>}
                        </Box>
                    </div>

                </div>
            )}
        </div>
    );
};

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
    documentURL: "",
};

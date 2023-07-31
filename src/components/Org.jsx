import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AtomicSpinner from 'atomic-spinner';
import { Typography, Card, CardContent, Button, Modal, Box, TextField, Checkbox, FormControlLabel } from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import SimpleSnackbar from './SimpleSnackbar';

export default function Org(props) {
    const [org, setOrg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newMember, setNewMember] = useState("");
    const [count, setCount] = useState(0);
    const [openBundleCreator, setOpenBundleCreator] = useState(false);
    const [bundleName, setBundleName] = useState([""]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);


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

    function handleCreateTemplate(event, orgID) {

        navigate(`/create-template/${orgID}`);
    }

    async function handleAddMember(event, orgID) {

        if (newMember.length < 10) {
            alert('אנא הכנס את מספר הפלפון בשלימותו בשדה שמעל כפתור ההוספה.');
            return;
        }
        console.log(newMember);

        // const localUrl = "http://localhost:3001/api/organzations/add-member/";
        const localUrl = `${window.AppConfig.serverDomain}/api/organzations/add-member/`;

        const formData = {
            orgID: orgID,
            newMember: newMember,
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
                const response = await axios.get(`${window.AppConfig.serverDomain}/api/organzations/submitted/${templateID}`);
                // const response = await axios.get(`http://localhost:3001/api/organzations/submitted/${templateID}`);
                console.log(response.data);
                const buffer = await generateExcelFile(response.data);
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'data.xlsx');
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

        console.log(Object.keys(data).map(key => ({ header: key, key: key, width: key.length * 2 })));

        worksheet.columns = Object.keys(data).map(key => ({ header: key, key: key, width: key.length * 2 }));


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

    return (
        <div style={{ direction: 'ltr' }}>

            {loading && <div className="loading-wrapper"><div className="loading"><AtomicSpinner /></div></div>}

            {org && (

                <div className="container" style={{ textAlign: 'left' }}>
                    <h1>{org.orgName} ({org.orgID})</h1>
                    <h3>Org members:</h3>
                    {
                        org.members.map((member, index) => (
                            <Card key={index} style={{ marginBottom: '10px' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {member}
                                    </Typography>
                                    {/* Add more card content based on your item data */}
                                </CardContent>
                            </Card>
                        )
                        )}
                    <input type="text" style={{ maxWidth: "200px" }} value={newMember} className="form-control" id="numberInput" placeholder="Enter phone number" onChange={(event) => setNewMember(event.target.value)} />
                    <button className="btn btn-primary btn-sm" onClick={(event) => handleAddMember(event, `${org.orgID}`)}> Add new member </button>
                    <br />

                    <h3>Org Templates:</h3>
                    {
                        org.templates.map((template, index) => (
                            <Card key={index} style={{ marginBottom: '10px' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        <ul className="list-group">
                                            <li className="list-group-item">id: <b>{template.id}</b></li>
                                            <li className="list-group-item">name: <b>{template.name}</b></li>
                                            <li className="list-group-item">Template Link: <SimpleSnackbar templateLink={`${currentProtocol}//${currentDomain}/template/${template.name.split('.')[0]}_${template.id}`} /></li>
                                            <li className="list-group-item"><button className="btn btn-primary btn-sm" onClick={(event) => showSubmittedData(event, template.id)}>view submitted data</button></li>
                                        </ul>
                                    </Typography>
                                    {/* Add more card content based on your item data */}
                                </CardContent>
                            </Card>
                        )
                        )}
                    <button className="btn btn-primary btn-sm" onClick={(event) => handleCreateTemplate(event, `${org.orgID}`)}> Create New Template </button>
                    <br />
                    <h3>Org Bundles:</h3>
                        {org.bundles.map((bundle, index) => (
                            <Card key={index} style={{ marginBottom: '10px' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        <ul className="list-group">
                                            <li className="list-group-item">id: <b>{bundle.bundleID}</b></li>
                                            <li className="list-group-item">name: <b>{bundle.bundleName}</b></li>
                                            <li className="list-group-item">Bundle link: <SimpleSnackbar templateLink={`${currentProtocol}//${currentDomain}/bundle/${bundle.bundleID}`} /></li>
                                            <li className="list-group-item">templates: <b><ul className="list-group">{bundle.bundleTemplates.map((template, index) => <li className="list-group-item"><div key={index}>{`${index}: ${template.name} (id: ${template.id})`}<br /></div></li>)}</ul></b></li>
                                        </ul>
                                    </Typography>
                                    {/* Add more card content based on your item data */}
                                </CardContent>
                            </Card>
                        )
                        )}
                    <>
                        <Button variant="contained" color="primary" onClick={handleOpen}>
                            Create Bundle
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
                                        Submit
                                    </Button>
                                </form>
                            </Box>
                        </Modal>
                    </>
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

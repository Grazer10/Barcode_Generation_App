import React, { useState, useEffect } from 'react';
import urlSocket from './urlSocket';
import img_url from './imageurl';
import "./CSS/UIstyle.css";
import {Button} from "reactstrap";

// import axios from 'axios';
import {
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Collapse,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
    UncontrolledCollapse
  } from "reactstrap";
import classnames from "classnames";


function App() {
    const [selectedOption, setSelectedOption] = useState('');
    const [typedText, setTypedText] = useState('');
    const [imgData, setImgData] = useState(''); 
    const [verticalActiveTab, setverticalActiveTab] = useState("clone");
    const [horizontalActiveTab, setHorizontalActiveTab] = useState('1D_bar_code');
    const [barCodeQuantity, setBarCodeQuantity] = useState('');
    const [barCodeWidth, setBarCodeWidth] = useState('');
    const [barCodeHeight, setBarCodeHeight] = useState('');
    const [QRCodeScale, setQRCodeScale] = useState('');
    const [formatSelectedOption, setFormatSelectedOption] = useState('');
    const [dataLabel, setDataLabel] = useState(false);
    const [prefixText, setPrefixText ] = useState('');
    const [mainText, setMainText ] = useState('');
    const [suffixText, setSuffixText ] = useState('');
    const [seriesFormSubmitted, setSeriesFormSubmitted] = useState(false);
    const [seriesImageArray, setSeriesImgArray] = useState([]);


    // Define state variables for error messages
    const [selectedOptionError, setSelectedOptionError] = useState('');
    const [typedTextError, setTypedTextError] = useState('');
    const [barCodeWidthError, setBarCodeWidthError] = useState('')
    const [barCodeHeightError, setBarCodeHeightError] = useState('')    
    const [QRCodeScaleError, setQRCodeScaleError] = useState('');
    const [barCodeQuantityError, setBarCodeQuantityError] = useState('');
    const [dataLabelError, setDataLabelError] = useState('');
    const [formatSelectedOptionError, setFormatSelectedOptionError] = useState('');

    const [prefixTextError, setPrefixTextError] = useState('');
    const [mainTextError, setMainTextError] = useState('');
    const [suffixTextError, setSuffixTextError] = useState('');


    // Handler for option select
    const handleOptionChange = (event) => {
        setBarCodeQuantity('');
        setBarCodeWidth('');
        setBarCodeHeight('');
        setQRCodeScale('');
        setSelectedOption(event.target.value);

        setDataLabel('');
        setFormatSelectedOption('');
        setPrefixText('');
        setMainText('');
        setSuffixText('');
        setSeriesImgArray([]);

        sessionStorage.removeItem("barCodeQuantity");
        sessionStorage.removeItem("selectedTab");
        sessionStorage.removeItem("imgData");
        sessionStorage.removeItem("seriesImgArray");
        sessionStorage.removeItem("barCodeWidth");
        sessionStorage.removeItem("barCodeHeight");
        sessionStorage.removeItem("QRCodeScale");

        if (typedText !== ('') ){
            setTypedText('');
            setBarCodeQuantity('');
            setBarCodeWidth('');
            setBarCodeHeight('');
            setQRCodeScale('');
        }
    }

    const handleFormatChange = (event) => {
        setFormatSelectedOption(event.target.value);
    };


    // Handler for text input change
    const handleTextChange = (event) => {
        setTypedText(event.target.value);
    };

    ////// Prefix suffix main ////// SERIES //////

    // Handler for text input change
    const handlePrefixChange = (event) => {
        setPrefixText(event.target.value);
    };

    // Handler for text input change
    const handleMainChange = (event) => {
        setMainText(event.target.value);
    };


    // Handler for text input change
    const handleSuffixChange = (event) => {
        let inputValue = parseInt(event.target.value, 10);
        const maxValue = parseInt(event.target.max, 10); 

        if (inputValue > maxValue) {
            inputValue = maxValue;
        }
        setSuffixText(event.target.value);
    };

    // Handler for text input change
    const handleDataLabel = (event) => {
        setDataLabel(event.target.checked);
    };

    const resultingImgUrl = (path) => {
        let basepath = path.replaceAll("\\", "/");
        let imgpath = `${img_url}${basepath}.${formatSelectedOption}`;
        return imgpath
    }

    const handleReset = () => {
        setSelectedOption('');
        setTypedText('');
        setImgData('');
        setBarCodeQuantity('');
        setBarCodeWidth('');
        setBarCodeHeight('');
        setQRCodeScale(''); 
        setFormatSelectedOption('');
        setDataLabel(false);
        setPrefixText('');
        setMainText('');
        setSuffixText('');
        setSeriesFormSubmitted(false);
        setSeriesImgArray([]);

        setSelectedOptionError('');
        setTypedTextError('');
        setPrefixTextError('');
        setMainTextError('');
        setSuffixTextError('');
        setBarCodeQuantityError('');
        setQRCodeScaleError('');
        setFormatSelectedOptionError('');
        setDataLabelError(false);
        setBarCodeWidthError('');
        setBarCodeHeightError('');
        
        sessionStorage.removeItem("barCodeQuantity");
        sessionStorage.removeItem("selectedTab");
        sessionStorage.removeItem("imgData");
        sessionStorage.removeItem("seriesImgArray");

        sessionStorage.removeItem("barCodeWidth");
        sessionStorage.removeItem("barCodeHeight");
        sessionStorage.removeItem("QRCodeScale");

    }

    // Handler for form submission
    const handle1DCloneSubmit = async () => {
        event.preventDefault();

        setSelectedOptionError('');
        setTypedTextError('');
        setBarCodeQuantityError('');
        setQRCodeScaleError('');
        setFormatSelectedOptionError('');
        setDataLabelError(false);
        setBarCodeWidthError('');
        setBarCodeHeightError('');

        // Validation checks
        let isValid = true;
        if (selectedOption === '') {
            setSelectedOptionError('Please select the type of Bar/QR Code*');
            isValid = false;
        }
        if (typedText === '') {
            setTypedTextError('Please type your text*');
            isValid = false;
        }
        if (barCodeWidth <= 0) {
            setBarCodeWidthError("Please enter a width for the barcode*")
        }
        if (barCodeHeight <= 0) {
            setBarCodeHeightError("Please enter a height for the barcode*")
        }
        if (barCodeQuantity <= 0) {
            setBarCodeQuantityError('Please enter a number for bar code quantity*');
            isValid = false;
        }
        if (!dataLabel) {
            setDataLabelError('Please enter a data label*');
            isValid = false;
        }
        if (!['svg', 'png'].includes(formatSelectedOption)) {
            setFormatSelectedOptionError('Please select a format for the barcode*');
            isValid = false;
        }

        if (isValid) {

            try {
                // Send data to backend route
                const response = await urlSocket.post("/get_clone_info", {
                    selectedOption,
                    typedText,
                    barCodeQuantity,
                    barCodeWidth,
                    barCodeHeight,
                    QRCodeScale,
                    formatSelectedOption,
                    verticalActiveTab,
                    horizontalActiveTab,
                    dataLabel,
                });
                // console.log('Response from backend:', response.data);
                let img = resultingImgUrl(response.data)
                setImgData(img)
            } catch (error) {
                console.error('Error sending data to backend:', error);
            }
        }

    };

    // Handler for form submission
    const handle2DCloneSubmit = async () => {
        event.preventDefault();

        setSelectedOptionError('');
        setTypedTextError('');
        setBarCodeQuantityError('');
        setQRCodeScaleError('');
        setFormatSelectedOptionError('');
        setDataLabelError(false);
        setBarCodeWidthError('');
        setBarCodeHeightError('');

        // Validation checks
        let isValid = true;
        if (selectedOption === '') {
            setSelectedOptionError('Please select the type of Bar/QR Code*');
            isValid = false;
        }
        if (typedText === '') {
            setTypedTextError('Please type your text*');
            isValid = false;
        }
        if (QRCodeScale <= 0) {
            setQRCodeScaleError('Please enter a valid size for QR Code*');
            isValid = false;
        }
        if (barCodeQuantity <= 0) {
            setBarCodeQuantityError('Please enter a number for bar code quantity*');
            isValid = false;
        }
        if (!['svg', 'png'].includes(formatSelectedOption)) {
            setFormatSelectedOptionError('Please select a format for the barcode*');
            isValid = false;
        }

        if (isValid) {

            try {
                // Send data to backend route
                const response = await urlSocket.post("/get_clone_info", {
                    selectedOption,
                    typedText,
                    barCodeQuantity,
                    barCodeWidth,
                    barCodeHeight,
                    QRCodeScale,
                    formatSelectedOption,
                    verticalActiveTab,
                    horizontalActiveTab,
                    dataLabel,
                });
                // console.log('Response from backend:', response.data);
                let img = resultingImgUrl(response.data)
                setImgData(img)
            } catch (error) {
                console.error('Error sending data to backend:', error);
            }
        }

    };
    

    // Handler for form submission
    const handle1DSeriesSubmit = async () => {
        event.preventDefault();

        setSelectedOptionError('');
        setPrefixTextError('');
        setMainTextError('');
        setSuffixTextError('');
        setBarCodeWidthError('');
        setBarCodeHeightError('');
        setQRCodeScaleError('');
        setBarCodeQuantityError('');
        setFormatSelectedOptionError('');
        setDataLabelError(false);

        // Validation checks
        let isValid = true;
        if (selectedOption === '') {
            setSelectedOptionError('Please select the type of Bar/QR Code*');
            isValid = false;
        }
        if (prefixText === '') {
            setPrefixTextError('*');
            isValid = false;
        }
        if (mainText === '') {
            setMainTextError('*');
            isValid = false;
        }
        if (suffixText <= 0) {
            setSuffixTextError('*');
            isValid = false;
        }
        if (barCodeWidth <=0){
            setBarCodeWidthError("Please enter a width for the barcode*")
        }
        if (barCodeHeight <=0){
            setBarCodeHeightError("Please enter a height for the barcode*")
        }
        if (barCodeQuantity <= 0) {
            setBarCodeQuantityError('Please enter a number for bar code quantity*');
            isValid = false;
        }
        if (!dataLabel) {
            setDataLabelError('Please enter a data label*');
            isValid = false;
        }
        if (!['svg', 'png'].includes(formatSelectedOption)) {
            setFormatSelectedOptionError('Please select a format for the barcode*');
            isValid = false;
        }

        if (!isValid) {
            // If validation fails, return without submitting the form
            return;
        }

        try {
            // Send data to backend route
            const response = await urlSocket.post("/get_series_info", {
                selectedOption,
                prefixText,
                mainText,
                suffixText,
                barCodeQuantity,
                barCodeWidth,
                barCodeHeight,
                QRCodeScale,
                formatSelectedOption,
                verticalActiveTab,
                horizontalActiveTab,
                dataLabel,

            });
            // console.log('Response from backend:', response.data);

            setSeriesFormSubmitted(true);
            const series_paths = response.data;
            let seriesImgArray = [];

            series_paths.forEach(async (path) => {
                try {
                    let seriesImg = await resultingImgUrl(path);
                    seriesImgArray.push(seriesImg);
                } catch (error) {
                    console.error('Error processing barcode path:', error);
                }
            });

            setSeriesImgArray(seriesImgArray)

        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    // Handler for form submission
    const handle2DSeriesSubmit = async () => {
        event.preventDefault();

        setSelectedOptionError('');
        setPrefixTextError('');
        setMainTextError('');
        setSuffixTextError('');
        setBarCodeWidthError('');
        setBarCodeHeightError('');
        setQRCodeScaleError('');
        setBarCodeQuantityError('');
        setFormatSelectedOptionError('');
        setDataLabelError(false);

        // Validation checks
        let isValid = true;
        if (selectedOption === '') {
            setSelectedOptionError('Please select the type of Bar/QR Code*');
            isValid = false;
        }
        if (prefixText === '') {
            setPrefixTextError('*');
            isValid = false;
        }
        if (mainText === '') {
            setMainTextError('*');
            isValid = false;
        }
        if (suffixText <= 0) {
            setSuffixTextError('*');
            isValid = false;
        }
        if (QRCodeScale <= 0) {
            setQRCodeScaleError('Please enter a valid scale for QR Code*');
            isValid = false;
        }
        if (barCodeQuantity <= 0) {
            setBarCodeQuantityError('Please enter a number for bar code quantity*');
            isValid = false;
        }
        if (!['svg', 'png'].includes(formatSelectedOption)) {
            setFormatSelectedOptionError('Please select a format for the barcode*');
            isValid = false;
        }

        if (!isValid) {
            // If validation fails, return without submitting the form
            return;
        }

        try {
            // Send data to backend route
            const response = await urlSocket.post("/get_series_info", {
                selectedOption,
                prefixText,
                mainText,
                suffixText,
                barCodeQuantity,
                barCodeWidth,
                barCodeHeight,
                QRCodeScale,
                formatSelectedOption,
                verticalActiveTab,
                horizontalActiveTab,
                dataLabel,

            });
            setSeriesFormSubmitted(true);
            const series_paths = response.data;
            let seriesImgArray = [];


            series_paths.forEach(async (path) => {
                try {
                    let seriesImg = await resultingImgUrl(path);
                    seriesImgArray.push(seriesImg);
                } catch (error) {
                    console.error('Error processing barcode path:', error);
                }
            });

            setSeriesImgArray(seriesImgArray)

        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };



    const toggleVertical = tab => {
        if (verticalActiveTab !== tab) {
            setverticalActiveTab(tab);
        }   

        setSelectedOption('');
        setTypedText('');
        setBarCodeQuantity('');
        setBarCodeWidth('');
        setBarCodeHeight('');
        setQRCodeScale('');
        setImgData('');
        setFormatSelectedOption('');
        setDataLabel(false);
        setHorizontalActiveTab('1D_bar_code');
        setPrefixText('');
        setMainText('');
        setSuffixText('');
        setSeriesImgArray([]);

        setSelectedOptionError('');
        setTypedTextError('');
        setPrefixTextError('');
        setMainTextError('');
        setSuffixTextError('');
        setBarCodeQuantityError('');
        setQRCodeScaleError('');
        setFormatSelectedOptionError('');
        setDataLabelError(false);
        setBarCodeWidthError('');
        setBarCodeHeightError('');
        sessionStorage.removeItem("barCodeQuantity");
        sessionStorage.removeItem("selectedTab");
        sessionStorage.removeItem("imgData");
        sessionStorage.removeItem("seriesImgArray");
        sessionStorage.removeItem("barCodeWidth");
        sessionStorage.removeItem("barCodeHeight");
        sessionStorage.removeItem("QRCodeScale");
    };

    const toggleHorizontal = (tab) => {
        if (horizontalActiveTab !== tab) setHorizontalActiveTab(tab);
        setSelectedOption('');
        setTypedText('');
        setBarCodeQuantity('');
        setBarCodeWidth('');
        setBarCodeHeight('');
        setQRCodeScale('');
        setImgData('');
        setFormatSelectedOption('');
        setDataLabel(false);
        setPrefixText('');
        setMainText('');
        setSuffixText('');
        setSeriesImgArray([]);
        setSelectedOptionError('');
        setTypedTextError('');
        setPrefixTextError('');
        setMainTextError('');
        setSuffixTextError('');
        setBarCodeQuantityError('');
        setQRCodeScaleError('');
        setFormatSelectedOptionError('');
        setDataLabelError(false);
        setBarCodeWidthError('');
        setBarCodeHeightError('');
        sessionStorage.removeItem("barCodeQuantity");
        sessionStorage.removeItem("selectedTab");
        sessionStorage.removeItem("imgData");
        sessionStorage.removeItem("seriesImgArray");
        sessionStorage.removeItem("barCodeWidth");
        sessionStorage.removeItem("barCodeHeight");
        sessionStorage.removeItem("QRCodeScale");
    };

    const handleIncrementChange = (event) => {
        let inputValue = parseInt(event.target.value, 10); // Parse input value as integer
        const maxValue = parseInt(event.target.max, 10); // Get maximum value from input field
    
        // // Check if newValue is NaN or less than 1
        // if (isNaN(inputValue) || inputValue < 1) {
        //     inputValue = 1; // Set to default value
        // }
        // Check if newValue exceeds the maximum value
        if (inputValue > maxValue) {
            inputValue = maxValue;
        }
    
        setBarCodeQuantity(inputValue); 
    };
    
    const handleIncrementChangeWidth = (event) => {
        let inputValue = parseInt(event.target.value, 10);
        const maxValue = parseInt(event.target.max, 10); 

        if (inputValue > maxValue) {
            inputValue = maxValue; 
        }
    
        setBarCodeWidth(inputValue); 
    };

    const handleIncrementChangeHeight = (event) => {
        let inputValue = parseInt(event.target.value, 10);
        const maxValue = parseInt(event.target.max, 10); 

        if (inputValue > maxValue) {
            inputValue = maxValue; 
        }
    
        setBarCodeHeight(inputValue); 
    };

    const handleIncrementChangeQRScale = (event) => {
        let inputValue = parseInt(event.target.value, 10); 
        const maxValue = parseInt(event.target.max, 10); 
    
        if (inputValue > maxValue) {
            inputValue = maxValue; 
        }
    
        setQRCodeScale(inputValue);
    };

    const openClonePreviewPage = (imgData) => {
        sessionStorage.setItem("selectedTab", JSON.stringify(verticalActiveTab));
        sessionStorage.setItem("imgData", JSON.stringify(imgData));
        sessionStorage.setItem("barCodeQuantity", JSON.stringify(barCodeQuantity));
        sessionStorage.setItem("barCodeWidth", JSON.stringify(barCodeWidth));
        sessionStorage.setItem("barCodeHeight", JSON.stringify(barCodeHeight));

        window.open("/preview", "_blank");
    };


    const openSeriesPreviewPage = () => {
        
        sessionStorage.setItem("seriesImgArray", JSON.stringify(seriesImageArray));
        sessionStorage.setItem("selectedTab", JSON.stringify(verticalActiveTab));
        sessionStorage.setItem("QRCodeScale", JSON.stringify(QRCodeScale));
        // sessionStorage.setItem("barCodeQuantity", JSON.stringify(barCodeQuantity));

        window.open("/preview", "_blank");
    };


    return (
        <React.Fragment>
            <div className='page-content' style={{ maxWidth: "650px", margin: "0 auto", textAlign: "center" }}>
                <Container fluid><h2 className='my-5'>Welcome to Bar Code Generation</h2></Container>
                <Row>
                    <CardBody>
                        <Row>
                            <Col md="3">
                                <Nav pills className="flex-column">
                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                                "mb-2": true,
                                                active: verticalActiveTab === "clone",
                                            })}
                                            onClick={() => {
                                                toggleVertical("clone");
                                            }}
                                        >
                                            Clone
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                                "mb-2": true,
                                                active: verticalActiveTab === "series",
                                            })}
                                            onClick={() => {
                                                toggleVertical("series");
                                            }}
                                        >
                                            Series
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                            <Col md="9">
                                <TabContent
                                    activeTab={verticalActiveTab}
                                    className="text-muted mt-4 mt-md-0"
                                >
                                    
{/* ////////////////////////////////////////////////////////CLONE_1D/CLONE_1D/CLONE_1D/CLONE_1D/CLONE_1D/CLONE_1D/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                                    <TabPane tabId="clone">
                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: horizontalActiveTab === "1D_bar_code",
                                                    })}
                                                    onClick={() => {
                                                        toggleHorizontal("1D_bar_code");
                                                    }}
                                                >
                                                    1D_bar_code
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: horizontalActiveTab === "2D_bar_code",
                                                    })}
                                                    onClick={() => {
                                                        toggleHorizontal("2D_bar_code");
                                                    }}
                                                >
                                                    2D_bar_code
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={horizontalActiveTab}>
                                            <TabPane tabId="1D_bar_code">
                                                <div style={{ marginTop: "30px" }}></div>
                                                {/* Form inside horizontal tab 1 */}
                                                <form onSubmit={handle1DCloneSubmit}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <select className="form-control mb-3" style={{ width: "300px", margin: "0", marginBottom: "10px" }} value={selectedOption} onChange={handleOptionChange}>
                                                            <option value="">Select the Type of Bar/QR Code</option>
                                                            <option value="Code128">Code128</option>
                                                            <option value="code39">Code39</option>
                                                            <option value="Gs1_128">GS1-128</option>
                                                            <option value="EAN13">EAN13</option>
                                                            <option value="isbn13">ISBN-13</option>
                                                            <option value="upca">UPC-A</option>
                                                            <option value="issn">ISSN</option>
                                                            <option value="pzn">PZN-7</option>
                                                        </select>
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{selectedOptionError}</Row>


                                                    <input className="form-control mb-3" type="text" placeholder="Type your text here..."
                                                        aria-label="Type your text here..." style={{ width: "300px", margin: "0 auto" }} value={typedText} onChange={handleTextChange} />
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{typedTextError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the width of bar code"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='1000'
                                                            onChange={handleIncrementChangeWidth}
                                                            value={barCodeWidth}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{barCodeWidthError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the height of bar code"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='1000'
                                                            onChange={handleIncrementChangeHeight}
                                                            value={barCodeHeight}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{barCodeHeightError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the number of bar codes"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='100'
                                                            onChange={handleIncrementChange}
                                                            value={barCodeQuantity}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{barCodeQuantityError}</Row>

                                                    <Row style={{ marginLeft: '150px', marginTop: '-20px', marginBottom: '0px' }}>
                                                        <Col xl={3} sm={6}>
                                                            <div className="mt-4 d-flex align-items-center justify-content-start">
                                                                <div className="form-check form-check-right mb-3 me-3">
                                                                    <input
                                                                        className="form-check-input" 
                                                                        type="checkbox"
                                                                        id="defaultCheck1"
                                                                        checked={dataLabel}
                                                                        onChange={handleDataLabel}
                                                                    />
                                                                    <label
                                                                        className="form-check-label ms-1 me-1" 
                                                                        htmlFor="defaultCheck1"
                                                                        style={{
                                                                            whiteSpace: 'nowrap',
                                                                            fontSize: '1.1em',
                                                                        }}
                                                                    >
                                                                        Show Data Label
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: "0", marginBottom: "30px", color: "red", fontSize: "small", marginLeft: '90px', whiteSpace: 'nowrap'}}>{dataLabelError}</Row>

                                                    <Row style={{ marginLeft: '80px', marginTop: '-20px', marginBottom: '0px' }}>
                                                        <Col xl={3} sm={6}>
                                                            <div className="mt-2 d-flex justify-content-start">
                                                            <h5 className="font-size-14 mb-1  me-3" style={{ whiteSpace: 'nowrap', margin: '1px' }}>BarCode Format</h5>
                                                                <div className="form-check mb-3 me-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="exampleRadios"    
                                                                        id="exampleRadios1"
                                                                        value="svg"
                                                                        checked={formatSelectedOption === 'svg'}
                                                                        onChange={handleFormatChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="exampleRadios1"
                                                                    >
                                                                        svg
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="exampleRadios"
                                                                        id="exampleRadios2"
                                                                        value="png"
                                                                        checked={formatSelectedOption === 'png'}
                                                                        onChange={handleFormatChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="exampleRadios2"
                                                                    >
                                                                        png
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: "0", marginBottom: "30px", color: "red", fontSize: "small", marginLeft: '90px', whiteSpace: 'nowrap'}}>{formatSelectedOptionError}</Row>

                                                    <button type="submit" className="btn btn-secondary me-3">Generate</button>
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleReset}>Reset</button>
                                                </form>

                                                <div className='container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    {imgData && (
                                                        <React.Fragment>
                                                            <img src={imgData} className="img-control my-4" alt="Generated QR/Barcode" />

                                                            <Button color="primary" className=" btn-sm " onClick={() => (openClonePreviewPage(imgData))}>Preview</Button>
                                                            <h5 className="img-control my-4" style={{ textAlign: 'center' }}>Your generated {selectedOption} code is here</h5>
                                                        </React.Fragment>
                                                    )}
                                                </div>
                                            </TabPane>

{/* ////////////////////////////////////////////////////////CLONE_2D/CLONE_2D/CLONE_2D/CLONE_2D/CLONE_2D/CLONE_2D/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}


                                            <TabPane tabId="2D_bar_code">
                                                <div style={{ marginTop: "30px" }}></div>
                                                <form onSubmit={handle2DCloneSubmit}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <select className="form-control mb-3" style={{ width: "300px", margin: "0 auto" }} value={selectedOption} onChange={handleOptionChange}>
                                                            <option value="">Select the Type of Bar/QR Code</option>
                                                            <option value="qr">QR Code</option>
                                                            <option value="micro">Micro QRcode</option>
                                                        </select>
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{selectedOptionError}</Row>

                                                    <input className="form-control mb-3" type="text" placeholder="Type your text here..."
                                                        aria-label="Type your text here..." style={{ width: "300px", margin: "0 auto" }} value={typedText} onChange={handleTextChange} />
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{typedTextError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the size of bar code"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='100'
                                                            onChange={handleIncrementChangeQRScale}
                                                            value={QRCodeScale}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{QRCodeScaleError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the number of bar codes"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='100'
                                                            onChange={handleIncrementChange}
                                                            value={barCodeQuantity}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{barCodeQuantityError}</Row>

                                                    <Row style={{ marginLeft: '80px', marginTop: '-20px', marginBottom: '0px' }}>
                                                        <Col xl={3} sm={6}>
                                                            <div className="mt-4 d-flex justify-content-start">
                                                                <h5 className="font-size-14 mb-1  me-3" style={{ whiteSpace: 'nowrap', margin: '1px' }}>BarCode Format</h5>
                                                                <div className="form-check mb-3 me-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="exampleRadios"
                                                                        id="exampleRadios1"
                                                                        value="svg"
                                                                        checked={formatSelectedOption === 'svg'}
                                                                        onChange={handleFormatChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="exampleRadios1"
                                                                    >
                                                                        svg
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="exampleRadios"
                                                                        id="exampleRadios2"
                                                                        value="png"
                                                                        checked={formatSelectedOption === 'png'}
                                                                        onChange={handleFormatChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="exampleRadios2"
                                                                    >
                                                                        png
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: "0", marginBottom: "30px", color: "red", fontSize: "small", marginLeft: '90px', whiteSpace: 'nowrap'}}>{formatSelectedOptionError}</Row>

                                                    <button type="submit" className="btn btn-secondary me-3">Generate</button>
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleReset}>Reset</button>
                                                </form>

                                                <div className='container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    {imgData && (
                                                        <React.Fragment>
                                                            <img src={imgData} className="img-control my-4" alt="Generated QR/Barcode" />

                                                            <Button color="primary" className=" btn-sm " onClick={() => (openClonePreviewPage(imgData))}>Preview</Button>
                                                            <h5 className="img-control my-4" style={{ textAlign: 'center' }}>Your generated {selectedOption} code is here</h5>
                                                        </React.Fragment>
                                                    )}
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                    </TabPane>

{/* ////////////////////////////////////////////////////////SERIES_1D/SERIES_1D/SERIES_1D/SERIES_1D/SERIES_1D/SERIES_1D/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                                    <TabPane tabId="series">
                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: horizontalActiveTab === "1D_bar_code",
                                                    })}
                                                    onClick={() => {
                                                        toggleHorizontal("1D_bar_code");
                                                    }}
                                                >
                                                    1D_bar_code
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: horizontalActiveTab === "2D_bar_code",
                                                    })}
                                                    onClick={() => {
                                                        toggleHorizontal("2D_bar_code");
                                                    }}
                                                >
                                                    2D_bar_code
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={horizontalActiveTab}>
                                            <TabPane tabId="1D_bar_code">
                                                <div style={{ marginTop: "30px" }}></div>
                                                {/* Form inside horizontal tab 1 */}
                                                <form onSubmit={handle1DSeriesSubmit}>
                                                    <select className="form-control mb-3" style={{ width: "300px", margin: "0 auto" }} value={selectedOption} onChange={handleOptionChange}>
                                                        <option value="">Select the Type of Bar/QR Code</option>
                                                        <option value="Code128">Code128</option>
                                                        <option value="code39">Code39</option>
                                                        <option value="Gs1_128">GS1-128</option>
                                                        <option value="EAN13">EAN13</option>
                                                        <option value="isbn13">ISBN-13</option>
                                                        <option value="upca">UPC-A</option>
                                                        <option value="issn">ISSN</option>
                                                        <option value="pzn">PZN-7</option>
                                                    </select>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{selectedOptionError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                                                        <input className="form-control mb-3" type="text" placeholder="Prefix..."
                                                            aria-label="Prefix" style={{ width: "93px", marginLeft: "90px" }} value={prefixText} onChange={handlePrefixChange} />
                                                        <div style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '1px' }}>{prefixTextError}</div>

                                                        <input className="form-control mb-3" type="text" placeholder="Main..."
                                                            aria-label="Main" style={{ width: "93px", marginLeft: "10px" }} value={mainText} onChange={handleMainChange} />
                                                        <div style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '1px' }}>{mainTextError}</div>

                                                        <input className="form-control mb-3" type="number" id="example-number-input" placeholder="Suffix..."
                                                            aria-label="Suffix" style={{ width: "93px", marginLeft: "10px" }} min='1' max='100' value={suffixText} onChange={handleSuffixChange} />
                                                        <div style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '1px' }}>{suffixTextError}</div>
                                                    </div>


                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "10px" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the width of bar code"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='1000'
                                                            onChange={handleIncrementChangeWidth}
                                                            value={barCodeWidth}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0px", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{barCodeWidthError}</Row>


                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the height of bar code"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='1000'
                                                            onChange={handleIncrementChangeHeight}
                                                            value={barCodeHeight}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{barCodeHeightError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the number of bar codes"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='100'
                                                            onChange={handleIncrementChange}
                                                            value={barCodeQuantity}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{barCodeQuantityError}</Row>

                                                    <Row style={{ marginLeft: '150px', marginTop: '-20px', marginBottom: '0px' }}>
                                                        <Col xl={3} sm={6}>
                                                            <div className="mt-4 d-flex align-items-center justify-content-start">
                                                                <div className="form-check form-check-right mb-3 me-3">
                                                                    <input
                                                                        className="form-check-input" 
                                                                        type="checkbox"
                                                                        id="defaultCheck1"
                                                                        checked={dataLabel}
                                                                        onChange={handleDataLabel}
                                                                    />
                                                                    <label
                                                                        className="form-check-label ms-1 me-1" 
                                                                        htmlFor="defaultCheck1"
                                                                        style={{
                                                                            whiteSpace: 'nowrap',
                                                                            fontSize: '1.1em',
                                                                        }}
                                                                    >
                                                                        Show Data Label
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: "0", marginBottom: "30px", color: "red", fontSize: "small", marginLeft: '90px', whiteSpace: 'nowrap'}}>{dataLabelError}</Row>

                                                    <Row style={{ marginLeft: '80px', marginTop: '-20px', marginBottom: '0px' }}>
                                                        <Col xl={3} sm={6}>
                                                            <div className="mt-2 d-flex justify-content-start">
                                                                <h5 className="font-size-14 mb-1  me-3" style={{ whiteSpace: 'nowrap', margin: '1px' }}>BarCode Format</h5>
                                                                <div className="form-check mb-3 me-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="exampleRadios"
                                                                        id="exampleRadios1"
                                                                        value="svg"
                                                                        checked={formatSelectedOption === 'svg'}
                                                                        onChange={handleFormatChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="exampleRadios1"
                                                                    >
                                                                        svg
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="exampleRadios"
                                                                        id="exampleRadios2"
                                                                        value="png"
                                                                        checked={formatSelectedOption === 'png'}
                                                                        onChange={handleFormatChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="exampleRadios2"
                                                                    >
                                                                        png
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: "0", marginBottom: "30px", color: "red", fontSize: "small", marginLeft: '90px', whiteSpace: 'nowrap'}}>{formatSelectedOptionError}</Row>

                                                    <button type="submit" className="btn btn-secondary me-3">Generate</button>
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleReset}>Reset</button>
                                                </form>

                                                {seriesFormSubmitted && (
                                                    <div className='container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <h5 className="img-control my-4" style={{ textAlign: 'center' }}>Your generated {selectedOption} barcode is here</h5>
                                                        <h5>Click preview below</h5>
                                                        <Button color="primary" className="btn-sm" onClick={() => openSeriesPreviewPage()}>Preview</Button>
                                                    </div>
                                                )}
                                            </TabPane>

{/* ////////////////////////////////////////////////////////SERIES_2D/SERIES_2D/SERIES_2D/SERIES_2D/SERIES_2D/SERIES_2D/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                                            <TabPane tabId="2D_bar_code">
                                                <div style={{ marginTop: "30px" }}></div>
                                                <form onSubmit={handle2DSeriesSubmit}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <select className="form-control mb-3" style={{ width: "300px", margin: "0 auto" }} value={selectedOption} onChange={handleOptionChange}>
                                                            <option value="">Select the Type of Bar/QR Code</option>
                                                            <option value="qr">QR Code</option>
                                                            <option value="micro">Micro QRcode</option>
                                                        </select>
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{selectedOptionError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                                                        <input className="form-control mb-3" type="text" placeholder="Prefix..."
                                                            aria-label="Prefix" style={{ width: "93px", marginLeft: "90px" }} value={prefixText} onChange={handlePrefixChange} />
                                                        <div style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '1px' }}>{prefixTextError}</div>

                                                        <input className="form-control mb-3" type="text" placeholder="Main..."
                                                            aria-label="Main" style={{ width: "93px", marginLeft: "10px" }} value={mainText} onChange={handleMainChange} />
                                                        <div style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '1px' }}>{mainTextError}</div>

                                                        <input className="form-control mb-3" type="number" id="example-number-input" placeholder="Suffix..."
                                                            aria-label="Suffix" style={{ width: "93px", marginLeft: "10px" }} min='1' max='100' value={suffixText} onChange={handleSuffixChange} />
                                                        <div style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '1px' }}>{suffixTextError}</div>
                                                    </div>

                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "10px" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the size of bar code"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='100'
                                                            onChange={handleIncrementChangeQRScale}
                                                            value={QRCodeScale}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{QRCodeScaleError}</Row>

                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <input
                                                            className="form-control mb-3"
                                                            type="number"
                                                            id="example-number-input"
                                                            placeholder="Enter the number of bar codes"
                                                            style={{ width: "300px", margin: "0 auto" }}
                                                            min='1'
                                                            max='100'
                                                            onChange={handleIncrementChange}
                                                            value={barCodeQuantity}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: "0", marginBottom: "10px", color: "red", fontSize: "small", marginLeft: '90px' }}>{barCodeQuantityError}</Row>


                                                    <Row style={{ marginLeft: '80px', marginTop: '-20px', marginBottom: '0px' }}>
                                                        <Col xl={3} sm={6}>
                                                            <div className="mt-4 d-flex justify-content-start">
                                                                <h5 className="font-size-14 mb-1  me-3" style={{ whiteSpace: 'nowrap', margin: '1px' }}>BarCode Format</h5>
                                                                <div className="form-check mb-3 me-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="exampleRadios"
                                                                        id="exampleRadios1"
                                                                        value="svg"
                                                                        checked={formatSelectedOption === 'svg'}
                                                                        onChange={handleFormatChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"

                                                                        htmlFor="exampleRadios1"
                                                                    >
                                                                        svg
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="exampleRadios"
                                                                        id="exampleRadios2"
                                                                        value="png"
                                                                        checked={formatSelectedOption === 'png'}
                                                                        onChange={handleFormatChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="exampleRadios2"
                                                                    >
                                                                        png
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: "0", marginBottom: "30px", color: "red", fontSize: "small", marginLeft: '90px', whiteSpace: 'nowrap'}}>{formatSelectedOptionError}</Row>


                                                    <button type="submit" className="btn btn-secondary me-3">Generate</button>
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleReset}>Reset</button>
                                                </form>

                                                {seriesFormSubmitted && (
                                                    <div className='container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <h5 className="img-control my-4" style={{ textAlign: 'center' }}>Your generated {selectedOption} barcode is here</h5>
                                                        <h5>Click preview below</h5>
                                                        <Button color="primary" className="btn-sm" onClick={() => openSeriesPreviewPage()}>Preview</Button>
                                                    </div>
                                                )}
                                            </TabPane>
                                        </TabContent>
                                    </TabPane>
                                </TabContent>
                            </Col>
                        </Row>
                    </CardBody>
                </Row>
            </div>
        </React.Fragment>
    );
}


export default App;

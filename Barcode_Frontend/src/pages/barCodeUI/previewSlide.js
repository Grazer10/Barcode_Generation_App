import React, { useEffect, useState, useRef } from 'react';
import "./CSS/UIstyle.css";

function Previewslide() {
  const [imgData, setImgData] = useState(null);
  const [barCodeQuantity, setBarCodeQuantity] = useState(0);
  const [seriesImgArray, setSeriesImgArray] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  const [barCodeWidth, setBarCodeWidth] = useState(null);
  const [barCodeHeight, setBarCodeHeight] = useState(null);
  const [QRCodeScale, setQRCodeScale] = useState(null);

  const pageDiv = useRef(null);
  const imageRefs = useRef([]);
  const [imageDimensions, setImageDimensions] = useState([]);

  useEffect(() => {
    const storedImgData = JSON.parse(sessionStorage.getItem("imgData"));
    const storedBarCodeQuantity = parseInt(sessionStorage.getItem("barCodeQuantity"), 10);
    const storedSeriesImgArray = JSON.parse(sessionStorage.getItem("seriesImgArray"));
    const storedSelectedTab = JSON.parse(sessionStorage.getItem("selectedTab"));

    const storedBarCodeWidth = JSON.parse(sessionStorage.getItem("barCodeWidth"));
    const storedBarCodeHeight = JSON.parse(sessionStorage.getItem("barCodeHeight"));
    const storedQRCodeScale = JSON.parse(sessionStorage.getItem("QRCodeScale"));

    setImgData(storedImgData);
    setBarCodeQuantity(storedBarCodeQuantity);
    setSeriesImgArray(storedSeriesImgArray);
    setSelectedTab(storedSelectedTab);

    setBarCodeWidth(storedBarCodeWidth);
    setBarCodeHeight(storedBarCodeHeight);
    setQRCodeScale(storedQRCodeScale);
  }, []);

  const handlePrint = () => {
    const titleContainer = document.querySelector('.preview-title-container');
    const printButton = document.querySelector('.print-button');

    if (titleContainer) {
      titleContainer.style.display = 'none';
    }

    if (printButton) {
      printButton.style.display = 'none';
    }

    const pageContents = document.querySelectorAll('.a4-page-content');
    const originalDisplayStyles = [];

    pageContents.forEach(pageContent => {
      originalDisplayStyles.push(pageContent.style.display);
      pageContent.style.display = 'block';
    });

    window.print();

    pageContents.forEach((pageContent, index) => {
      pageContent.style.display = originalDisplayStyles[index];
    });

    if (titleContainer) {
      titleContainer.style.display = 'block';
    }

    if (printButton) {
      printButton.style.display = 'block';
    }
  };

  const handleImageLoad = (index, event) => {
    const { offsetWidth: width, offsetHeight: height } = event.target;
    setImageDimensions(prev => {
      const newDimensions = [...prev];
      newDimensions[index] = { width, height };
      return newDimensions;
    });
  };

  const renderImages = () => {
    const images = [];
    if (imgData && barCodeQuantity && typeof barCodeQuantity === 'number' && selectedTab === "clone") {
      for (let i = 0; i < barCodeQuantity; i++) {
        images.push(
          <img
            key={i}
            src={imgData}
            alt={`Preview Image ${i + 1}`}
            onLoad={event => handleImageLoad(i, event)}
            ref={el => imageRefs.current[i] = el}
          />
        );
      }
    } else if (seriesImgArray && Array.isArray(seriesImgArray) && selectedTab === "series") {
      seriesImgArray.forEach((imageUrl, index) => {
        images.push(
          <img
            key={index}
            src={imageUrl}
            alt={`Image ${index + 1}`}
            onLoad={event => handleImageLoad(index, event)}
            ref={el => imageRefs.current[index] = el}
          />
        );
      });
    }
    return images;
  };

  const renderPages = () => {
    const images = renderImages();
    const pageWidth = 794; // A4 width in pixels at 96dpi (approx)
    const pageHeight = 1122; // A4 height in pixels at 96dpi

    const padding = {
      top: 50,
      right: 30,
      bottom: 30,
      left: 30
    };

    const gapBetweenImages = 10;
    const gapBetweenRows = 10;

    const paddedPageWidth = pageWidth - padding.left - padding.right;
    const paddedPageHeight = pageHeight - padding.top - padding.bottom;

    const pages = [];
    let currentPageImages = [];
    let currentRow = [];
    let currentRowWidth = 0;
    let currentPageHeight = padding.top;

    images.forEach((image, index) => {
      const { width: imageWidth, height: imageHeight } = imageDimensions[index] || { width: 0, height: 0 };

      if (currentRowWidth + imageWidth + (currentRow.length > 0 ? gapBetweenImages : 0) > paddedPageWidth) {
        currentPageImages.push(
          <div key={currentPageImages.length} style={{ display: 'flex', marginBottom: `${gapBetweenRows}px` }}>
            {currentRow.map((img, i) => (
              <div key={i} style={{ marginRight: `${gapBetweenImages}px` }}>
                {img}
              </div>
            ))}
          </div>
        );
        currentPageHeight += imageHeight + gapBetweenRows;
        currentRow = [];
        currentRowWidth = 0;
      }

      if (currentPageHeight + imageHeight + padding.top + padding.bottom > paddedPageHeight) {
        pages.push(
          <div key={pages.length} className='page-content page-contents a4-page' style={{ width: pageWidth, height: pageHeight, breakAfter: 'page', display: 'flex', flexDirection: 'column', margin: '1px auto', padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`, boxSizing: 'border-box', border: '1px solid black' }}>
            {currentPageImages}
          </div>
        );
        currentPageImages = [];
        currentPageHeight = padding.top;
      }

      currentRow.push(
        <div key={index} style={{ marginBottom: `${gapBetweenImages}px` }}>
          {image}
        </div>
      );
      currentRowWidth += imageWidth + (currentRow.length > 1 ? gapBetweenImages : 0);
    });

    if (currentRow.length > 0) {
      currentPageImages.push(
        <div key={currentPageImages.length} style={{ display: 'flex', marginBottom: `${gapBetweenRows}px` }}>
          {currentRow.map((img, i) => (
            <div key={i} style={{ marginRight: `${gapBetweenImages}px` }}>
              {img}
            </div>
          ))}
        </div>
      );
    }

    if (currentPageImages.length > 0) {
      pages.push(
        <div key={pages.length} className='page-content page-contents a4-page' style={{ width: pageWidth, height: pageHeight, breakAfter: 'page', display: 'flex', flexDirection: 'column', margin: '1px auto', padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`, boxSizing: 'border-box', border: '1px solid black' }}>
          {currentPageImages}
          <div className="print-button-container">
            <button className="print-button" onClick={handlePrint}>Print</button>
          </div>
        </div>
      );
    }

    return pages;
  };

  return (
    <div className="a4-page-container">
      <div className="a4-page-content">
        <div className="preview-title-container">
          <h1 className="preview-title" style={{ marginTop: "100px", marginBottom: "20px", textAlign: 'center', color: 'teal', fontFamily: 'Georgia, Times, serif', fontSize: '2.2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', textDecoration: 'underline' }}>Preview Slide</h1>
        </div>
        {renderPages()}
      </div>
    </div>
  );
}

export default Previewslide;

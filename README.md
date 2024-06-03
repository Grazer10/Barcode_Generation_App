## Barcode_Generation_App
## Overview
This project aims to develop a web application for generating various types of barcodes, utilizing Python for backend processing and React for the frontend interface. The application supports the generation of both 1D and 2D barcodes, offering flexibility in barcode formats, sizes, and quantities. Users can print or save the generated barcodes as a PDF.

## Features
- **1D Barcode Generation**: Supports Code128, Code39, GS1-128, EAN13, ISBN-13, UPC-A, ISSN, and PZN-7.
- **2D Barcode Generation**: Supports QR codes and Micro QR codes.
- **Barcode Size Adjustment**: Adjust the size of the generated barcodes.
- **Barcode Format Options**: Choose the format of the barcode (SVG, PNG).
- **Multiple Quantities**: Specify the quantity of barcodes to generate for batch creation.
- **Series Generation**: Generate a series of barcodes with sequential data using three text input boxes (Prefix, Main, Suffix) where the Suffix can auto-increment.
- **Clone Functionality**: Clone the same barcode for the required quantity using a single input box for the text.
- **Output Options**: Print the barcodes or save them as a PDF file.

## Technology Stack
- **Backend**: Python
  - **Libraries**:
    - `python-barcode`: For generating 1D barcodes.
    - `segno`: For generating 2D barcodes (QR codes and Micro QR codes).
- **Frontend**: React

## Workflow
1. **User Input**: Provide barcode data and select the type, quantity, size, and format of the barcodes.
2. **Backend Processing**: The Python backend processes the input using the appropriate library to generate the barcode(s).
3. **Frontend Display**: The generated barcodes are displayed on the frontend for preview.
4. **Output**: Print the barcodes or save them as a PDF.

## Use Cases
- **Retail**: Generate product barcodes for inventory management.
- **Libraries**: Create ISBN barcodes for books.
- **Event Management**: Produce QR codes for event tickets.
- **Pharmaceuticals**: Generate PZN-7 barcodes for drug packaging.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

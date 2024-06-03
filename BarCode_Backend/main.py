import os
from flask import Flask, json, request, jsonify
from flask_cors import CORS
import database as dbs
from generating import generate_barcode, generate_qrcode

app = Flask(__name__)
cors = CORS(app)


@app.route("/get_clone_info", methods=["GET", "POST"])
def get_clone_info():
    global path
    request_data = json.loads(request.data)
    print("formdata", request_data)
    selectedType = request_data["selectedOption"]
    barText = request_data["typedText"]
    barCodeQuantity = request_data["barCodeQuantity"]
    module_width = request_data["barCodeWidth"]
    module_height = request_data["barCodeHeight"]
    scale = request_data["QRCodeScale"]
    selectedFormat = request_data['formatSelectedOption']
    verticalActiveTab = request_data["verticalActiveTab"]
    horizontalActiveTab = request_data["horizontalActiveTab"]
    dataLabel = request_data["dataLabel"]
    imagesets = "imagesets"
    print(barCodeQuantity, module_width, module_height,scale,selectedFormat, dataLabel,
          "barCodeQuantity", "module_width", "module_height", "QRCodeScale","selectedFormat", "dataLabel")

    dbs.clone_bar_data.insert_one({"bar_type": selectedType, "bar_text": barText, "bar_width": module_width,
                             "bar_height": module_height, "qr_size": scale,  "bar_quantity": barCodeQuantity,
                             "dataLabel": dataLabel, "Download_Format": selectedFormat})

    path = f"{imagesets}/{verticalActiveTab}/{horizontalActiveTab}/{selectedType}/{selectedFormat}"
    print("data32 ", path, selectedType)
    if not os.path.exists(path):
        os.makedirs(path)


    # barcodes
    if selectedType in ["Code128", "code39", "Gs1_128", "EAN13", "isbn13", "upca", "issn", "pzn"]:

        final_path = generate_barcode(barText, selectedType, module_width, module_height, path, selectedFormat, dataLabel)

        print("BarCode generated", final_path)
        return jsonify(final_path)


    # QRcode and micro_qrcode
    elif selectedType in ["qr", "micro"]:

        qr_final_path = generate_qrcode(barText, selectedType, scale, path, selectedFormat)

        print("QR generated", qr_final_path)
        return jsonify(qr_final_path)


######################################################################################################################


@app.route("/get_series_info", methods=["GET", "POST"])
def get_series_info():
    global path
    request_data = json.loads(request.data)
    print("formdata", request_data)
    selectedType = request_data["selectedOption"]
    # barText = request_data["typedText"]

    prefixText = request_data["prefixText"]
    mainText = request_data["mainText"]
    suffixText = request_data["suffixText"]
    barText = (prefixText + mainText + str(suffixText))

    barCodeQuantity = request_data["barCodeQuantity"]
    module_width = request_data["barCodeWidth"]
    module_height = request_data["barCodeHeight"]
    scale = request_data["QRCodeScale"]
    selectedFormat = request_data['formatSelectedOption']
    verticalActiveTab = request_data["verticalActiveTab"]
    horizontalActiveTab = request_data["horizontalActiveTab"]
    dataLabel = request_data["dataLabel"]
    imagesets = "imagesets"
    print(barText, barCodeQuantity, module_width, module_height, scale, selectedFormat, dataLabel,"barText",
          "barCodeQuantity", "module_width", "module_height", "QRCodeScale", "selectedFormat", "dataLabel")

    dbs.series_bar_data.insert_one({"bar_type": selectedType, "bar_text": barText, "bar_width": module_width,
                             "bar_height": module_height, "qr_size": scale, "bar_quantity": barCodeQuantity,
                             "dataLabel": dataLabel, "Download_Format": selectedFormat})

    path = f"{imagesets}/{verticalActiveTab}/{horizontalActiveTab}/{selectedType}/{selectedFormat}"
    print("data32 ", path, selectedType)
    if not os.path.exists(path):
        os.makedirs(path)

    upper_limit = int(suffixText) + int(barCodeQuantity)
    series_paths = []

    for i in range(int(suffixText), upper_limit):
        suffixText = i
        # print(suffixText, "suffixText")
        barText = prefixText + mainText + str(suffixText)

        # barcodes
        if selectedType in ["Code128", "code39", "Gs1_128", "EAN13", "isbn13", "upca", "issn", "pzn"]:
            final_path = generate_barcode(barText, selectedType, module_width, module_height, path, selectedFormat, dataLabel)
            print("BarCode generated", final_path)
            series_paths.append(final_path)

        # QRcode and micro_qrcode
        elif selectedType in ["qr", "micro"]:
            qr_final_path = generate_qrcode(barText, selectedType, scale, path, selectedFormat)
            print("QR generated", qr_final_path)
            series_paths.append(qr_final_path)

    print("array",series_paths)
    return jsonify(series_paths)





if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5003, ssl_context=('localhost.pem', 'localhost-key.pem'))

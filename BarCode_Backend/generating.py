import barcode
import uuid
import segno
from barcode.writer import ImageWriter, SVGWriter


def generate_barcode(barText, selectedType, module_width, module_height, path, selectedFormat, dataLabel):
    # print("Data generate_barcode function", barText, selectedType, module_width, module_height, path, dataLabel)
    # Generate the barcode
    barcode_class = barcode.get_barcode_class(selectedType)

    if selectedFormat == "png":
        writer_format = ImageWriter()
    elif selectedFormat == "svg":
        writer_format = SVGWriter()


    barcode_instance = barcode_class(barText, writer=writer_format)

    # Set the width and height directly
    barcode_instance.default_writer_options['module_width'] = module_width
    barcode_instance.default_writer_options['module_height'] = module_height

    uniqueid = uuid.uuid4()
    final_path = (f"{path}/{str(uniqueid)}")
    barcode_instance.save(final_path,  options={'write_text': dataLabel})

    return final_path



def generate_qrcode(barText, selectedType, scale, path, selectedFormat):
    print('data22 ', selectedFormat, scale)
    if selectedType == "qr":
        print("if statement for qr works")
        micro = False
    elif selectedType == "micro":
        print("else statement for qr works")
        micro = True

    qrcode = segno.make(barText, micro)

    uniqueid = uuid.uuid4()
    qr_final_path = (f"{path}/{str(uniqueid)}")
    qrcode.save(f"{qr_final_path}.{selectedFormat}", scale=scale)

    return qr_final_path



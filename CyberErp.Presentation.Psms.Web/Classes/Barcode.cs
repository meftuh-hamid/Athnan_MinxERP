
using BarcodeLib;
using IronBarCode;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Web;


namespace Presentation.Psms.Web.Classes
{
    public class Barcode
    {
        public void GenerateBarcode(string data,string file)
        {
            BarcodeLib.Barcode barcode = new BarcodeLib.Barcode();
            Color foreColor = Color.Black;
            Color backColor = Color.Transparent;
            barcode.RawData = data;
            barcode.IncludeLabel = true;
            //  barcode.LabelPosition = LabelPositions.TOPCENTER;
            Image barcodeImage = barcode.Encode(TYPE.CODE128, data);
            barcodeImage.Save(@file, ImageFormat.Png);
        }
        public void GenerateQRCode(string data, string file)
        {
            QRCodeWriter.CreateQrCode(data, 30, QRCodeWriter.QrErrorCorrectionLevel.Medium).SaveAsPng(file);
        }

    }
}
// Qr code generator

function generate() {
    var qr = qrcode(0, 'L');
    qr.addData(document.getElementById('qrtext').value);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag(4);
}
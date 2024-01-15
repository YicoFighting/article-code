function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
/**
 * 适用于jpeg、webp
 */
var CompressImage = /** @class */ (function () {
    function CompressImage(options) {
        this.fileReader = new FileReader();
        this.options = options;
        this.createBase64();
    }
    CompressImage.prototype.createBase64 = function () {
        var _this = this;
        this.fileReader.readAsDataURL(this.options.file);
        this.fileReader.onload = function (e) {
            _this.compress(e.target.result);
        };
    };
    CompressImage.prototype.compress = function (base64) {
        var _this = this;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.src = base64;
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dta = ctx.getImageData(0, 0, img.width, img.height).data;
            var png = UPNG.encode([dta.buffer], img.width, img.height, _this.options.cnum);
            var newBase64 = "data:image/png;base64," + arrayBufferToBase64(png);
            _this.options.success(newBase64);
        };
    };
    return CompressImage;
}());
var file = document.querySelector("#file");
file.addEventListener("change", function (e) {
    var target = e.target;
    var fileObject = target.files[0];
    if (fileObject) {
        new CompressImage({
            file: fileObject,
            cnum: 256, // 将其设置为零以进行无损压缩，或写入图像中允许的颜色数。较小的值生成较小的文件。0表示无损，256表示有损。
            success: function (base64) {
                document.body.innerHTML = "<img src='".concat(base64, "' />");
            },
        });
    }
});

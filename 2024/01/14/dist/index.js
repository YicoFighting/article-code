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
            var newBase64 = canvas.toDataURL(_this.options.file.type, _this.options.quality);
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
            quality: 0.6,
            success: function (base64) {
                document.body.innerHTML = "<img src='".concat(base64, "' />");
            },
        });
    }
});

declare var UPNG: {
  encode: (
    imgs: ArrayBuffer[],
    w: number,
    h: number,
    cnum: number,
    dels?: number[]
  ) => ArrayBuffer;
};

interface Options {
  file: File;
  cnum?: number;
  success?: (base64: string) => void;
}

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
class CompressImage {
  options: Options;
  fileReader = new FileReader();
  constructor(options: Options) {
    this.options = options;
    this.createBase64();
  }

  createBase64() {
    this.fileReader.readAsDataURL(this.options.file);
    this.fileReader.onload = (e) => {
      this.compress(e.target.result as string);
    };
  }

  compress(base64: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const dta = ctx.getImageData(0, 0, img.width, img.height).data;
      const png = UPNG.encode(
        [dta.buffer],
        img.width,
        img.height,
        this.options.cnum
      );
      const newBase64 = "data:image/png;base64," + arrayBufferToBase64(png);
      this.options.success(newBase64);
    };
  }
}

const file = document.querySelector("#file") as HTMLInputElement;

file.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  const fileObject = target.files[0];
  if (fileObject) {
    new CompressImage({
      file: fileObject,
      cnum: 256, // 将其设置为零以进行无损压缩，或写入图像中允许的颜色数。较小的值生成较小的文件。0表示无损，256表示有损。
      success: (base64) => {
        document.body.innerHTML = `<img src='${base64}' />`;
      },
    });
  }
});

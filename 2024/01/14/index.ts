interface Options {
  file: File;
  quality?: number;
  success?: (base64: string) => void;
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
      const newBase64 = canvas.toDataURL(
        this.options.file.type,
        this.options.quality
      );
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
      quality: 0.6,
      success: (base64) => {
        document.body.innerHTML = `<img src='${base64}' />`;
      },
    });
  }
});

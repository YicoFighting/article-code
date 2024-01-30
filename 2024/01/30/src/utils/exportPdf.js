import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// A4的宽度与高度
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

// 将元素转化为canvas元素
const toCanvas = async (ele, width) => {
  const canvas = await html2canvas(ele, {
    allowTaint: true,
    scale: devicePixelRatio * 2,
    useCORS: true,
  });
  // 获取canavs转化后的宽度
  const canvasWidth = canvas.width;
  // 获取canvas转化后的高度
  const canvasHeight = canvas.height;
  // 高度转化为PDF的高度
  // width / height = canvasWidth / canvasHeight
  const height = (canvasHeight * width) / canvasWidth;
  // 转化成图片Data
  const data = canvas.toDataURL("image/jpeg", 1.0);

  return { width, height, data };
};

// 添加图片
const addImage = (_x, _y, pdf, data, width, height) => {
  pdf.addImage(data, "JPEG", _x, _y, width, height);
};

// 增加空白遮挡
const addBlank = (x, y, width, height, pdf) => {
  pdf.setFillColor(255, 255, 255);
  pdf.rect(x, y, Math.ceil(width), Math.ceil(height), "F");
};

const exportPdf = async ({ filename = "测试A4分页.pdf" }) => {
  // 内容
  const element = document.getElementById("content");
  // 内容长度
  const contentWidth = 550;

  // jsPDFs实例
  const pdf = new jsPDF({
    unit: "pt",
    format: "a4",
    orientation: "p",
  });

  // 一页的高度， 转换宽度为一页元素的宽度
  const { width, height, data } = await toCanvas(element, contentWidth);

  // 距离PDF左边的距离，/ 2 表示居中
  const baseX = (A4_WIDTH - contentWidth) / 2; // 预留空间给左边
  // 距离PDF 页眉和页脚的间距， 留白留空
  const baseY = 15;

  //每页内容的宽度与高度
  const originalPageWidth = contentWidth;
  const originalPageHeight = A4_HEIGHT - 2 * baseY;

  // 默认的偏移量
  let position = baseY;
  let imageHeight = height;

  if (height < originalPageHeight) {
    addImage(baseX, baseY, pdf, data, width, height);
  } else {
    while (imageHeight > 0) {
      addImage(baseX, position, pdf, data, width, height);
      addBlank(baseX, 0, originalPageWidth, baseY, pdf);
      addBlank(
        baseX,
        baseY + originalPageHeight,
        originalPageWidth,
        baseY,
        pdf
      );

      imageHeight = imageHeight - originalPageHeight;
      position = position - originalPageHeight;

      // 避免添加空白页
      if (imageHeight > 0) {
        pdf.addPage();
      }
    }
  }

  pdf.save(filename);
};

export { exportPdf };

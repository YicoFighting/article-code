const puppeteer = require("puppeteer"); // 引入 Puppeteer 模块
const lighthouse = require("lighthouse"); // 引入 Lighthouse 模块
const { URL } = require("url"); // 引入 URL 模块，用于处理 URL
const fs = require("fs"); // 引入 fs (File System) 模块，用于操作文件
const path = require("path"); // 引入 path 模块，用于处理文件和目录的路径

const Run = async (url, reportOutputPath) => {
  let browser;
  try {
    // 试图启动一个新的浏览器实例
    browser = await puppeteer.launch({
      headless: false, // false 代表此浏览器非无头浏览器，将会显示 GUI
      defaultViewport: null, // 使用默认视口
    });
  } catch (error) {
    // 如果因某些原因启动浏览器失败，将错误信息输出至控制台，并停止程序
    console.log("浏览器启动失败:\n", error);
    return;
  }

  const port = new URL(browser.wsEndpoint()).port; // 获取开放的端口

  let report;
  try {
    // 使用 Lighthouse 进行性能评估
    report = await lighthouse(url, {
      port, // lighthouse 连接到 Puppeteer 中打开的浏览器实例
      output: "html", // 评估结果的输出格式为 HTML
      // 设置性能评估的参数
      formFactor: "desktop", // 设定性能评估的设备形态，此处为桌面版
      throttling: {
        rttMs: 40, // 设定网络往返时间 (RTT，Round Trip Time)，单位毫秒，这里设置为40
        throughputKbps: 10 * 1024, // 设定总吞吐量，单位 Kbps，此处设置为 10*1024 Kbps
        cpuSlowdownMultiplier: 1, // CPU 慢速倍数，设定为 1 表示不进行 CPU 延迟
        requestLatencyMs: 0, // 设定请求延迟，单位毫秒，此处为 0
        downloadThroughputKbps: 0, // 设定下载吞吐量，单位Kbps，此处为 0
        uploadThroughputKbps: 0, // 设定上传吞吐量，单位Kbps，此处为 0
      },
      screenEmulation: {
        mobile: false, // 设置是否模拟移动设备，此处为否
        width: 1350, // 设置浏览器窗口宽度，此处为1350
        height: 940, // 设置浏览器窗口高度，此处为940
        deviceScaleFactor: 1, // 设备缩放因子，此处为1
        disabled: false, // 设置是否禁用屏幕模拟，此处为否
      },
      emulatedUserAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      // 模拟的用户代理字符串，此处模拟的是一个具体的 Chrome 浏览器版本在 MacOS环境下的用户代理
    });
  } catch (error) {
    // 如果性能测试失败，将错误信息输出至控制台，并关闭浏览器实例
    console.log("性能测试失败:\n", error);
    await browser.close();
    return;
  }

  // 检查文件路径是否存在；如果不存在，则创建文件路径
  const outputFileDir = path.dirname(reportOutputPath); // 获取文件输出路径的目录
  if (!fs.existsSync(outputFileDir)) {
    fs.mkdirSync(outputFileDir, { recursive: true }); // 如果目录不存在，创建目录
  }

  try {
    // 尝试将报告写入至文件中
    fs.writeFileSync(reportOutputPath, report.report);
  } catch (error) {
    // 如果写入文件失败，将错误信息输出至控制台
    console.log("写入文件失败:\n", error);
  }

  // 在控制台输出 Lighthouse 的评分
  console.log(
    `Lighthouse 分数: ${report.lhr.categories.performance.score * 100}`
  );

  await browser.close(); // 完成测试后，关闭浏览器实例
};

// 调用 Run 函数，传入你的 URL 及报告的输出路径
Run("https://juejin.cn/post/xxxx", "性能报告.html");

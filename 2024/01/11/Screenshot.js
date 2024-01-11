const puppeteer = require("puppeteer");

(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: "new",
  });

  // 打开新页面
  const page = await browser.newPage();

  // 设置视窗大小，可能需要根据页面内容调整
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  // 导航到目标网页
  await page.goto("https://juejin.cn/post/xxxx", {
    waitUntil: "networkidle0", // 确保页面加载完毕，页面上所有网络连接都处于空闲状态至少500ms
  });

  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      // 设置一个标识，用于标识页面是否滚动到底部
      var totalHeight = 0;
      var distance = 100; // 每次向下滚动的距离
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  // 隐藏页面中的特定元素，例如元素的选择器是 .element-to-hide
  await page.evaluate(() => {
    let elements = document.querySelectorAll(".article-suspended-panel");
    elements.forEach((element) => {
      element.style.display = "none";
    });
  });

  await page.evaluate(() => {
    let elements = document.querySelectorAll(".sidebar");
    elements.forEach((element) => {
      element.style.display = "none";
    });
  });

  await page.evaluate(() => {
    let elements = document.querySelectorAll(".column-container");
    elements.forEach((element) => {
      element.style.display = "none";
    });
  });

  await page.evaluate(() => {
    let elements = document.querySelectorAll(".jj-comment-list-container");
    elements.forEach((element) => {
      element.style.display = "none";
    });
  });

  await page.evaluate(() => {
    let elements = document.querySelectorAll(".recommended-area");
    elements.forEach((element) => {
      element.style.display = "none";
    });
  });

  await page.evaluate(() => {
    let elements = document.querySelectorAll(".bottom-login-guide");
    elements.forEach((element) => {
      element.style.display = "none";
    });
  });

  // 或者使用注入 CSS 的方式来隐藏元素
  // await page.addStyleTag({content: '.element-to-hide { display: none; }'});

  // 截取全页面
  await page.screenshot({
    path: "fullpage_screenshot.png",
    fullPage: true, // 设置为true进行全页面截图
  });

  // 关闭浏览器
  await browser.close();
})();

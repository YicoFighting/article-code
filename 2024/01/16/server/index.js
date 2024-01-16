const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const axios = require("axios");

const app = new Koa();
const router = new Router();

// 跨域
app.use(cors());
// 解析参数
app.use(bodyParser());

// 全局错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      code: "-1",
      msg: err.message,
    };
  }
});

router.get("/", (ctx, next) => {
  ctx.body = {
    code: 0,
    msg: "Hello Koa",
  };
});

router.get("/error", async (ctx, next) => {
  // 抛出一个错误
  throw new Error("Something went wrong");
});

router.get("/auth", async (ctx, next) => {
  const { code } = ctx.request.query;
  try {
    const result = await axios({
      method: "post",
      url: "https://github.com/login/oauth/access_token",
      headers: {
        accept: "application/json",
      },
      data: {
        client_id: "CLIENT_ID",
        client_secret: "CLIENT_SECRET",
        code,
      },
    });
    ctx.body = result.data;
  } catch (error) {
    throw new Error(error);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app.callback();

// app.listen(3000, () => {
//   console.log("服务正在运行：http://localhost:3000");
// });

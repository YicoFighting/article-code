const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const WebSocket = require("ws");
const http = require("http");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const router = new Router();

const sockets = {}; // 将 sockets 对象设置为全局变量

app.use(cors({ origin: "*" }));
app.use(bodyParser()); // 使用 koa-bodyparser 中间件

router.get("/redirect", async (ctx, next) => {
  const { redirect_url } = ctx.request.query;
  ctx.status = 301;
  ctx.set("Location", "http://localhost:5173" + redirect_url); // 设置重定向的目标 URL
});

router.post("/auth", (ctx, next) => {
  const { userId } = ctx.request.body;
  sockets[userId].send("认证成功");
  ctx.body = {
    code: 0,
    msg: "认证成功",
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

// 创建一个原生的HTTP服务器来处理Koa应用和WebSocket
const server = http.createServer(app.callback());

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, request) => {
  let userId = new URL(request.url, "ws://localhost:3000").searchParams.get(
    "userId"
  );
  sockets[userId] = ws;

  ws.send("连接成功");

  ws.on("message", (message) => {
    console.log("received: %s", message);
  });
});

// 监听3000端口
server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});

import OpenAI from "openai";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import { PassThrough } from "stream";
import bodyParser from "koa-bodyparser";

const app = new Koa();
const router = new Router();

const openai = new OpenAI({
  apiKey: "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", // gpt-3
});

app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "DELETE", "PUT"],
    headers: [
      "Cache-Control",
      "Content-Type",
      "X-Requested-With",
      "EventSource",
    ],
    credentials: true,
  })
);

// 使用 bodyParser 中间件
app.use(bodyParser());

const receive = async (stream, messages) => {
  const AI = await openai.beta.chat.completions.stream({
    model: "gpt-3.5-turbo",
    messages,
    stream: true,
  });

  AI.on("content", (delta, snapshot) => {
    stream.write(delta);
  });

  AI.finalChatCompletion().then(() => {
    stream.end();
  });
};

router.post("/chat", (ctx) => {
  const { messages } = ctx.request.body;

  ctx.set({
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
  });

  const stream = new PassThrough();
  ctx.body = stream;
  ctx.status = 200;

  receive(stream, messages);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

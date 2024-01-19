<script setup>
import { nextTick, onMounted, ref } from "vue";
import { Position } from "@element-plus/icons-vue";
import MarkdownIt from "markdown-it";
import markdownItSanitizer from "markdown-it-sanitizer";
import axios from "axios";
import hljs from "highlight.js";
import markdownItHighlightjs from "markdown-it-highlightjs";

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true })
          .value;
      } catch (__) {}
    }
    return ""; // 使用外部的默认转义
  },
})
  .use(markdownItSanitizer)
  .use(markdownItHighlightjs);

const textarea = ref("");

const messages = ref([
  {
    role: "system",
    content: "有什么可以帮你的吗？",
  },
]);

const scrollToBottom = async () => {
  const el = document.querySelector(".content");
  if (el) {
    await nextTick();
    el.scrollTop = el.scrollHeight;
  }
};

const sendNetworkRequest = async () => {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages.value,
    }),
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  const arrayLength = messages.value.length;
  messages.value[arrayLength] = {
    role: "system",
    content: "",
  };

  while (true) {
    // 取值, value 是后端返回流信息, done 表示后端结束流的输出
    const { value, done } = await reader.read();
    if (done) break;
    messages.value[arrayLength].content += decoder.decode(value);
    scrollToBottom();
  }
};

const sendMsg = () => {
  messages.value.push({
    role: "user",
    content: textarea.value,
  });
  textarea.value = "";
  scrollToBottom();
  sendNetworkRequest();
};

// 创建一个新的 MutationObserver 对象
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // 检查是否有新的节点被添加
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach(function (node) {
        // 检查新的节点是否是一个 <pre> 元素
        if (node.nodeName.toLowerCase() === "pre") {
          // 检查 <pre> 元素下是否存在 <code> 元素
          const codeNode = node.querySelector("code");
          if (codeNode) {
            // 创建一个 "复制" 按钮
            const button = document.createElement("button");
            button.classList.add("copy-code-button");
            button.textContent = "copy";

            // 当按钮被点击时，复制 <code> 元素的文本
            button.addEventListener("click", function () {
              navigator.clipboard.writeText(codeNode.textContent);
            });

            // 将按钮添加到 <pre> 元素中
            node.appendChild(button);
          }
        }
      });
    }
  });
});

// 开始监听 DOM 的变化
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

const handleKeyDown = (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    sendMsg();
  }
};

onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<template>
  <div class="chat">
    <div class="content">
      <div
        class="message"
        :class="message.role"
        v-for="(message, index) in messages"
        :key="index"
      >
        <div class="avatar">
          <img src="@/assets/system.svg" alt="" />
        </div>
        <div class="line" v-html="md.render(message.content)"></div>
      </div>
    </div>
    <div class="input">
      <el-input
        v-model="textarea"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 10 }"
        placeholder="Ctrl + Enter 发送"
        @keydown="handleKeyDown"
      />
      <el-button :icon="Position" type="primary" plain @click="sendMsg">
        发送
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.chat {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #ccc;
  display: flex;
  flex-direction: column;
}
.content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
.input {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  border-top: 1px solid #dedede;
  background-color: #fff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 20px;
}
:deep(.input textarea) {
  padding: 10px 90px 10px 14px;
  resize: none;
}
:deep(.input .el-button) {
  position: absolute;
  right: 30px;
  bottom: 30px;
}
.message {
  display: flex;
  flex-direction: column;
}
.system {
  align-items: flex-start;
}
.user {
  align-items: flex-end;
}
.avatar {
  width: 20px;
  padding: 5px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.avatar img {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

.system .avatar {
  background-color: #e7f8ff;
}

.line {
  box-sizing: border-box;
  max-width: 70%;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  -webkit-user-select: text;
  -moz-user-select: text;
  user-select: text;
  word-break: break-word;
  border: 1px solid #dedede;
  position: relative;
  transition: all 0.3s ease;
}

.system .line {
  background-color: rgba(0, 0, 0, 0.05);
}

.user .line {
  background-color: #e7f8ff;
}
</style>

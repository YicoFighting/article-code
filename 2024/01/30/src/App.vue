<template>
  <div class="content" id="content">
    <div id="capture">
      习近平总书记深刻指出，舆论导向正确，就能凝聚人心、汇聚力量，推动事业发展；舆论导向错误，就会动摇人心、瓦解斗志，危害党和人民事业。当今世界信息技术日新月异，数字化、网络化、智能化深入发展。掌握信息化条件下舆论主导权、广泛凝聚社会共识，是巩固壮大主流思想文化的必然要求。新形势下，我们要深入学习贯彻习近平文化思想，肩负起做好舆论工作、营造良好舆论环境的职责使命，为推动改革发展各项工作、增进全国各族人民团结、维护社会和谐稳定作出新的更大贡献。
    </div>
    <div class="images">
      <el-image v-for="url in urls" :key="url" :src="url" />
    </div>
    <div class="tables">
      <el-table :data="tableData" border>
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="address" label="地址" />
      </el-table>
    </div>
  </div>

  <el-button type="primary" @click="print">打印</el-button>
</template>

<script setup>
import { exportPdf } from "./utils/exportPdf";
const urls = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
];

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
const print = () => {
  exportPdf({ filename: "测试导出.pdf" });
};
</script>

<style scoped>
.content {
  width: 100%;
  overflow: hidden;
}
#capture {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
}
.images {
  width: 50%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
:deep(.images img) {
  margin: 10px 0;
}
.tables {
  width: 50%;
  margin: 0 auto;
}
</style>

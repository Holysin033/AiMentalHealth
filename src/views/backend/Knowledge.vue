<template>
  <div>
    <page-head>
      <template #buttons>
        <el-button type="success">新增</el-button>
        <el-button type="primary">编辑</el-button>
      </template>
    </page-head>
    <table-search :form-item="formItem" @search="handleSearch" />
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; margin-top: 25px"
      highlight-current-row
      border
      show-overflow-tooltip
    >
      <el-table-column
        type="selection"
        label="选择文章"
        width="50"
        fixed
        align="center"
      />
      <el-table-column
        type="index"
        label="序号"
        width="55"
        fixed
        align="center"
      />
      <el-table-column label="文章标题" width="200" fixed align="center">
        <!-- <template #default="scope"> -->
        <!-- 这里我直接解构到底了 原来scope.row.title -->
        <template #default="{ row: { title } }">
          <div style="display: flex; align-items: center">
            <el-icon>
              <ep-timer></ep-timer>
            </el-icon>
            <span>&emsp;{{ title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="150" fixed align="center">
        <template #default="{ row: { categoryId } }">
          <div style="display: flex; align-items: center">
            <el-icon color="red">
              <ep-flag></ep-flag>
            </el-icon>
            <span>&emsp;{{ cateMap[categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="authorName"
        label="作者"
        width="150"
        align="center"
      />
      <el-table-column
        prop="readCount"
        label="阅读量"
        width="75"
        align="center"
      />
      <el-table-column
        prop="publishedAt"
        label="发布时间"
        width="200"
        align="center"
      />
      <el-table-column
        prop="statusText"
        label="状态"
        width="150"
        align="center"
      />

      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="scope">
          <el-button-group direction="horizontal" size="small">
            <el-button type="primary" text>编辑</el-button>
            <el-button
              type="success"
              text
              v-if="scope.row.status === 0 || scope.row.status === 2"
              >发布</el-button
            >
            <el-button type="warning" text v-if="scope.row.status === 1"
              >下线</el-button
            >
            <el-button type="danger" text>删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; display: flex; justify-content: flex-end"
      :page-sizes="[1, 5, 10, 20, 30, 50, 100]"
      :page-size="pagination.size"
      :total="pagination.total"
      :pager-count="7"
      :current-page="pagination.currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup name="Knowledge">
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { ref, onMounted, reactive } from "vue";
import { getKnowledgeCate, getKnowledgeArticleList } from "@/api/admin";

const formItem = ref([
  {
    comp: "input",
    prop: "title",
    label: "文章标题",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    prop: "categoryId",
    label: "分类",
    placeholder: "请选择分类",
    options: [],
  },
  {
    comp: "select",
    prop: "status",
    label: "状态",
    placeholder: "请选择状态",
    options: [
      { label: "草稿", value: "0" },
      { label: "已发布", value: "1" },
      { label: "已下线", value: "2" },
    ],
  },
]);

const cateMap = reactive({}); // 文章分类映射
const cateList = ref([]); // 文章分类列表
// 请求文章分类
const requestCate = async () => {
  const res = await getKnowledgeCate();
  cateList.value = res.map((item) => {
    cateMap[item.id] = item.categoryName;
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  formItem.value[1].options = cateList.value;
};

//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});
// 文章列表
const tableData = ref([]);

// 请求文章列表
const requestList = async (formData) => {
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total: totalNum } = await getKnowledgeArticleList(params);
  tableData.value = records;
  pagination.total = totalNum;
  console.log(records);
};
// 搜索文章
const handleSearch = (formData) => {
  // console.log(formData);
  requestList(formData);
};
// 分页大小改变
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pagination.size = val;
  handleSearch();
};
// 分页当前页改变
const handleCurrentChange = (page) => {
  console.log(`current page: ${page}`);
  pagination.currentPage = page;
  handleSearch();
};
//生命周期：挂载完成后请求文章分类、文章列表
onMounted(() => {
  requestCate();
  handleSearch();
});
</script>

<style lang="scss" scoped></style>

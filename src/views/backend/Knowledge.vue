<template>
  <div>
    <page-head>
      <template #buttons>
        <el-button type="success" @click="handleEdit">新增</el-button>
      </template>
    </page-head>
    <table-search :form-item="formItem" @search="handleSearch" />
    <el-table :data="tableData" stripe style="width: 100%; margin-top: 25px; cursor: pointer" highlight-current-row
      border show-overflow-tooltip>
      <!-- <el-table-column type="selection" label="选择文章" width="50" fixed align="center" /> -->
      <el-table-column type="index" label="序号" width="55" fixed align="center" />
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
      <el-table-column prop="authorName" label="作者" width="150" align="center" />
      <el-table-column prop="readCount" label="阅读量" width="75" align="center" />
      <el-table-column prop="updatedAt" label="更新时间" width="200" align="center" />
      <el-table-column prop="createdAt" label="创建时间" width="200" align="center" />
      <el-table-column prop="statusText" label="状态" width="150" align="center" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="{ row }">
          <el-button-group direction="horizontal" size="small">
            <el-button type="primary" text @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" text v-if="row.status === 0 || row.status === 2"
              @click="handlePublish(row)">发布</el-button>
            <el-button type="warning" text v-if="row.status === 1" @click="handleOffline(row)">下线</el-button>
            <el-button type="danger" text @click="handleDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 20px; display: flex; justify-content: flex-end"
      :page-sizes="[1, 5, 10, 20, 30, 50, 100]" :page-size="pagination.size" :total="pagination.total" :pager-count="7"
      :current-page="pagination.currentPage" layout="total, sizes, prev, pager, next, jumper" background
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <article-dialog :cateList="cateList" @success="handleSuccess" :article="currentArticle" />
  </div>
</template>

<script setup name="Knowledge">
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import ArticleDialog from "@/components/ArticleDialog.vue";
import { ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getKnowledgeCate,
  getKnowledgeArticleList,
  getArticleDetail,
  updateArticleStatus,
  deleteArticle,
} from "@/api/admin";
import { useAdminStore } from "@/store/admin.js";

const adminStore = useAdminStore();
const { openArticleDialog } = adminStore;

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

const tableData = ref([]); // 文章列表
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
  console.log(cateList.value);

  formItem.value[1].options = cateList.value;
};

//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

// 请求文章列表
const requestList = async (formData = {}) => {
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total: totalNum } = await getKnowledgeArticleList(params);
  tableData.value = records;
  pagination.total = totalNum;
  // console.log(records);
};
// 搜索文章
const handleSearch = (formData) => {
  requestList(formData);
};
// 分页大小改变
const handleSizeChange = (val) => {
  // console.log(`${val} items per page`);
  pagination.size = val;
  handleSearch();
};
// 分页当前页改变
const handleCurrentChange = (page) => {
  // console.log(`current page: ${page}`);
  pagination.currentPage = page;
  handleSearch();
};

// 当前文章详情
const currentArticle = ref(null);
// 新增文章成功
const handleSuccess = () => {
  handleSearch();
};
// 编辑文章
const handleEdit = async (row) => {
  // 新增文章
  if (!row.id) {
    // 新增文章
    currentArticle.value = null;
    // 打开文章弹窗
    openArticleDialog();
  }
  // 编辑文章
  else {
    // 请求文章详情
    await getArticleDetail(row.id).then((res) => {
      currentArticle.value = res;
      // 打开文章弹窗
      openArticleDialog();
    });
  }
};

// 通用操作处理函数
const handleAction = async (row, config) => {
  const {
    confirmText,
    type = 'info',
    apiFn,
    apiParams = {},
    successMessage,
  } = config;

  try {
    await ElMessageBox.confirm(
      `确认${confirmText}该文章"${row.title}"吗?`,
      "操作提示!",
      {
        confirmButtonText: `确定${confirmText}`,
        cancelButtonText: "取消",
        type,
      }
    );

    await apiFn(row.id, apiParams);
    ElMessage.success(successMessage);
    handleSearch();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || "操作失败");
    }
  }
};

// 发布文章
const handlePublish = (row) => {
  handleAction(row, {
    title: "发布文章",
    confirmText: "发布",
    type: 'success',
    apiFn: updateArticleStatus,
    apiParams: { status: 1 },
    successMessage: "发布成功!",
  });
};

// 下线文章
const handleOffline = (row) => {
  handleAction(row, {
    title: "下线文章",
    confirmText: "下线",
    apiFn: updateArticleStatus,
    apiParams: { status: 2 },
    successMessage: "下线成功!",
  });
};

// 删除文章
const handleDelete = (row) => {
  handleAction(row, {
    title: "删除文章",
    confirmText: "删除",
    type: "warning",
    apiFn: deleteArticle,
    successMessage: "删除成功!",
  });
};

//生命周期：挂载完成后请求文章分类、文章列表
onMounted(() => {
  requestCate();
  handleSearch();
});
</script>

<style lang="scss" scoped></style>

<template>
  <div>
    <page-head />
    <table-search :form-item="formItem" @search="handleSearch" />
    <el-table :data="tableData" stripe style="width: 100%; margin-top: 25px; cursor: pointer" highlight-current-row
      show-overflow-tooltip border>
      <el-table-column prop="id" label="ID" width="80" fixed align="center" />
      <el-table-column label="用户ID" width="100" fixed align="center">
        <template #default="scope">
          <el-avatar size="large">{{ scope.row.username }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="100" align="center" />
      <el-table-column label="情绪评分" width="250" align="center">
        <template #default="scope">
          <el-rate v-model="scope.row.moodScore" :max="10" disabled />
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="120" align="center">
        <template #default="{ row: { sleepQuality, stressLevel } }">
          <div>
            <span style="display: block;">睡眠：{{ sleepQuality }}/5</span>
            <span style="display: block;">压力：{{ stressLevel }}/5</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="130" align="center" />
      <el-table-column prop="diaryContent" label="日记内容" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <el-button-group>
          <el-button type="primary" @click="" text>详情</el-button>
          <el-button type="danger" @click="" text>删除</el-button>
        </el-button-group>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 20px; display: flex; justify-content: flex-end"
      :page-sizes="[1, 5, 10, 20, 30, 50, 100]" :page-size="pagination.size" :total="pagination.total" :pager-count="7"
      :current-page="pagination.currentPage" layout="total, sizes, prev, pager, next, jumper" background
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog v-model="showDiaryDialog"></el-dialog>
  </div>
</template>

<script setup name="Emotion">
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { getDiaryPages } from "@/api/admin";
import { onMounted, reactive, ref } from "vue";

const showDiaryDialog = ref(false);

// table-search 组件的 form-item 属性
const formItem = ref([
  {
    comp: "input",
    prop: "userId",
    label: "用户ID",
    placeholder: "请输入用户ID",
  },
  {
    comp: "select",
    prop: "moodScore",
    label: "情绪评分",
    placeholder: "请选择评分范围",
    options: [
      { label: "低分(1-3)", value: "1-3" },
      { label: "中分(4-6)", value: "4-6" },
      { label: "高分(7-10)", value: "7-10" },
    ],
  },
]);

// el-table
const tableData = ref([]);
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const requestList = async (formData = {}) => {
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total } = await getDiaryPages(params);
  tableData.value = records;
  pagination.total = total;
};
const handleSearch = (formData) => {
  requestList(formData);
};
// 分页大小改变
const handleSizeChange = (val) => {
  // console.log(`${val} items per page`);
  pagination.size = val;
  requestList();
};
// 分页当前页改变
const handleCurrentChange = (page) => {
  // console.log(`current page: ${page}`);
  pagination.currentPage = page;
  requestList();
};
onMounted(() => {
  handleSearch();
});
</script>

<style lang="scss" scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;

      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;

    i {
      margin-right: 4px;
    }
  }

  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {

  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;

    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;

      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }

  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }

  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }

  .improvement-list {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }

  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;

    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;

      i {
        margin-right: 4px;
      }
    }
  }

  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>

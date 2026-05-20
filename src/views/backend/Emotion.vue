<template>
  <div>
    <page-head />
    <table-search :form-item="formItem" @search="handleSearch" />
    <el-table :data="tableData" stripe style="width: 100%; margin-top: 25px; cursor: pointer" highlight-current-row
      show-overflow-tooltip border>
      <el-table-column prop="id" label="ID" width="80" fixed align="center" />
      <el-table-column prop="userId" label="用户ID" width="100" fixed align="center" />
      <el-table-column label="用户名" width="100" fixed align="center">
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
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" @click="viewDiary(row)" text>详情</el-button>
            <el-button type="danger" @click="delDiary(row.id)" text>删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 20px; display: flex; justify-content: flex-end"
      :page-sizes="[1, 5, 10, 20, 30, 50, 100]" :page-size="pagination.size" :total="pagination.total" :pager-count="7"
      :current-page="pagination.current" layout="total, sizes, prev, pager, next, jumper" background
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog v-model="showDiaryDialog" title="情绪日志详情" width="800px" :close-on-click-modal="false">
      <div v-if="currentDiary" class="detail-content">
        <div class="detail-section">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border label-width="150px">
            <el-descriptions-item label="用户名" align="center">{{ currentDiary.username
            }}</el-descriptions-item>
            <el-descriptions-item label="昵称" align="center">{{ currentDiary.nickname
            }}</el-descriptions-item>
            <el-descriptions-item label="用户ID" align="center">{{ currentDiary.userId
            }}</el-descriptions-item>
            <el-descriptions-item label="记录日期" align="center">{{ currentDiary.diaryDate
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border label-width="150px">
            <el-descriptions-item label="情绪类型" align="center">
              <el-rate v-model="currentDiary.moodScore" :max="10" disabled show-score size="small" />
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪" align="center">
              <el-tag :type="getEmotionTagType(currentDiary.dominantEmotion)">{{ currentDiary.dominantEmotion
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量" align="center">{{ currentDiary.sleepQuality || '-'
            }}/5</el-descriptions-item>
            <el-descriptions-item label="压力水平" align="center">{{ currentDiary.stressLevel || '-'
            }}/5</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>日记相关</h4>
          <el-descriptions :column="1" border label-width="150px">
            <el-descriptions-item label="情绪触发因素" align="left" label-align="right">{{ currentDiary.emotionTriggers || '无'
            }}</el-descriptions-item>
            <el-descriptions-item label="日记内容" align="left" label-align="right">{{ currentDiary.diaryContent || '无'
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>AI情绪分析结果</h4>
          <div class="ai-analysis-result">
            <el-descriptions :column="2" border label-width="150px">
              <el-descriptions-item label="主要情绪" align="center">
                <el-tag :type="getAiEmotionTagType(aiData.primaryEmotion)">{{ aiData.primaryEmotion }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪强度" align="center">
                <el-progress type="line" :percentage="aiData.emotionScore"
                  :color="getEmotionScoreColor(aiData.emotionScore)" :stroke-width="10" show-text text- striped
                  striped-flow />
              </el-descriptions-item>
              <el-descriptions-item label="风险等级" align="center">
                <el-tag :type="getRiskLevelTagType(aiData.riskLevel)">{{ getRiskLevelText(aiData.riskLevel) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪性质" align="center">
                <el-tag :type="aiData.isNegative ? 'warning' : 'success'">{{ aiData.isNegative ? '负面情绪' : '正面情绪'
                }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <div class="ai-suggestion-section">
              <h5>专业建议</h5>
              <div class="suggestion-content">{{ aiData.suggestion || '无' }}</div>
            </div>
            <div class="ai-suggestion-section">
              <h5>风险描述</h5>
              <div class="suggestion-content">{{ aiData.riskDescription || '无' }}</div>
            </div>
            <div class="ai-improvements-section">
              <h5>改善建议</h5>
              <ul class="improvement-list">
                <li v-for="item in aiData.improvementSuggestions" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>时间信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间" align="center">{{ currentDiary.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="更新时间" align="center">{{ currentDiary.updatedAt }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无数据"></el-empty>
      </div>
      <template #footer>
        <el-button type="info" @click="showDiaryDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Emotion">
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { getDiaryPages, deleteDiary } from "@/api/admin";
import { getEmotionTagType, getAiEmotionTagType, getEmotionScoreColor, getRiskLevelTagType, getRiskLevelText } from "@/utils/mapFunction";
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

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
  {
    comp: "select",
    prop: "dominantEmotion",
    label: "主要情绪",
    placeholder: "请选择主要情绪",
    options: [
      { label: "快乐", value: "快乐" },
      { label: "平静", value: "平静" },
      { label: "兴奋", value: "兴奋" },
      { label: "愤怒", value: "愤怒" },
      { label: "悲伤", value: "悲伤" },
      { label: "焦虑", value: "焦虑" },
    ],
  },
]);

// el-table
const tableData = ref([]);
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// 保存搜索条件（用于分页时保持搜索状态）
const searchForm = reactive({});

const requestList = async (formData = {}) => {
  // 先更新搜索条件（如果有新条件）
  if (Object.keys(formData).length > 0) {
    Object.assign(searchForm, formData);
  }

  // 再构建请求参数（使用更新后的 searchForm）
  const params = { ...searchForm, ...pagination };

  // 解析情绪评分范围
  if (searchForm.moodScore) {
    const [min, max] = searchForm.moodScore.split('-').map(Number);
    params.minMoodScore = min;
    params.maxMoodScore = max;
  }

  const { records, total: totalNum } = await getDiaryPages(params);
  tableData.value = records?.sort((a, b) => b.id - a.id);
  pagination.total = totalNum;
};
const handleSearch = (formData = {}) => {
  // 搜索时重置到第一页
  pagination.current = 1;
  requestList(formData);
};
// 分页大小改变
const handleSizeChange = (val) => {
  pagination.size = val;
  // 使用保存的搜索条件
  requestList();
};
// 分页当前页改变
const handleCurrentChange = (page) => {
  pagination.current = page;
  // 使用保存的搜索条件
  requestList();
};

// 详情
const showDiaryDialog = ref(false);
const currentDiary = ref(null);
const aiData = ref(null);

const viewDiary = (row) => {
  currentDiary.value = row;
  showDiaryDialog.value = true;
  if (row.hasAiEmotionAnalysis) {
    aiData.value = JSON.parse(row.aiEmotionAnalysis);
  } else {
    aiData.value = {
      "emotionScore": 70,
      "icon": "",
      "improvementSuggestions": ["保持规律作息", "适当运动", "与朋友交流"],
      "isNegative": false,
      "keywords": [],
      "label": "平静",
      "primaryEmotion": "平静",
      "riskDescription": "当前情绪状态稳定，无需特别关注",
      "riskLevel": 0,
      "suggestion": "情绪状态平稳，慢慢来就好",
      "timestamp": 17696596564
    };
  }
};
const delDiary = async (id) => {
  ElMessageBox.confirm('确定要删除该日记吗？', '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteDiary(id).then(() => {
      ElMessage.success('删除成功')
      handleSearch();
    });
  }).catch(() => {
    ElMessage.info('取消删除');
  });
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

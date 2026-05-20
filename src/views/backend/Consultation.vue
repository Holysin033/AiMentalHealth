<template>
  <div>
    <page-head />
    <el-table :data="tableData" stripe style="width: 100%; margin-top: 25px; cursor: pointer" highlight-current-row
      border>
      <el-table-column label="序号" type="index" width="55" fixed align="center" />
      <el-table-column label="会话id" width="100" fixed align="center">
        <template #default="scope">
          <el-avatar :size="50">{{
            scope.row.userNickname || "未知"
          }}</el-avatar>
          <!-- <span style="margin-left: 10px">{{ scope.row.id }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="{ row }">
          <div class="session-title">{{ row.sessionTitle }}</div>
          <div class="session-preview">{{ row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column label="消息数" prop="messageCount" align="center" width="70" />
      <el-table-column label="时间" prop="lastMessageTime" align="center" width="160" />
      <el-table-column label="操作" width="90" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" text @click="viewSessionDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 20px; display: flex; justify-content: flex-end"
      :page-sizes="[1, 5, 10, 20, 30, 50, 100]" :page-size="pagination.size" :total="pagination.total" :pager-count="7"
      :current-page="pagination.currentPage" layout="total, sizes, prev, pager, next, jumper" background
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog v-model="showDetialDialog" title="咨询会话详情" width="70%" :close-on-click-modal="false">
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户：</div>
            <div class="detail-value">{{ sessionDetail.userNickname }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间：</div>
            <div class="detail-value">{{ sessionDetail.startedAt }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数：</div>
            <div class="detail-value">{{ sessionDetail.messageCount }}</div>
          </div>
        </div>
        <div class="messages-container">
          <div class="messages-header">
            <h4>对话列表</h4>
          </div>
          <div class="messages-list" v-loading="loadingMessages">
            <div v-for="detail in sessionDetails" :key="detail.id" class="message-item"
              :class="detail.senderType === 1 ? 'user-message' : 'ai-message'">
              <div class="message-header">
                <span class="sender">{{
                  detail.senderType === 1 ? "用户" : "AI助手"
                }}</span>
                <span class="time">{{ detail.createdAt }}</span>
              </div>
              <div class="message-content">{{ detail.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showDetialDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Consultation">
import PageHead from "@/components/PageHead.vue";
import { onMounted, ref } from "vue";
import { getSessionsPages, getSessionsDetails } from "@/api/admin.js";

const tableData = ref([]);
const pagination = ref({
  currentPage: 1,
  size: 10,
  total: 0,
});

const requestList = async () => {
  const { records, total: totalNum } = await getSessionsPages(pagination.value);
  tableData.value = records;
  pagination.value.total = totalNum;
};
// 分页大小改变
const handleSizeChange = (val) => {
  // console.log(`${val} items per page`);
  pagination.value.size = val;
  requestList();
};
// 分页当前页改变
const handleCurrentChange = (page) => {
  // console.log(`current page: ${page}`);
  pagination.value.currentPage = page;
  requestList();
};

const showDetialDialog = ref(false);
// 会话详情
const sessionDetail = ref({});
const sessionDetails = ref([]);
const loadingMessages = ref(false);
const viewSessionDetail = async (row) => {
  loadingMessages.value = true;
  showDetialDialog.value = true;
  await getSessionsDetails(row.id).then((res) => {
    loadingMessages.value = false;
    // console.log(res);
    sessionDetails.value = res;
    sessionDetail.value = row;
  });
};

onMounted(() => {
  requestList();
});
</script>

<style lang="scss" scoped>
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.session-preview {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.session-detail {
  max-height: 70vh;
  overflow-y: auto;

  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    :last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-weight: 500;
      color: #495057;
      min-width: 80px;
      margin-right: 8px;
    }

    .detail-value {
      color: #333;
    }
  }
}

.messages-container {
  margin-top: 20px;

  .messages-header {
    margin-bottom: 16px;

    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .messages-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;

    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;

      :last-child {
        margin-bottom: 0;
      }

      &.user-message {
        background: #e8f4fd;
      }

      &.ai-message {
        background: #f0f9f0;
      }
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .sender {
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }

      .message-content {
        color: #333;
        line-height: 1.6;
        white-space: pre-wrap;
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
}
</style>

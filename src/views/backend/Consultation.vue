<template>
  <div>
    <page-head />
    <el-table :data="tableData" stripe style="width: 100%; margin-top: 25px; cursor: pointer" highlight-current-row
      border show-overflow-tooltip>
      <el-table-column label="序号" type="index" width="55" fixed align="center" />
      <el-table-column label="会话id" width="100" fixed align="center">
        <template #default="scope">
          <el-avatar :size="50">{{ scope.row.userNickname || '未知' }}</el-avatar>
          <!-- <span style="margin-left: 10px">{{ scope.row.id }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="{ row }">
          <div class="session-title">{{ row.sessionTitle }}</div>
          <div class="session-preview"
            style="th: 90%;overflow: hidden; text-overflow: ellipsis; white-space: nowrawidp">{{ row.lastMessageContent
            }}</div>
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
  </div>
</template>

<script setup name="Consultation">
import PageHead from "@/components/PageHead.vue";
import { onMounted, ref } from "vue";
import { getSessionsPages } from "@/api/admin.js";

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
const viewSessionDetail = () => {
  console.log("查看会话详情");
};

onMounted(async () => {
  const res = await getSessionsPages(pagination.value)

  const { records, total } = res
  tableData.value = records
  pagination.value.total = total

  console.log(tableData.value);
})
</script>

<style lang="scss" scoped></style>
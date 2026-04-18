<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button>
        <el-icon>
          <ep-expand></ep-expand>
        </el-icon>
      </el-button>
      <p class="page-title">{{ pageTitle }}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
        <div class="flex-box">
          <el-avatar :src="avatarUrl" alt="avatar" @error="handleError" v-if="!avatarState" />
          <el-avatar :src="avatarUrl" shape="square" alt="avatar" v-else>
            <p style="color: #fff;font-size: 12px;">Admin</p>
          </el-avatar>
          <p class="user-name">{{ username }}</p>
          <el-icon>
            <ep-arrow-down></ep-arrow-down>
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup name="NavBar">
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const avatarUrl = "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
const username = "admin";
const stateV = reactive({
  avatarState: false,
});
const pageTitle = computed(() => route.meta.title || "导航栏");

const handleCommand = (command) => {
  console.log(command);
  if (command === "logout") {
    // 退出登录逻辑
    alert("退出登录");
  }
};
// 处理头像加载错误
const handleError = () => {
  stateV.avatarState = true;
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;

  .flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
}
</style>

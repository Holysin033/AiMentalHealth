<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <side-bar/>
      <el-container>
        <el-header><nav-bar/></el-header>
        <el-main class="main-container">
          <router-view class="content-container"></router-view>
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </div>
</template>

<script setup name="BackendLayout">
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .el-header{
    height: 74px !important;
  }
  .main-container {
    height: 100%;
    .content-container {
      padding: 20px;
      background-color: #fff;
      min-height: calc(100% - 74px);
    }
  }
}
</style>

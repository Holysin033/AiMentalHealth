<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <side-bar/>
      <el-container>
        <el-header><nav-bar/></el-header>
        <el-main>
          <router-view></router-view>
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
  .main-container {
    height: 100%;
  }
}
</style>

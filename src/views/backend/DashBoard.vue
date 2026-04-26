<template>
  <div>
    <page-head>
      <template #buttons>
        <el-button type="success">新增</el-button>
        <el-button type="primary">编辑</el-button>
      </template>
    </page-head>
    <table-search :form-item="formItem" @search="handleSearch"></table-search>
  </div>
</template>

<script setup name="Dashboard">
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { ref } from "vue";

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
    options: [
      { label: "心理健康基础", value: 1 },
      { label: "情绪管理", value: 2 },
    ],
  },
]);

const handleSearch = (formData) => {
  console.log(formData);
};
</script>

<style lang="scss" scoped></style>

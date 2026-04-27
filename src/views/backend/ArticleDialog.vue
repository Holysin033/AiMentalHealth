<template>
  <el-dialog
    title="文章详情"
    v-model="articleDialogVisible"
    width="50%"
    @close="toggleArticleDialogVisible()"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          minlength="1"
          maxlength="200"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option
            v-for="item in props.cateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="formData.summary"
          type="textarea"
          :rows="4"
          maxlength="1000"
          show-word-limit
          placeholder="请输入文章摘要(可选 )"
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          style="width: 100%"
          v-model="formData.tagsArray"
          placeholder="请输入文章标签(多个标签用逗号隔开)"
          allow-create
          multiple
          filterable
          clearable
        >
          <el-option
            v-for="item in commonTags"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" prop="coverImage">
        <div class="cover-upload">
          <el-upload
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            accept="image/*"
          >
          <div class="cover-preview "></div>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup name="ArticleDialog">
import { ref, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin.js";

// props
const props = defineProps({
  cateList: {
    type: Array,
    default: () => [],
  },
});

//使用pinia管理弹窗状态和关闭方法
const adminStore = useAdminStore();
const { articleDialogVisible } = storeToRefs(adminStore);
const { toggleArticleDialogVisible } = adminStore;

// 定义表单数据
const formData = ref({
  title: "",
  content: "",
  coverImage: "",
  categoryId: 1,
  summary: "",
  tags: "",
  id: "",
});

// 定义表单验证规则
const rules = ref({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    {
      min: 1,
      max: 200,
      message: "文章标题长度必须在1到200个字符之间",
      trigger: "blur",
    },
  ],
  categoryId: [{ required: true, message: "请选择分类", trigger: "blur" }],
});

// 定义表单实例
// const formRef = ref(null);
const formRef = useTemplateRef("formRef");

// 常用标签
const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",
  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",
  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];
//上传图片
const beforeUpload = () => {};
//上传图片请求
const handleUploadRequest = () => {};
</script>

<style lang="scss" scoped></style>

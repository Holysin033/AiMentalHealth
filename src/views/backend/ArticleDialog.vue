<template>
  <el-dialog title="文章详情" v-model="articleDialogVisible" width="50%" @close="toggleArticleDialogVisible()">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" minlength="1" maxlength="200" show-word-limit
          clearable />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in props.cateList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model="formData.summary" type="textarea" :rows="4" maxlength="1000" show-word-limit
          placeholder="请输入文章摘要(可选 )" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select style="width: 100%" v-model="formData.tagsArray" placeholder="请输入文章标签(多个标签用逗号隔开)" allow-create
          multiple filterable clearable>
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" prop="coverImage">
        <div class="cover-upload">
          <el-upload ref="uploadRef" action="#" :before-upload="beforeUpload" :http-request="handleUploadRequest"
            accept="image/*" drag :show-file-list="false" :limit="1">
            <div class="cover-preview" v-if="!imgUrl">
              <p>拖拽或点击上传封面图片</p>
            </div>
            <el-image class="cover-preview" fit="cover" :src="imgUrl" alt="封面图片" v-else />
          </el-upload>
          <el-button v-if="imgUrl" type="danger" size="small" @click="removeCover">移除封面</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup name="ArticleDialog">
import { ref, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin.js";
import { commonTags, fileServerUrl } from "@/constants/index.js";
import { uploadFile } from "@/api/admin.js";
import { ElMessage } from "element-plus";

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
// 定义上传实例
const uploadRef = useTemplateRef("uploadRef");


// 封面图片url
const imgUrl = ref("");
// 上传图片前校验
const beforeUpload = (file) => {
  //针对上传的文件进行校验,是否为图片类型，大小不能超过5MB
  const { type, size } = file;
  const isImage = type.startsWith("image/");
  const is5MSize = size / 1024 / 1024 < 5;
  if (!isImage) {
    ElMessage.error("上传图片只能是 JPG 格式!");
    return false;
  }
  if (!is5MSize) {
    ElMessage.error("上传图片大小不能超过5MB!");
    return false;
  }
  return true;//校验通过，返回true，继续上传
};
//上传图片请求
const handleUploadRequest = async ({ file }) => {
  //UUID,这里使用原版
  const businessId = crypto.randomUUID();
  const { filePath } = await uploadFile(file, { businessId });
  // console.log(fileRes);
  //拼接完整的url
  imgUrl.value = fileServerUrl + filePath
  formData.coverImage = filePath
}
// 移除封面
const removeCover = () => {
  imgUrl.value = ""
  formData.coverImage = ""
  // 清空上传实例中的文件列表,(去除limit限制,允许上传多个文件,这里就可以注释)
  uploadRef.value?.clearFiles();
}
</script>

<style lang="scss" scoped>
.cover-upload {
  :deep(.el-upload-dragger) {
    padding: 0 !important;

    .cover-preview {
      width: 200px;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #8b949e;
      background: #f6f8fa;
    }
  }

}
</style>

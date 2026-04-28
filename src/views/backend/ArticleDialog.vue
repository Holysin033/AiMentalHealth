<template>
  <el-dialog
    title="文章详情"
    v-model="articleDialogVisible"
    width="50%"
    @close="closeArticleDialog()"
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
            ref="uploadRef"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            accept="image/*"
            drag
            :limit="1"
            :show-file-list="false"
          >
            <div class="cover-preview" v-if="!imgUrl">
              <p>拖拽或点击上传封面图片</p>
            </div>
            <el-image v-else class="cover-preview" :src="imgUrl" fit="cover" />
          </el-upload>
          <el-button
            v-if="imgUrl"
            type="danger"
            size="small"
            @click="removeCover"
            >移除封面</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          ref="editorRef"
          v-model="formData.content"
          placeholder="请输入文章内容，支持富文本格式，可以使用加粗、斜体、列表、标题等格式丰富内容"
          :max-char-count="5000"
          min-height="310px"
          @change="handleContentChange"
          @created="handleCreated"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview" class="preview-content">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer class="footer-btn">
      <el-button
        type="primary"
        size="default"
        @click="btnPreview = !btnPreview"
        >{{ btnPreview ? "隐藏预览" : "预览效果" }}</el-button
      >
      <el-button type="default" size="default" @click="closeArticleDialog()"
        >取消</el-button
      >
      <el-button
        type="success"
        size="large"
        @click="handleSubmit(formRef)"
        :loading="loading"
        >创建文章</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup name="ArticleDialog">
import RichTextEditor from "@/components/RichTextEditor.vue";
import { ref, useTemplateRef, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin.js";
import { commonTags, fileServerUrl } from "@/constants/index.js";
import { uploadFile, createArticle } from "@/api/admin.js";
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
const { closeArticleDialog } = adminStore;

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
  content: [
    { required: true, message: "请输入文章内容", trigger: "blur" },
    { max: 5000, message: "文章内容长度不能超过5000个字符", trigger: "blur" },
  ],
});
// 定义表单实例
// const formRef = ref(null);
const formRef = useTemplateRef("formRef");
// 定义上传实例
const uploadRef = useTemplateRef("uploadRef");
// 定义富文本实例（使用普通 ref，因为需要存储编辑器实例）
const editorRef = ref(null);

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
  return true; //校验通过，返回true，继续上传
};
//上传图片请求
const handleUploadRequest = async ({ file }) => {
  //UUID,这里使用原版
  const businessId = crypto.randomUUID();
  const { filePath } = await uploadFile(file, { businessId });
  // console.log(fileRes);
  //拼接完整的url
  imgUrl.value = fileServerUrl + filePath;
  formData.coverImage = filePath;
};
// 移除封面
const removeCover = () => {
  imgUrl.value = "";
  formData.coverImage = "";
  // 清空上传实例中的文件列表,(去除limit限制,允许上传多个文件,这里就可以注释)
  uploadRef.value?.clearFiles();
};

// 富文本改变时触发
const handleContentChange = (data) => {
  // console.log(data,'富文本内容');
  formData.value.content = data.html;
};
// 富文本创建时触发
const handleCreated = (editor) => {
  editorRef.value = editor;
  //编辑时
  if (formData.content && editor) {
    //使用nextTick确保富文本实例创建完成后再设置内容，避免报错
    nextTick(() => {
      editor.setHtml(formData.content); //设置富文本内容
    });
  }
};
//预览效果
const btnPreview = ref(false);
// 加载状态
const loading = ref(false);
// 提交表单
const handleSubmit = async (formRef) => {
  if (!formRef) return;
  formRef.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
    }
    console.log(formData.value);
    const submitData = {
      ...formData.value,
      tags: formData.value.tagArray.join(","),
    };
    delete submitData.tagArray;
    await createArticle(submitData).then((res) => {
      loading.value = false;
    });
  });
};
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
.footer-btn {
  padding-top: 0 !important;
}
</style>

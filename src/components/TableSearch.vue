<template>
  <el-form :model="formData" ref="formRef">
    <el-row :gutter="24">
      <template v-for="item in formItemWithCol" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component :is="isComp(item.comp)" v-model="formData[item.prop]" :placeholder="item.placeholder">
              <template v-if="item.comp === 'select'">
                <el-option label="全部" value="" />
                <el-option v-for="option in item.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="" @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="TableSearch">
import { ref, reactive, computed, useTemplateRef } from "vue";

const emit = defineEmits(["search"]);
const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
});

// 表单数据
const formData = reactive({});
// 表单实例
const formRef = useTemplateRef("formRef");//3.3+ 新增的函数，用于获取模板中的元素引用,3.3以前需要手动绑定ref
// 查询
const handleSearch = () => {
  emit("search", formData);
};
// 重置
const handleReset = () => {
  // 重置表单数据
  // Object.keys(formData).forEach((key) => {
  //   formData[key] = "";
  // });
  // 重置表单实例
  formRef.value.resetFields();
  emit("search", formData);
};
// 用于判断element-plus组件类型
const isComp = (comp) => {
  const componentMap = {
    input: "el-input",
    select: "el-select",
  };
  // 找不到就返回 div，不会报错
  return componentMap[comp] || "div";
};
const formItemWithCol = computed(() => {
  const { formItem } = props;
  formItem.map((item) =>
    // item.col = {
    //   xs: 24,
    //   sm: 12,
    //   md: 8,
    //   lg: 6,
    //   xl: 6,
    // }
    // Object.assign(item, {
    //   col: {
    //     xs: 24,
    //     sm: 12,
    //     md: 8,
    //     lg: 6,
    //     xl: 6,
    //   }
    // })
    Reflect.set(item, "col", {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6,
    }));
  return formItem;
});

</script>

<style lang="scss" scoped></style>

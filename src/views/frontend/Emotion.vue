<template>
    <div class="emotionDiary-container">
        <!-- 头部区域 -->
        <div class="header-section">
            <div class="header-content">
                <el-image :src="iconUrl" style="width: 60px; height: 60px;" alt="情感日记图标" />
                <h1>情绪日记</h1>
            </div>
        </div>
        <!-- 内容区域 -->
        <div class="content">
            <!-- 情绪评分卡片 -->
            <div class="diary-card">
                <div class="title">今日情绪评分</div>
                <div class="section">
                    <p>您今天的整体情绪如何？</p>
                    <div class="rate">
                        <el-rate v-model="diaryForm.moodScore" :max="10" size="large" clearable show-text
                            :colors="{ 3: 'red', 7: 'orange', 10: 'yellow' }" :texts="emotionStatus" />
                    </div>
                </div>
            </div>
            <!-- 主要情绪卡片 -->
            <div class="diary-card">
                <div class="title">今日主要情绪</div>
                <div class="emotion-grid">
                    <div class="emotion-card" v-for="item in emotionOptions" :key="item.name"
                        :class="{ 'selected': item.name === diaryForm.dominantEmotion }"
                        @click="selectEmotion(item.name)">
                        <el-image :src="item.url" style="width: 40px; height: 40px;" alt="情感图标" lazy/>
                        <div class="emotion-name">{{ item.name }}</div>
                    </div>
                </div>
            </div>
            <!-- 详细记录 -->
            <div class="diary-card">
                <div class="title">详细记录</div>
                <div class="detail-form">
                    <div class="form-group">
                        <div class="form-label">情绪触发因素</div>
                        <el-input v-model="diaryForm.emotionTriggers" placeholder="今天您遇到了什么事情影响了您的情绪" type="textarea"
                            :rows="3" :maxlength="1000" show-word-limit clearable />
                    </div>
                    <div class="form-group">
                        <div class="form-label">今日感想</div>
                        <el-input v-model="diaryForm.diaryContent" placeholder="写下您的感想或发生有趣的事件" type="textarea"
                            :rows="5" :maxlength="2000" show-word-limit clearable />
                    </div>
                    <!-- 生活指标 -->
                    <div class="life-indicators">
                        <div class="indicator-group">
                            <div class="form-label">睡眠质量</div>
                            <el-select v-model="diaryForm.sleepQuality" placeholder="请选择您的睡眠质量">
                                <el-option label="极差" :value="1" />
                                <el-option label="较差" :value="2" />
                                <el-option label="一般" :value="3" />
                                <el-option label="良好" :value="4" />
                                <el-option label="优秀" :value="5" />
                            </el-select>
                        </div>
                        <div class="indicator-group">
                            <div class="form-label">压力等级</div>
                            <el-select v-model="diaryForm.stressLevel" placeholder="请选择您的压力等级">
                                <el-option label="很低" :value="1" />
                                <el-option label="较低" :value="2" />
                                <el-option label="一般" :value="3" />
                                <el-option label="较高" :value="4" />
                                <el-option label="很高" :value="5" />
                            </el-select>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <el-button @click="resetForm">重置</el-button>
                        <el-button type="primary" @click="saveDiary">提交记录</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="Emotion">
import { reactive } from "vue";
import { dayjs, ElMessage } from "element-plus";
import { emotionStatus } from "@/constants/index";
import { saveEmotionDiary } from "@/api/frontend";


const iconUrl = new URL('@/assets/images/like.png', import.meta.url).href
// 情绪选项
const emotionOptions = [
    { name: '开心', url: new URL('@/assets/images/开心.png', import.meta.url).href },
    { name: '平静', url: new URL('@/assets/images/平静.png', import.meta.url).href },
    { name: '焦虑', url: new URL('@/assets/images/焦虑.png', import.meta.url).href },
    { name: '悲伤', url: new URL('@/assets/images/悲伤.png', import.meta.url).href },
    { name: '兴奋', url: new URL('@/assets/images/兴奋.png', import.meta.url).href },
    { name: '疲惫', url: new URL('@/assets/images/疲惫.png', import.meta.url).href },
    { name: '惊讶', url: new URL('@/assets/images/惊讶.png', import.meta.url).href },
    { name: '困惑', url: new URL('@/assets/images/困惑.png', import.meta.url).href },
]
// 表单状态
const diaryForm = reactive({
    diaryDate: dayjs().format("YYYY-MM-DD"),
    moodScore: 0,
    dominantEmotion: "",
    emotionTriggers: "",
    diaryContent: "",
    sleepQuality: null,
    stressLevel: null,
});

// 选择情绪
const selectEmotion = (emotion) => {
    diaryForm.dominantEmotion = emotion;
}

// 重置表单
const resetForm = () => {
    Object.assign(diaryForm, {
        moodScore: 0,
        diaryDate: dayjs().format("YYYY-MM-DD"),
        dominantEmotion: "",
        emotionTriggers: "",
        diaryContent: "",
        sleepQuality: null,
        stressLevel: null,
    });
}

// 提交记录
const saveDiary = async () => {
    if (!diaryForm.moodScore || !diaryForm.dominantEmotion || !diaryForm.emotionTriggers || !diaryForm.diaryContent) {
        ElMessage.error("请填写完整信息");
        return;
    }
    try {
        await saveEmotionDiary(diaryForm);
        ElMessage.success("记录已提交");
        resetForm();
    } catch (error) {
        ElMessage.error("提交失败，请稍后重试");
    }
}
</script>

<style lang="scss" scoped>
.emotionDiary-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);

    .header-section {
        background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
        color: white;
        padding: 48px;

        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }

    .content {
        margin: 0 auto;
        width: 980px;
        padding: 20px;

        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

            .title {
                margin-bottom: 20px;
                font-size: 25px;
                font-weight: 600;
                color: #374151;
            }

            .section {
                margin-bottom: 20px;

                p {
                    font-size: 15px;
                    color: #6B7280;
                    margin-bottom: 15px;
                }
            }

            .emotion-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;

                .emotion-card {
                    padding: 15px;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    background: #F9FAFB;
                    transition: all 0.3s ease;

                    .emotion-name {
                        margin-top: 10px;
                        padding: 0 75px;
                    }

                    &.selected {
                        border-color: #7ED321;
                        background: #F0FDF4;
                        transform: translateY(-3px);
                    }
                }
            }

            .detail-form {
                .form-label {
                    margin: 10px 0;
                    color: #374151;
                }

                .life-indicators {
                    display: flex;
                    gap: 20px;

                    .indicator-group {
                        flex: 1;
                    }
                }

                .action-buttons {
                    margin-top: 40px
                }
            }
        }

    }
}
</style>
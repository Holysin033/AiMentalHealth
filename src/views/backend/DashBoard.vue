<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="always">
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="iconUrl1" fit="fill" style="width: 40px;height: 40px;" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="value">{{ analysisData?.systemOverview?.totalUsers || '-' }}</p>
              <p class="subtitle-title">活跃用户：{{ analysisData?.systemOverview?.activeUsers || '-' }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="iconUrl2" fit="fill" style="width: 40px;height: 40px;" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="value">{{ analysisData?.systemOverview?.totalDiaries || '-' }}</p>
              <p class="subtitle-title">今日新增：{{ analysisData?.systemOverview?.todayNewDiaries || '-' }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="iconUrl3" fit="fill" style="width: 40px;height: 40px;" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="value">{{ analysisData?.systemOverview?.totalSessions || '-' }}</p>
              <p class="subtitle-title">今日新增：{{ analysisData?.systemOverview?.todayNewSessions || '-' }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="iconUrl4" fit="fill" style="width: 40px;height: 40px;" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="value">{{ analysisData?.systemOverview?.avgMoodScore || '-' }}/10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-head">
              情绪数据分析
            </div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" style="height: 300px;width: 100%;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-head">
              咨询数据分析
            </div>
          </template>
          <div class="chart-content">
            <div ref="consultationChartRef" style="height: 300px;width: 100%;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col>
        <el-card>
          <template #header>
            <div class="card-head">
              用户活动数据分析
            </div>
          </template>
          <div class="chart-content">
            <div ref="userActivityChartRef" style="height: 300px;width: 100%;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Dashboard">
import * as echarts from 'echarts'
import { ref, onMounted } from "vue";
import { getAnalyticsOverview } from "@/api/admin";
import { emotionChartOption, consultationChartOption, userActivityChartOption, trendData, dailyTrend, activityData } from "@/constants/index";

//图片引入
const iconUrl1 = new URL('@/assets/images/users.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl3 = new URL('@/assets/images/comments.png', import.meta.url).href
const iconUrl4 = new URL('@/assets/images/smile.png', import.meta.url).href

const analysisData = ref({})

let emtionChart = ref(null)
let consultationChart = ref(null)
let userActivityChart = ref(null)
const emotionChartRef = ref(null)
const consultationChartRef = ref(null)
const userActivityChartRef = ref(null)

// 初始化图表
const initChart = (chartRef, chart, option) => {
  if (!chartRef.value) return
  //销毁现有的图表实例
  if (chart.value) {
    chart.value.dispose()
  }
  //初始化新的图表实例
  chart.value = echarts.init(chartRef.value)

  // 配置图表选项
  // const option ={}
  //启用
  chart.value.setOption(option)
}
// 初始化情绪图表
const initEmotionChart = () => {
  initChart(emotionChartRef, emtionChart, emotionChartOption)
  if (emtionChart.value) {
    emtionChart.value.setOption({
      xAxis: { data: trendData.value.map(item => item.date) },
      series: [
        { name: '平均情绪评分', data: trendData.value.map(item => item.avgMoodScore) },
        { name: '记录数量', data: trendData.value.map(item => item.recordCount) }
      ]
    })
  }
}
// 初始化咨询图表
const initConsultationChart = () => {
  initChart(consultationChartRef, consultationChart, consultationChartOption)
    if (consultationChart.value) {
    consultationChart.value.setOption({
      xAxis: { data: dailyTrend.value.map(item => item.date) },
      series: [
        { name: '会话数量', data: dailyTrend.value.map(item => item.sessionCount) },
        { name: '参与用户数', data: dailyTrend.value.map(item => item.userCount) }
      ]
    })
  }
}

// 初始化用户活动图表
const initUserActivityChart = () => {
  initChart(userActivityChartRef, userActivityChart, userActivityChartOption)
  if (userActivityChart.value) {
    userActivityChart.value.setOption({
      xAxis: { data: activityData.value.map(item => item.date) },
      series: [
        { name: '活跃用户', data: activityData.value.map(item => item.activeUsers) },
        { name: '新增用户', data: activityData.value.map(item => item.newUsers) },
        { name: '日记用户', data: activityData.value.map(item => item.diaryUsers) },
        { name: '咨询用户', data: activityData.value.map(item => item.consultationUsers) }
      ]
    })
  }
}



onMounted(async () => {
  await getAnalyticsOverview().then(res => {
    analysisData.value = res

    trendData.value = res.emotionTrend 
    dailyTrend.value = res.consultationStats.dailyTrend 
    activityData.value = res.userActivity
    console.log(analysisData.value);
    initEmotionChart()
    initConsultationChart()
    initUserActivityChart()
  })
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;

    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }

      .value {
        font-size: 14px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px
      }

      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }

  .chart-content {
    padding: 20px;
    height: 300px;
    position: relative;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>

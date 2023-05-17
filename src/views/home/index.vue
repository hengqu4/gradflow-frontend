<template>
  <div>
    <el-row style="margin: 15px 0; height: 300px">
      <el-col :span="14">
        <div style="margin-left: 15px; height: 100%">
          <el-carousel class="home-carousel">
            <el-carousel-item>
              <img :src="img1" />
            </el-carousel-item>
            <el-carousel-item>
              <img :src="img2" />
            </el-carousel-item>
            <el-carousel-item>
              <img :src="img3" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :span="10">
        <el-card style="margin: 0 15px; overflow-y: hidden" class="card-box">
          <template #header>
            <div class="card-header">
              <div>
                <span>光荣榜</span>
              </div>
              <el-button class="button" text>更多>></el-button>
            </div>
          </template>

          <div v-for="(item, index) in honorData" :key="index">
            <div class="home-news-item" style="display: flex">
              <el-icon style="font-size: 20px; color: #e98316">
                <Medal />
              </el-icon>
              <div class="news-title">
                {{ item }}
              </div>
              <!-- <div class="news-detail">
                {{ item.detail }}
              </div> -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 30px">
      <el-col :span="12">
        <el-card style="margin-left: 15px" class="card-box">
          <template #header>
            <div class="card-header">
              <span>近期新闻</span>
              <el-button class="button" text>更多>></el-button>
            </div>
          </template>

          <div v-for="(item, index) in newsData" :key="index">
            <div class="home-news-item">
              <div class="news-title">
                <el-icon style="font-size: 20px; color: #74109f">
                  <DataAnalysis />
                </el-icon>
                {{ item.title }}
              </div>
              <div class="news-detail" style="margin-left: 25px">
                {{ item.detail }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin: 0 15px" class="card-box">
          <template #header>
            <div class="card-header">
              <span>通知公告</span>
              <el-button class="button" text>更多>></el-button>
            </div>
          </template>

          <div
            v-for="(item, index) in noticeData"
            :key="index"
            style="display: flex"
          >
            <div class="home-news-item">
              <div class="news-title">
                <el-icon style="font-size: 18px; color: #950202">
                  <Notebook />
                </el-icon>
                {{ item.title }}
              </div>
              <div class="news-detail" style="margin-left: 25px">
                {{ item.detail }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import img1 from '@/assets/img/img1.jpg';
import img2 from '@/assets/img/img2.jpg';
import img3 from '@/assets/img/img3.jpg';
import { Medal, DataAnalysis, Notebook } from '@element-plus/icons-vue';

const honorData = [
  '学院研究生团队斩获首届中国研究生金融科技创新大赛全国一等奖唯一金奖',
  '学院获“上海产学研合作优秀项目奖”二等奖',
  '学院学生团队获得“挑战杯”全国金奖',
  '安全可信团队获评第二批华东师范大学“立德树人教师团队”',
  '学生团队在国内最高规格金融行业密码大赛中创佳绩',
  // '学院两门课程入选中西部高校青年教师融合式教学研修项目',
];
const newsData = [
  {
    title: '软件学院、计算机学院、数据学院2023年学生入党积极分子联合培训班结业',
    detail:
      '5月10日下午，软件工程学院、计算机科学与技术学院、数据科学与工程学院第二期学生入党积极分子联合培训班结业仪式在科学会堂阶梯教室举行。软件工程学院党委书记杨艳琴、党委副书记曹桂涛、专职组织员陈励及全体培训班学员出席活动。结业仪式由曹桂涛主持。',
  },
  {
    title: '软件工程学院召开本学期第一次全院教职工大会',
    detail:
      '4月25日，软件工程学院召开本学期第一次全院教职工大会，学院领导班子成员及全院教职工参加会议。会议由学院执行院长蒲戈光主持。',
  },
  {
    title:
      '五四青年节｜“无偿献血、致敬青春”：软件工程学院学生积极参加无偿献血活动',
    detail:
      '2023年5月5日，软件工程学院学生在校医院参加光荣的无偿献血活动，践行“五四精神”，用行动彰显青年风采。参与献血的同学们前往校医院准备献血，整个流程在医护工作人员、志愿者同学们的协助下有序进行。',
  },
  {
    title: '软件工程学院赴商汤科技公司开展“访企拓岗”调研',
    detail:
      '为持续推进“访企拓岗”专项行动，进一步深化校企合作，全面促进产学研融合，提升毕业生就业质量，4月13日，软件工程学院党委副书记曹桂涛、软件科学与技术系系主任张民、辅导员们等一行赴商汤科技公司开展“访企拓岗”调研交流活动。',
  },
];

const noticeData = [
  {
    title: '关于组织关系转入我校的工作提示与常见问题（2022年5月）',
    detail:
      '进入我校工作和全日制学习的党员应持中组部统一制式的“中国共产党党员组织关系介绍信”和来校工作或学习的凭证，到软件工程学院党委报到，提供基本信息。',
  },
  {
    title: '关于软件工程学院2023年华东师范大学本科教学优秀奖申报推荐人选的公示',
    detail:
      '根据学校《关于评选2023年华东师范大学本科教学优秀奖的通知》要求，经教师个人申报、学院本科教学指导委员会评审，拟推荐韩莉同志申报本年度华东师范大学本科教学优秀奖。',
  },
  {
    title: '2023年上半年拟毕业博士生科研审核结果公示（第一批）',
    detail:
      '根据华东师范大学研究生院关于博士研究生科研成果发表要求的相关规定，软件工程学院对2023上半年拟毕业博士生的科研情况进行了审核，',
  },
  {
    title: '华东师范大学软件工程学院2022年度上海市青年五四奖章推报人选公示',
    detail:
      '根据《关于评选2022年度上海市青年五四奖章的通知》（沪团委联〔2022〕20号）要求，在各级基层团组织广泛民主酝酿的基础上，经基层党组织评议推荐后，',
  },
];
</script>
<style lang="scss" scoped>
.home-carousel {
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
.card-box {
  .card-header {
    font-weight: 800;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .button {
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }
}

.el-table__header-wrapper {
  display: none;
}

.home-news-item {
  // background: var(--el-fill-color-lighter);
  border-top: 1px solid var(--el-table-border);
  border-bottom: 1px solid #e3e2e2;
  color: var(--el-table-text-color);
  padding: 8px 0;
  margin: 1px 0;
  font-size: 14px;
  cursor: pointer;
  .news-title {
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: var(--el-color-primary-dark-2);
  }
  .news-detail {
    height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>

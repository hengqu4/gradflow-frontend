<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="role === 'student'">
        <el-card style="margin: 15px" header="提交预审表" class="card-box">
          <el-upload
            class="upload-demo"
            drag
            action="/api/prequalification/upload"
            :on-change="handleChange"
            :auto-upload="true"
            :on-success="uploadSuccess"
            :show-file-list="false"
            :on-error="uploadFail"
            :before-upload="beforeUpload"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖动文件到这儿或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                docx, doc, pdf files with a size less than 10mb
              </div>
            </template>
          </el-upload></el-card
        >

        <el-card style="margin: 15px" header="提交记录" class="card-box">
          <el-table
            :data="tableData"
            style="width: 100%; margin-top: 20px"
            :border="true"
            v-loading="loading"
          >
            <el-table-column prop="authorName" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="filePath" label="预审表" width="180">
              <template #default="scope">
                <el-link
                  type="primary"
                  v-if="
                    scope.row.filePath !== null && scope.row.filePath !== ''
                  "
                  @click="downLoad(scope.row.id, scope.row.filePath)"
                  >点击下载</el-link
                >
                <span v-else>暂未上传文件</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="180">
            </el-table-column>
            <el-table-column prop="teacherName" label="导师"> </el-table-column>
            <el-table-column prop="teacherStatus" label="导师审核">
              <template #default="scope">
                <el-tag v-if="scope.row.teacherStatus == 0">未审核</el-tag>
                <el-tag type="danger" v-if="scope.row.teacherStatus == 1"
                  >审核不通过</el-tag
                >
                <el-tag type="success" v-if="scope.row.teacherStatus == 2"
                  >审核通过</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="导师评价">
              <template #default="scope">
                <div>
                  {{
                    scope.row.comment === null || scope.row.comment === ''
                      ? '无'
                      : scope.row.comment
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="adminStatus" label="教务审核">
              <template #default="scope">
                <el-tag v-if="scope.row.adminStatus == 0">未审核</el-tag>
                <el-tag type="danger" v-if="scope.row.adminStatus == 1"
                  >审核不通过</el-tag
                >
                <el-tag type="success" v-if="scope.row.adminStatus == 2"
                  >审核通过</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <div
        style="margin-top: 20px; margin-bottom: 20px"
        v-if="role !== 'student'"
      >
        <el-form :inline="true" @keyup.enter.native="getTableData()">
          <el-form-item>
            <el-input
              v-model="keywords"
              placeholder="查询内容"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getTableData()">查询</el-button>
            <el-button
              type="primary"
              @click="batchApprove()"
              :disabled="dataSelections.length <= 0"
              >全部通过</el-button
            >
            <el-button
              type="danger"
              @click="batchDisapprove()"
              :disabled="dataSelections.length <= 0"
              >全部不通过</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-if="role !== 'student'"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="authorName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="filePath" label="预审表" width="100">
          <template #default="scope">
            <el-link
              type="primary"
              v-if="scope.row.filePath !== null && scope.row.filePath !== ''"
              @click="downLoad(scope.row.id, scope.row.filePath)"
              >点击下载</el-link
            >
            <span v-else>暂未上传文件</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="100">
        </el-table-column>
        <el-table-column prop="teacherName" label="导师"> </el-table-column>
        <el-table-column prop="teacherStatus" label="导师审核">
          <template #default="scope">
            <el-tag v-if="scope.row.teacherStatus == 0">未审核</el-tag>
            <el-tag type="danger" v-if="scope.row.teacherStatus == 1"
              >审核不通过</el-tag
            >
            <el-tag type="success" v-if="scope.row.teacherStatus == 2"
              >审核通过</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="导师评价">
          <template #default="scope">
            <a
              title="点击可编辑"
              @click="openEdit(scope.row)"
              class="comment-text"
              v-if="role === 'teacher'"
            >
              {{
                scope.row.comment === null || scope.row.comment === ''
                  ? '无'
                  : scope.row.comment
              }}
            </a>
            <span v-if="role == 'admin'">{{
              scope.row.comment === null || scope.row.comment === ''
                ? '无'
                : scope.row.comment
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="adminStatus" label="教务审核">
          <template #default="scope">
            <el-tag v-if="scope.row.adminStatus == 0">未审核</el-tag>
            <el-tag type="danger" v-if="scope.row.adminStatus == 1"
              >审核不通过</el-tag
            >
            <el-tag type="success" v-if="scope.row.adminStatus == 2"
              >审核通过</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleApprove(scope.$index, scope.row)"
              >通过</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDisapprove(scope.$index, scope.row)"
              >不通过</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div v-if="role !== 'student'" style="margin-top: 20px">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          hide-on-single-page
          layout="total, sizes, prev, pager, next, jumper"
          style="justify-content: center"
        ></el-pagination>
      </div>

      <el-dialog
        title="编辑评价"
        v-model="dialogVisible"
        width="30%"
        v-if="role !== 'student'"
      >
        <el-input
          v-model="comment.text"
          :rows="5"
          type="textarea"
          placeholder="请输出评价..."
        />
        <div slot="footer" class="dialog-button">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitComment">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { useUserStore } from '@/store/modules/user';
import { UploadFilled } from '@element-plus/icons-vue';
import {
  apiPrequalList,
  apiPrequalApprove,
  apiPrequalDisapprove,
  apiPrequalComment,
  apiPrequalDownload,
} from '@/api/prequalification';

const UserStore = useUserStore();

export default {
  data() {
    return {
      tableData: [
        {
          authorName: '王小虎',
          filePath: 'ssss',
          updateTime: '2016-05-02',
          teacherName: 'qjk',
          teacherStatus: 0,
          comment: '垃圾',
          adminStatus: 0,
        },
      ],
      keywords: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 100,
      role: 'student',
      dataSelections: [],
      dialogVisible: false,
      loading: true,
      comment: {
        id: 0,
        text: '',
      },
    };
  },
  created() {
    this.role = UserStore.roles[0];
    const userStateStr = window.localStorage.getItem('userState');
    const userStateObj = JSON.parse(userStateStr);
    this.token = userStateObj.token;
    this.role = userStateObj.roles[0];
    console.log('学生预审表 role', this.role);
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      apiPrequalList({
        page: this.pageIndex,
        limit: this.pageSize,
        key: this.keywords,
      }).then((data) => {
        this.loading = false;
        if (data && data.code === 0) {
          this.tableData = data.data.records;
          this.totalPage = data.data.total;
        } else {
          this.tableData = [];
        }
      });
    },
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getTableData();
    },
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.dataSelections = val;
    },
    batchApprove() {
      if (this.dataSelections.length > 0) {
        this.approve(0);
      }
    },
    batchDisapprove() {
      if (this.dataSelections.length > 0) {
        this.disapprove(0);
      }
    },

    handleApprove(index, row) {
      this.approve(row.id);
    },

    handleDisapprove(index, row) {
      this.disapprove(row.id);
    },

    approve(id) {
      var ids = id
        ? [id]
        : this.dataSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        `确定[id=${ids.join(',')}]${id ? '审核通过' : '批量通过'}?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        apiPrequalApprove(ids).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getTableData();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    disapprove(id) {
      var ids = id
        ? [id]
        : this.dataSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        `确定[id=${ids.join(',')}]${id ? '审核不通过' : '批量不通过'}?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        apiPrequalDisapprove(ids).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getTableData();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },

    openEdit(row) {
      this.dialogVisible = true;
      this.comment.id = row.id;
      this.comment.text = row.comment;
    },

    submitComment() {
      apiPrequalComment(this.comment.id, this.comment.text).then((data) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dialogVisible = false;
              this.getTableData();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    handleChange(uploadFile, uploadFiles) {},

    uploadSuccess(uploadFile, uploadFiles) {
      console.log(uploadFile);
      this.$message({
        message: '文件上传成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.getTableData();
        },
      });
    },

    uploadFail(uploadFile, uploadFiles) {
      this.$message.error(uploadFile.msg);
    },

    beforeUpload(uploadRawFile) {
      var testmsg = uploadRawFile.name.substring(
        uploadRawFile.name.lastIndexOf('.') + 1
      );
      const extension =
        testmsg === 'doc' || testmsg === 'docx' || testmsg === 'pdf';
      if (!extension) {
        this.$message({
          message: '文件类型不支持',
          type: 'error',
        });
        return false;
      } else if (uploadRawFile.size / 1024 / 1024 > 10) {
        this.$message({
          message: '文件太大',
          type: 'error',
        });
        return false;
      }
      return true;
    },

    downLoad(id, fileName) {
      apiPrequalDownload(id, fileName).then((data) => {
        const content = data;
        const blob = new Blob([content]);
        if ('download' in document.createElement('a')) {
          //非IE下载
          const a = document.createElement('a');
          a.download = fileName;
          a.style.display = 'none';
          a.href = window.URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(a.href);
          document.body.removeChild(a);
        } else {
          //IE10+下载
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(blob, _this.selected);
          } else {
            let URL = window.URL || window.webkitURL;
            let downloadUrl = URL.createObjectURL(blob);
            window.location = downloadUrl;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.comment-text {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comment-text:hover {
  color: blueviolet;
  cursor: pointer;
}

.dialog-button {
  text-align: center;
  margin-top: 20px;
}
</style>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <!-- 上传模块 -->
      <div v-if="role === 'student'">
        <el-upload
          class="upload-demo"
          drag
          action="http://localhost:9100/defense/defform/upload"
          :on-change="handleChange"
          :auto-upload="true"
          :on-success="uploadSuccess"
          :show-file-list="false"
          :on-error="uploadFail"
          :before-upload="beforeUpload"
          :headers="{ token: this.token }"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖动文件到这儿或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">
              docx, doc, pdf files with a size less than 10mb
            </div>
          </template>
        </el-upload>
      </div>

      <!-- 学生端操作 -->
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 20px"
        border
        v-if="role === 'student'"
        v-loading="loading"
      >
        <el-table-column prop="authorName" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="filePath" label="预审表" width="180">
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
        <el-table-column prop="updateTime" label="修改时间" width="180">
        </el-table-column>
        <el-table-column prop="teacherName" label="导师"> </el-table-column>
        <el-table-column prop="teacherStatus" label="导师审核">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.teacherStatus == 0"
              >未审核</el-tag
            >
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
                scope.row.comment === null || scope.row.comment === ""
                  ? "无"
                  : scope.row.comment
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="adminStatus" label="教务审核">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.adminStatus == 0"
              >未审核</el-tag
            >
            <el-tag type="danger" v-if="scope.row.adminStatus == 1"
              >审核不通过</el-tag
            >
            <el-tag type="success" v-if="scope.row.adminStatus == 2"
              >审核通过</el-tag
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 顶部栏操作 -->
      <div
        style="margin-top: 20px; margin-bottom: 20px"
        v-if="role !== 'student'"
      >
        <el-form
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getTableData()"
        >
          <el-form-item>
            <el-input
              v-model="keywords"
              placeholder="查询内容"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getTableData()">查询</el-button>
            <!-- <el-button type="primary" @click="batchApprove()" :disabled="dataSelections.length <= 0">全部通过</el-button>
            <el-button type="danger" @click="batchDisapprove()" :disabled="dataSelections.length <= 0">全部不通过</el-button> -->
          </el-form-item>
        </el-form>
      </div>

      <!-- 老师端操作 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-if="role !== 'student'"
        v-loading="loading"
      >
        <el-table-column label="头像" width="100">
          <div>
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </div>
        </el-table-column>
        <el-table-column prop="authorName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="filePath" label="预审表" width="150">
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
        <el-table-column prop="updateTime" label="修改时间" width="200">
        </el-table-column>
        <el-table-column prop="teacherName" label="导师" width="100"> </el-table-column>
        <el-table-column prop="teacherStatus" label="导师审核" width="200">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.teacherStatus == 0"
              >未审核</el-tag
            >
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
                scope.row.comment === null || scope.row.comment === ""
                  ? "无"
                  : scope.row.comment
              }}
            </a>
            <span v-if="admin">{{
              scope.row.comment === null || scope.row.comment === ""
                ? "无"
                : scope.row.comment
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="adminStatus" label="教务审核" width="200">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.adminStatus == 0"
              >未审核</el-tag
            >
            <el-tag type="danger" v-if="scope.row.adminStatus == 1"
              >审核不通过</el-tag
            >
            <el-tag type="success" v-if="scope.row.adminStatus == 2"
              >审核通过</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              v-if="action === false"
              @click="handleApprove(scope.$index, scope.row)"
              >通过</el-button
            >
            <el-button
              size="small"
              v-if="action === false"
              type="danger"
              @click="handleDisapprove(scope.$index, scope.row)"
              >不通过</el-button
            >
            <el-tag type="success" v-if="action === true">已进行操作</el-tag>
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
import { useUserStore } from "@/store/modules/user";
import { UploadFilled } from "@element-plus/icons-vue";

const UserStore = useUserStore();

export default {
  data() {
    return {
      tableData: [
        {
          authorName: "王小虎",
          filePath: "ssss",
          updateTime: "2016-05-02",
          teacherName: "qjk",
          teacherStatus: 0,
          comment: "垃圾",
          adminStatus: 0,
        },
      ],
      keywords: "",
      pageIndex: 1,
      pageSize: 10,
      totalPage: 100,
      role: "student",
      dataSelections: [],
      dialogVisible: false,
      loading: true,
      action: false,
      token: "",
      comment: {
        id: 0,
        text: "",
      },
    };
  },
  created() {
    this.role = UserStore.roles[0];
    // todo：这里需要修改，改为本地获取
    const userStateStr = window.localStorage.getItem("userState");
    const userStateObj = JSON.parse(userStateStr);
    this.token = userStateObj.token;
    this.role = userStateObj.roles[0];
    console.log(this.role);
    this.getTableData();
    // console.log(this.token)
  },
  methods: {
    getTableData() {
      this.loading = true;
      this.$request
        .get("http://localhost:9100/defense/defform/list", {
          params: {
            page: this.pageIndex,
            limit: this.pageSize,
            key: this.keywords,
          },
        })
        .then(({ data }) => {
          this.loading = false;
          if (data && data.code === 0) {
            // console.log(data)
            this.tableData = data.page.records;
            this.totalPage = data.page.total;
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
      // console.log(id)
      this.$confirm(`确定让这篇论文审核通过吗? 注意该过程不可逆`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$request
          .post("http://localhost:9100/defense/defform/approve?id=" + id)
          .then(({ data }) => {
            this.action = true;
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
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
      this.$confirm(`确定让这篇论文审核通过吗? 注意该过程不可逆`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$request
          .post("http://localhost:9100/defense/defform/disapprove?id=" + id)
          .then(({ data }) => {
            this.action = true;
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
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
      this.$request
        .post(
          `http://localhost:9100/defense/defform/comment/${this.comment.id}`,
          this.comment.text
        )
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
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
        message: "文件上传成功",
        type: "success",
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
        uploadRawFile.name.lastIndexOf(".") + 1
      );
      const extension =
        testmsg === "doc" || testmsg === "docx" || testmsg === "pdf";
      if (!extension) {
        this.$message({
          message: "文件类型不支持",
          type: "error",
        });
        return false;
      } else if (uploadRawFile.size / 1024 / 1024 > 10) {
        this.$message({
          message: "文件太大",
          type: "error",
        });
        return false;
      }
      return true;
    },
    downLoad(id, fileName) {
      this.$request
        .get(
          `http://localhost:9100/defense/defform/download/${id}/${fileName}`,
          {
            responseType: "blob",
          }
        )
        .then(({ data }) => {
          const content = data;
          const blob = new Blob([content]);
          if ("download" in document.createElement("a")) {
            //非IE下载
            const a = document.createElement("a");
            a.download = fileName;
            a.style.display = "none";
            a.href = window.URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
          } else {
            //IE10+下载
            if (typeof window.navigator.msSaveBlob !== "undefined") {
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
  
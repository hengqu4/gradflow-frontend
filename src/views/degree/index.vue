<template>
  <div class="app-container">
    <div class="app-container-inner">
      <!-- 顶部栏操作 -->
      <div
        style="margin-bottom: 20px"
        v-if="role === 'student'"
        v-loading="loading"
      >
        <!-- <h2>学位申请表</h2> -->

        <!-- 学生端操作 -->
        <!-- <div v-if="!canUpload">
          <div style="font-size: 20px">
            <div class="display-center">您没有访问权限！</div>
            <div class="display-center">请检查毕业答辩是否通过。</div>
          </div>
          <div class="display-center">
            <img
              style="width: 40%"
              src="@/assets/403_images/403.png"
              alt="403"
            />
          </div>
        </div> -->
        <div>
          <el-card style="margin: 15px" header="学位申请表" class="card-box">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <el-form :model="myform" label-width="100px" style="width: 50%">
                <el-form-item label="学号" :rules="[{ required: true }]">
                  <el-input v-model="myform.authorId" />
                </el-form-item>
                <el-form-item label="姓名" :rules="[{ required: true }]">
                  <el-input v-model="myform.authorName" />
                </el-form-item>
                <el-form-item label="学位" :rules="[{ required: true }]">
                  <el-select v-model="region" placeholder="请选择你的学位">
                    <el-option label="硕士" value="硕士" />
                    <el-option label="本科" value="本科" />
                  </el-select>
                </el-form-item>
                <el-form-item label="毕业时间" :rules="[{ required: true }]">
                  <el-date-picker
                    v-model="myform2.date1"
                    type="date"
                    placeholder="请选择日期"
                  />
                </el-form-item>
                <el-form-item label="毕业去向" :rules="[{ required: true }]">
                  <el-checkbox-group v-model="type">
                    <el-checkbox label="待业" name="type" />
                    <el-checkbox label="就业" name="type" />
                    <el-checkbox label="升学" name="type" />
                    <el-checkbox label="其他" name="type" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="去向省份" :rules="[{ required: true }]">
                  <el-input v-model="myform2.shengfen" />
                </el-form-item>
                <el-form-item label="工作单位" :rules="[{ required: true }]">
                  <el-input v-model="myform2.work" type="textarea" />
                </el-form-item>
                <el-form-item label="补充">
                  <el-input v-model="myform2.desc" type="textarea" />
                </el-form-item>
                <div style="display: flex; justify-content: center">
                  <el-button type="primary" @click="onSubmit">提交</el-button>
                  <el-button>取消</el-button>
                </div>
              </el-form>
            </div>
          </el-card>
          <el-card style="margin: 15px" header="申请记录">
            <el-table
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="loading"
            >
              <el-table-column
                prop="teacherName"
                label="导师姓名"
                width="150"
              />
              <el-table-column label="学生相关信息">
                <el-table-column
                  prop="authorName"
                  label="学生姓名"
                  width="120"
                />
                <el-table-column el-table-column label="学位审核信息">
                  <el-table-column prop="updateTime" label="修改时间" />
                  <el-table-column prop="otherStuValues" label="备注">
                    <template #default="scope">
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="scope.row.otherStuValues"
                      >
                        <div class="tooltip-ellipsis">
                          {{ scope.row.otherStuValues }}
                        </div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="teacherStatus" label="导师审核">
                    <template #default="scope">
                      <el-tag v-if="scope.row.teacherStatus == 0"
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
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
      <!-- <div>
        <el-divider content-position="left" v-if="role === 'student'"
          >申请记录</el-divider
        >
      </div> -->

      <div v-if="role !== 'student'">
        <el-descriptions title="审核学位申请"></el-descriptions>
        <div style="margin-top: 20px"></div>
        <!-- 老师端操作 -->
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <el-table-column prop="teacherName" label="导师姓名" width="150" />
          <el-table-column label="学生相关信息">
            <el-table-column prop="authorName" label="学生姓名" width="120" />
            <el-table-column el-table-column label="学位审核信息">
              <el-table-column prop="updateTime" label="修改时间" />
              <el-table-column prop="otherStuValues" label="备注">
                <template #default="scope">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="scope.row.otherStuValues"
                  >
                    <div class="tooltip-ellipsis">
                      {{ scope.row.otherStuValues }}
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
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
              <el-table-column prop="adminStatus" label="教务审核">
                <template #default="scope">
                  <el-tag v-if="scope.row.adminStatus == 0">未审核</el-tag>
                  <el-tag type="danger" v-if="scope.row.adminStatus == 1"
                    >审核不通过
                  </el-tag>
                  <el-tag type="success" v-if="scope.row.adminStatus == 2"
                    >审核通过
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <div
                    v-if="
                      (role == 'teacher' && scope.row.teacherStatus > 0) ||
                      (role == 'admin' && scope.row.adminStatus > 0)
                    "
                  >
                    已审核
                  </div>
                  <div
                    v-else-if="
                      role == 'teacher' ||
                      (role == 'admin' && scope.row.teacherStatus == 2)
                    "
                  >
                    <el-button
                      size="small"
                      @click="handleApprove(scope.$index, scope.row)"
                      type="primary"
                      >通过
                    </el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDisapprove(scope.$index, scope.row)"
                      >不通过
                    </el-button>
                  </div>
                  <div
                    v-else-if="role == 'admin' && scope.row.teacherStatus == 1"
                  >
                    导师审核未通过
                  </div>

                  <div v-else>待导师审核</div>
                </template>

                <!-- <template #default="scope">
                <el-button
                  size="small"
                  v-if="action === false"
                  @click="handleApprove(scope.$index, scope.row)"
                  type="primary"
                >
                  通过
                </el-button>
                <el-button
                  size="small"
                  v-if="action === false"
                  type="danger"
                  @click="handleDisapprove(scope.$index, scope.row)"
                >
                  不通过
                </el-button>
                <el-tag type="success" v-if="action === true"
                  >已进行操作
                </el-tag>
              </template> -->
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>

        <div style="margin-top: 20px">
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
          >
          </el-pagination>
        </div>

        <el-dialog title="编辑评价" v-model="dialogVisible" width="30%">
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
  </div>
</template>
<script>
import { useUserStore } from '@/store/modules/user';
import { UploadFilled } from '@element-plus/icons-vue';
import { StarFilled } from '@element-plus/icons-vue';
import { reactive } from 'vue';
import {
  apiDegreeList,
  apiDegreeApprove,
  apiDegreeDisapprove,
  apiDegreeComment,
} from '@/api/degree';
import { apiDefenseList } from '@/api/defense';

const UserStore = useUserStore();

export default {
  data() {
    return {
      tableData: [
        // {
        //   authorName: '',
        //   filePath: '',
        //   updateTime: '',
        //   teacherName: '',
        //   teacherStatus: 0,
        //   comment: '',
        //   adminStatus: 0,
        //   otherValues: '',
        //   otherStuValues: '',
        // },
      ],
      myform: reactive({
        authorId: 51255000000,
        authorName: '',
      }),
      myform2: reactive({
        date1: '',
        shengfen: '',
        work: '',
        desc: '',
      }),
      type: [],
      region: '',
      keywords: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 100,
      role: 'student',
      dataSelections: [],
      dialogVisible: false,
      loading: true,
      action: false,
      token: '',
      comment: {
        id: 0,
        text: '',
      },
      canUpload: false,
    };
  },
  created() {
    this.role = UserStore.roles[0];
    // todo：这里需要修改，改为本地获取
    const userStateStr = window.localStorage.getItem('userState');
    const userStateObj = JSON.parse(userStateStr);
    this.token = userStateObj.token;
    this.role = userStateObj.roles[0];

    console.log('进入学位申请', this.role);
    this.getTableData();

    // if (this.role == 'student') {
    //   apiDefenseList({
    //     page: this.pageIndex,
    //     limit: this.pageSize,
    //     key: this.keywords,
    //   }).then((data) => {
    //     if (data && data.code === 0) {
    //       this.loading = false;
    //       const records = data.data?.records;

    //       if (records.length > 0) {
    //         const record = records[records.length - 1];
    //         if (record.teacherStatus == 2 && record.adminStatus == 2) {
    //           this.canUpload = true;
    //         }
    //       }
    //       if (this.canUpload) {
    //         this.getTableData();
    //       }
    //     }
    //   });
    // } else {
    //   this.getTableData();
    // }
  },
  methods: {
    getTableData() {
      this.loading = true;

      apiDegreeList({
        page: this.pageIndex,
        limit: this.pageSize,
        key: this.keywords,
      }).then((data) => {
        this.loading = false;
        if (data && data.code === 0) {
          // console.log(data)
          this.tableData = data.page.records;
          // 遍历 tableData 数组，为每个对象的 otherValues 属性赋值
          this.tableData.forEach((item) => {
            item.otherValues =
              '请在所有流程结束后进行学位审批，请注意：该过程不可逆，若需修改请联系教务处。';
            item.otherStuValues =
              '您的申请已经提交，如果学位状态长时间没变化，请询问老师或者教务人员';
          });
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
    onSubmit() {
      this.mySubmit();
    },
    mySubmit() {
      this.$confirm(`请确定无误后进行提交`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        apiDegreeComment(this.myform).then((data) => {
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
    handleApprove(index, row) {
      this.approve(row.id);
    },
    handleDisapprove(index, row) {
      this.disapprove(row.id);
    },
    approve(id) {
      // console.log(id)
      this.$confirm(`确定让该学位申请通过吗? 注意该过程不可逆`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        apiDegreeApprove(id).then((data) => {
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

        // this.$request
        //   .post('http://localhost:9150/degree/degreeform/approve?id=' + id)
        //   .then(({ data }) => {
        //     this.action = true;
        //     if (data && data.code === 0) {
        //       this.$message({
        //         message: '操作成功',
        //         type: 'success',
        //         duration: 1500,
        //         onClose: () => {
        //           this.getTableData();
        //         },
        //       });
        //     } else {
        //       this.$message.error(data.msg);
        //     }
        //   });
      });
    },
    disapprove(id) {
      this.$confirm(`确定让该学位申请通过吗? 注意该过程不可逆`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        apiDegreeDisapprove(id).then((data) => {
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

        // this.$request
        //   .post('http://localhost:9150/degree/degreeform/disapprove?id=' + id)
        //   .then(({ data }) => {
        //     this.action = true;
        //     if (data && data.code === 0) {
        //       this.$message({
        //         message: '操作成功',
        //         type: 'success',
        //         duration: 1500,
        //         onClose: () => {
        //           this.getTableData();
        //         },
        //       });
        //     } else {
        //       this.$message.error(data.msg);
        //     }
        //   });
      });
    },
    openEdit(row) {
      this.dialogVisible = true;
      this.comment.id = row.id;
      this.comment.text = row.comment;
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

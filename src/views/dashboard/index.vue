<template>
  <div class="box">
    <el-row style="margin-bottom: 10px;">
      <el-col>
        <el-card>
          <basic-table
            :table-title="tableTitle"
            :table-data="tableData"
            :loading="loading"
            :search-form="searchForm"
            :is-operation-btn="true"
            @refresh="getPageList(listQuery)"
            @searchFormEmit2="searchFormEmit2"
          >
            <template v-slot:advsTotal="scope">
              <div style="color: #409EFF">
                {{ scope.row.advsTotal }}
              </div>
            </template>
            <template v-slot:ChatingQty="scope">
              <div style="color: #409EFF">
                {{ scope.row.ChatingQty }}
              </div>
            </template>
          </basic-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="'日期：' + choseDate" :visible.sync="dialogTableVisible" width="100%">
      <el-row :gutter="10" style="margin-bottom: 10px;">
        <el-col v-if="pieChartData.length" :span="8">
          <div class="pie">
            <el-card>
              <pie-chart :id="'1'" :pie-chart-data="pieChartData" :pie-title="'用户私聊消息数量'" />
            </el-card>
          </div>
        </el-col>
        <el-col v-if="pieChartData2.length" :span="8">
          <div class="pie">
            <el-card>
              <pie-chart :id="'2'" :pie-chart-data="pieChartData2" :pie-title="'用户私聊次数'" />
            </el-card>
          </div>
        </el-col>
        <el-col v-if="pieChartData3.length" :span="8">
          <div class="pie">
            <el-card>
              <div style="margin-bottom: 10px;">
                <!-- display: flex; justify-content: flex-end; -->
                <el-select
                  v-model="params3.deptName"
                  placeholder="请选择"
                  @change="handleOptions"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <pie-chart :id="'3'" :pie-chart-data="pieChartData3" :height="'410px'" :pie-title="'业务部广告发布情况('+ params3.deptName +')'" />
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import BasicTable from '@/components/BasicTable/index.vue'
import PieChart from './components/PieChart'
import { msgqtyofchatingchart, numofchatingchart, saleschart, statsreport } from '@/api/dashboard'
import moment from 'moment'
import { timeThree } from '@/utils/index'
export default {
  name: 'Dashboard',
  components: {
    PieChart, BasicTable
  },
  data() {
    return {
      dialogTableVisible: false,
      loading: false,
      loadingDate1: false,
      loadingDate2: false,
      loadingDate3: false,
      tableTitle: [
        {
          label: '日期',
          value: 'Date',
          show: true,
          type: 'text'
        },
        {
          label: '广告总数',
          value: 'advsTotal',
          show: true,
          type: 'slot',
          slot: 'advsTotal'
        },
        {
          label: '不重复广告总数',
          value: 'advTotal',
          show: true,
          type: 'text'
        },
        {
          label: '（单向）私聊次数',
          value: 'ChatingQty',
          show: true,
          type: 'slot',
          slot: 'ChatingQty'
        },
        {
          label: '今日累计在线人数',
          value: 'today',
          show: true,
          type: 'text'
        },
        {
          label: '一部',
          value: 'yibu',
          show: true,
          type: 'text'
        },

        {
          label: '二部',
          value: 'erbu',
          show: true,
          type: 'text'
        },
        {
          label: '操作',
          show: true,
          type: 'options',
          options: [
            {
              text: '查看报表',
              icon: '',
              type: 'primary',
              clickEvent: (row) => {
                this.operateCheck(row)
              }
            }
          ]
        }
      ],
      tableData: [],
      listQuery: {},
      searchForm: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            show: true,
            type: 'date',
            label: '日期',
            labelShow: false,
            name: 'Date'
          }
        ]
      },
      pieChartData: [],
      pieChartData2: [],
      pieChartData3: [],
      options: [
        {
          value: '信息一部',
          label: '信息一部'
        },
        {
          value: '信息二部',
          label: '信息二部'
        }

      ],
      params3: {
        deptName: '',
        deptDate: ''
      },
      choseDate: null
    }
  },
  created() {
    this.params3.deptName = this.options[0].value
    this.listQuery = {
      beginTime: timeThree()[1],
      endTime: timeThree()[0]
    }
    this.getPageList(this.listQuery)
  },
  methods: {
    // 操作列按钮
    operateCheck(row) {
      this.dialogTableVisible = true
      this.pieChartData = []
      this.pieChartData2 = []
      this.pieChartData3 = []
      this.choseDate = row.Date
      this.params3.deptDate = row.Date
      this.getPieData1(row.Date)
      this.getPieData2(row.Date)
      this.getPieData3(this.params3.deptName, row.Date)
    },
    handleOptions(v) {
      this.pieChartData3 = []
      this.params3.deptName = v
      this.getPieData3(this.params3.deptName, this.params3.deptDate)
    },
    getPieData1(v) {
      this.loadingDate1 = true
      msgqtyofchatingchart({ date: v }).then((res) => {
        if (res) {
          this.loadingDate1 = false
          const pieChartDataCoyp = []
          for (var key in res) {
            pieChartDataCoyp.push({ name: key, value: res[key] })
          }
          pieChartDataCoyp.forEach((item) => {
            for (var n = 1; n <= pieChartDataCoyp.length; n++) {
              var a = 'Interval' + [n]
              if (n <= 10) {
                if (item.name === a) {
                  item.name = [(n - 1) * 10 + 1 + '-' + n * 10]
                }
              } else {
                if (item.name === a) {
                  item.name = '>100'
                }
              }
            }
          })
          pieChartDataCoyp.forEach(item => {
            this.pieChartData.push({ name: '[' + item.name + ']', value: item.value })
          })
        }
      })
    },
    getPieData2(v) {
      this.loadingDate2 = true
      numofchatingchart({ date: v }).then((res) => {
        if (res) {
          this.loadingDate2 = false
          const pieChartDataCoyp = []
          for (var key in res) {
            pieChartDataCoyp.push({ name: key, value: res[key] })
          }
          pieChartDataCoyp.forEach((item) => {
            for (var n = 1; n <= pieChartDataCoyp.length; n++) {
              var a = 'Interval' + [n]
              if (n <= 10) {
                if (item.name === a) {
                  item.name = [(n - 1) * 10 + 1 + '-' + n * 10]
                }
              } else {
                if (item.name === a) {
                  item.name = '>100'
                }
              }
            }
          })
          pieChartDataCoyp.forEach(item => {
            this.pieChartData2.push({ name: '[' + item.name + ']', value: item.value })
          })
        }
      })
    },
    getPieData3(n, v) {
      this.loadingDate3 = true
      saleschart({ groupName: n, date: v }).then((res) => {
        if (res) {
          this.loadingDate3 = false
          this.name = res.DeptName
          delete res.DeptName
          const pieChartDataCoyp = []
          for (var key in res) {
            pieChartDataCoyp.push({ name: key, value: res[key] })
          }
          pieChartDataCoyp.forEach((item) => {
            for (var n = 1; n <= pieChartDataCoyp.length; n++) {
              var a = 'Interval' + [n]
              if (n <= 10) {
                if (item.name === a) {
                  item.name = [(n - 1) * 10 + 1 + '-' + n * 10]
                }
              } else {
                if (item.name === a) {
                  item.name = '>100'
                }
              }
            }
          })
          pieChartDataCoyp.forEach(item => {
            this.pieChartData3.push({ name: '[' + item.name + ']', value: item.value })
          })
        }
      })
    },
    getPageList(v) {
      this.loading = true
      statsreport(v).then((res) => {
        this.loading = false
        res.forEach((item) => {
          item.Date = this.myDateFormat(item.Date),
          item.advsTotal = item.ADQty1 + item.ADQty2, // 广告总数
          item.pcTotal = item.PcQty1 + item.PcQty2, // pc端广告
          item.andriodTotal = item.AndriodQty1 + item.AndriodQty2, // 手机端广告
          item.advTotal = (item.ADQty1 + item.ADQty2) - (item.NorepeatADQty1 + item.NorepeatADQty2), // 不重复广告
          item.loginTotal = item.LoginPCQty + item.LoginAndriodQty // 总在线人数
        })
        this.tableData = res
      })
    },
    searchFormEmit2(v) {
      this.tableData = []
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList(this.listQuery)
    },
    myDateFormat(date, fmt = 'YYYY-MM-DD') {
    // eslint-disable-next-line no-undef
      return moment(date).format(fmt)
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 30px 20px 20px 20px;
  background-color: #F2F6FC;
  min-height: 100vh;
}
// .pie ::v-deep .el-card__body{
//   padding: 0
// }
</style>

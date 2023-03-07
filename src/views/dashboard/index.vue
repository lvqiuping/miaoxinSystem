<template>
  <div class="box ">
    <el-row style="margin-bottom: 30px;">
      <el-col>
        <el-card>
          <basic-table
            :table-title="tableTitle"
            :table-data="tableData"
            :loading="loading"
            :multiple-table="false"
            :search-form="searchForm"
            @refresh="getPageList(listQuery)"
            @searchFormEmit2="searchFormEmit2"
          >
            <template v-slot:all="scope">
              <el-tag :type="'primary'">
                {{ scope.row.all }}
              </el-tag>
            </template>
            <template v-slot:alls="scope">
              <el-tag :type="'warning'">
                {{ scope.row.alls }}
              </el-tag>
            </template>
            <template v-slot:allLogin="scope">
              <el-tag :type="'success'">
                {{ scope.row.allLogin }}
              </el-tag>
            </template>
          </basic-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-bottom: 10px;">
      <el-col :span="8">
        <el-card>
          <span>日期：</span>
          <el-date-picker
            v-model="date1"
            type="date"
            :clearable="false"
            :loading="loadingDate1"
            placeholder="选择日期"
            style="margin-bottom: 10px;"
            @change="handle1"
          />
          <pie-chart v-if="pieChartData.length" :id="'1'" :pie-chart-data="pieChartData" :pie-title="'用户私聊消息数量'" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <span>日期：</span>
          <el-date-picker
            v-model="date2"
            type="date"
            :clearable="false"
            :loading="loadingDate2"
            placeholder="选择日期"
            style="margin-bottom: 10px;"
            @change="handle2"
          />
          <pie-chart v-if="pieChartData2.length" :id="'2'" :pie-chart-data="pieChartData2" :pie-title="'用户私聊次数'" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div style="display: inline-block; margin-bottom: 10px;">
            <span>日期：</span>
            <el-date-picker
              v-model="params3.date3"
              type="date"
              :clearable="false"
              :loading="loadingDate3"
              placeholder="选择日期"
              style="margin-right: 10px;"
              @change="handle3"
            />
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
          <pie-chart v-if="pieChartData3.length" :id="'3'" :pie-chart-data="pieChartData3" :pie-title="'业务部广告发布情况('+ params3.deptName +')'" />
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import BasicTable from '@/components/BasicTable/index.vue'
import PieChart from './components/PieChart'
import { msgqtyofchatingchart, numofchatingchart, saleschart, statsreport } from '@/api/dashboard'
import moment from 'moment'
export default {
  name: 'Dashboard',
  components: {
    PieChart, BasicTable
  },
  data() {
    return {
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
          label: '单向私聊次数',
          value: 'ChatingQty',
          show: true,
          type: 'text'
        },
        {
          label: 'PC端登录人次',
          value: 'LoginPCQty',
          show: true,
          type: 'text'
        },
        {
          label: '手机端登录人次',
          value: 'LoginAndriodQty',
          show: true,
          type: 'text'
        },
        {
          label: '一部广告总数',
          value: 'ADQty1',
          show: true,
          type: 'text'
        },
        {
          label: '一部不重复广告总数',
          value: 'NorepeatADQty1',
          show: true,
          type: 'text'
        },
        {
          label: '二部广告总数',
          value: 'ADQty2',
          show: true,
          type: 'text'
        },
        {
          label: '二部不重复广告总数',
          value: 'NorepeatADQty2',
          show: true,
          type: 'text'
        },
        {
          label: '今日广告总数',
          value: 'all',
          show: true,
          type: 'slot',
          slot: 'all'
        },
        {
          label: '今日不重复广告总数',
          value: 'alls',
          show: true,
          type: 'slot',
          slot: 'alls'
        },
        {
          label: '今日累计登录人次',
          value: 'allLogin',
          show: true,
          type: 'slot',
          slot: 'allLogin'
        }
      ],
      tableData: [],
      listQuery: {
        Date: this.myDateFormat(new Date())
      },
      searchForm: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            show: true,
            type: 'dateType2',
            label: '日期',
            labelShow: false,
            name: 'Date'
          }
        ]
      },
      pieChartData: [],
      pieChartData2: [],
      pieChartData3: [],
      date1: this.myDateFormat(new Date()),
      date2: this.myDateFormat(new Date()),
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
        date3: this.myDateFormat(new Date()),
        deptName: ''
      }
    }
  },
  created() {
    this.getPieData1()
    this.getPieData2()
    this.params3.deptName = this.options[0].value
    this.getPieData3(this.params3.deptName, this.params3.date3)
    this.getPageList(this.listQuery)
  },
  methods: {
    handleOptions(v) {
      this.pieChartData3 = []
      this.params3.deptName = v
      this.getPieData3(this.params3.deptName, this.params3.date3)
    },
    handle1() {
      this.pieChartData = []
      this.date1 = this.myDateFormat(this.date1)
      this.getPieData1()
    },
    handle2() {
      this.pieChartData2 = []
      this.date2 = this.myDateFormat(this.date2)
      this.getPieData2()
    },
    handle3() {
      this.pieChartData3 = []
      this.params3.date3 = this.myDateFormat(this.params3.date3)
      this.getPieData3(this.params3.deptName, this.params3.date3)
    },
    getPieData1() {
      this.loadingDate1 = true
      msgqtyofchatingchart({ date: this.date1 }).then((res) => {
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
    getPieData2() {
      this.loadingDate2 = true
      numofchatingchart({ date: this.date2 }).then((res) => {
        if (res) {
          this.loadingDate2 = false
          // for (const key in res) {
          //   this.pieChartData2.push({ name: key, value: res[key] })
          // }
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
    getPieData3(v, p) {
      this.loadingDate3 = true
      saleschart({ groupName: v, date: p }).then((res) => {
        if (res) {
          this.loadingDate3 = false
          this.name = res.DeptName
          delete res.DeptName
          // for (const key in res) {
          //   this.pieChartData3.push({ name: key, value: res[key] })
          // }
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
      statsreport({ date: v.Date }).then((res) => {
        this.loading = false
        res.Date = this.myDateFormat(res.Date)
        res.all = res.ADQty1 + res.ADQty2
        res.alls = res.NorepeatADQty1 + res.NorepeatADQty2
        res.allLogin = res.LoginPCQty + res.LoginAndriodQty
        this.tableData = Array(res)
      })
    },
    searchFormEmit2(v) {
      this.tableData = []
      v.Date = this.myDateFormat(v.Date)
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
</style>

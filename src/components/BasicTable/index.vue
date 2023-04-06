<!-- eslint-disable vue/no-parsing-error -->
<!-- eslint-disable vue/valid-v-bind -->
<template>
  <div>
    <div style="display: flex;flex-direction: row;justify-content: space-between; ">
      <div v-if="leftButtonGroup" style="display: flex;flex-direction: row;justify-content: space-between;">
        <search-form
          :search-form="searchForm"
          @searchFormEmit="searchFormEmit"
        />
        <operation-button
          :button-group="buttonGroup"
          @operateEmit="operateEmit"
        />
      </div>
      <div v-if="rightButtonGroup" style="display: flex;flex-direction: row;justify-content: space-between; height: 40px; margin-bottom: 20px;">
        <el-button type="" icon="el-icon-refresh" style="margin-right: 10px; margin-left: 10px;" @click="refresh" />
        <el-popover
          placement="bottom"
          width="90"
          trigger="click"
        >
          <el-button slot="reference" type="" icon="el-icon-menu" />
          <div v-for="(item, index) in tableTitle" :key="index">
            <el-checkbox v-model="item.show" :label="item.label" size="large" />
          </div>
        </el-popover>
      </div>
    </div>
    <el-table
      v-if="showTable"
      ref="multipleTableRef"
      v-loading="loading"
      :data="tableData"
      :height="height"
      :row-class-name="rowClassName"
      :header-cell-style="headerCellStyle"
      :header-cell-class-name="leftheaderStyle"
      style="width: 100%"
      border
      @select="select"
    >
      <!-- @sort-change="sortChange" -->
      <el-table-column v-if="multipleTable === true" type="selection" width="55" />
      <el-table-column
        v-for="(item, index) in tableTitle.filter(item2 => item2.show)"
        :key="index"
        :prop="item.value"
        :label="item.label"
        :sortable="item.sortable === true"
        align="center"
      >
        <el-table-column v-if="item.value === 'today'">
          <el-table-column
            label="总在线人数"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="'success'">
                {{ scope.row.loginTotal }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="LoginPCQty"
            label="pc端在线人数"
            align="center"
          />
          <el-table-column
            prop="LoginAndriodQty"
            label="手机端在线人数"
            align="center"
          />
        </el-table-column>
        <el-table-column v-if="item.value === 'yibu'">
          <el-table-column
            prop="ADQty1"
            label="一部广告总数"
            align="center"
          />
          <el-table-column
            prop="NorepeatADQty1"
            label="一部不重复广告数"
            align="center"
          />
        </el-table-column>
        <el-table-column v-if="item.value === 'erbu'">
          <el-table-column
            prop="ADQty2"
            label="二部广告总数"
            align="center"
          />
          <el-table-column
            prop="NorepeatADQty2"
            label="二部不重复广告数"
            align="center"
          />
        </el-table-column>
        <template v-slot="scope">
          <div v-if="item.type == 'text'">
            {{ scope.row[item.value] }}
          </div>
          <div v-else-if="item.type == 'slot'">
            <slot :name="item.slot" :row="scope.row" :column="item.prop" :index="scope.$index" />
          </div>
          <div v-else-if="item.type == 'router'">
            <router-link :to="{path: item.path, query: Object.assign({}, item.query, getQuery(item.params, scope.row))}" style="color: #409EFF">
              <!-- Object.assign([], item.query, { [item.queryKey]: scope.row[item.queryValue] } ) -->
              <!-- onlyHasPhone: item.onlyHasPhone, groupQQ: scope.row.groupQq -->
              {{ scope.row[item.value] }}
            </router-link>
          </div>
          <div v-else-if="item.type == 'options'">
            <el-button
              v-for="(btn, btnKey) in item.options"
              :key="btnKey"
              :type="btn.type && btn.type !== '' ? btn.type: 'primary'"
              :icon="btn.icon ? btn.icon : ''"
              size="mini"
              @click="btn.clickEvent(scope.row)"
            >
              {{ btn.text }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm/index.vue'
import OperationButton from '@/components/OperationButton/index.vue'
export default {
  name: 'BasicTable',
  components: { SearchForm, OperationButton },
  props: {
    // 基本
    tableTitle: { type: Array, default: Array },
    tableData: { type: Array, default: Array },
    multipleTable: { type: Boolean, default: true },
    pagination: { type: Boolean, default: true },
    showTable: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    height: { type: Number, default: null },
    // eslint-disable-next-line vue/require-valid-default-prop
    headerCellStyle: { type: Function, default: function() {
      return { background: '#f5f7fa', color: '#909399' }
    } },
    // 特别操作
    searchForm: { type: Object, default: null },
    isShowGroup: { type: Boolean, default: true },
    buttonGroup: { type: Object, default: null },
    leftButtonGroup: { type: Boolean, default: true },
    rightButtonGroup: { type: Boolean, default: true },
    defaultDate: { type: String, default: '' }

  },
  data() {
    return {
      multipleSelection: [],
      total: 0,
      b_data: {},
      temp: {
        orderBy: ''
      }
    }
  },
  methods: {
    getQuery(params, row) {
      const p = {}
      for (const i in params) {
        p[i] = row[params[i]]
      }
      return p
    },
    leftheaderStyle(row) {
      // 隐藏表头复选框
      if (row.columnIndex === 0 && row.rowIndex === 0) {
        return 'seltAllbtnDis'
      }
      // 合并表头
      if (row.rowIndex === 1) {
        return 'header-row-display'
      }
    },
    // 序号显示
    rowClassName({ row, rowIndex }) {
      row.index = rowIndex
      row.xh = rowIndex + 1
    },
    searchFormEmit(v) {
      this.b_data = v
      this.$emit('searchFormEmit2', this.b_data)
    },
    operateEmit(v) {
      this.$emit('operateEmit2', v, this.multipleSelection)
    },
    select(selection, row) {
      // 清除 所有勾选项
      this.$refs.multipleTableRef.clearSelection()
      // // 当表格数据都没有被勾选的时候 就返回
      // // 主要用于将当前勾选的表格状态清除
      if (selection.length === 0) return
      this.$refs.multipleTableRef.toggleRowSelection(row, true)
      this.multipleSelection[0] = row
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>
::v-deep .seltAllbtnDis .cell {
    visibility: hidden;
}
::v-deep .header-row-display {
  display: none;
}
</style>

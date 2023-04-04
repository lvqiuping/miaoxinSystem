<template>
  <div>
    <el-form ref="searchForm" :model="temp" label-position="" label-width="" style="display: flex;height: 40px;">
      <template>
        <div v-for="(field, index) in searchForm.fields" :key="index">
          <div v-if="field.show">
            <el-form-item v-if="field.type === 'input'" :label="field.labelShow ? field.label : ''" style="display: flex; margin-right: 10px;">
              <el-input
                v-model.trim="temp[field.name]"
                clearable
                :placeholder="field.label"
                @keyup.enter.native="searching()"
              />
            </el-form-item>
            <el-form-item v-if="field.type === 'select'" style="margin-right: 10px;">
              <el-select v-model="temp[field.name]" :placeholder="field.label" @change="searching()">
                <el-option
                  v-for="item in field.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="field.type === 'date'" style="margin-right: 10px;">
              <span>{{ field.label }}：</span>
              <el-date-picker
                v-model="temp[field.name]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                value-format="yyyy-MM-dd"
                @change="searching()"
              />
            </el-form-item>
            <el-form-item v-if="field.type === 'dateType2'" style="margin-right: 10px;">
              <span>{{ field.label }}：</span>
              <el-date-picker
                v-model="temp[field.name]"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                style="margin-right: 10px;"
              />
            </el-form-item>
          </div>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { timeThree } from '@/utils/index'
export default {
  name: 'SearchForm',
  props: {
    searchForm: { type: Object, default: null },
    defaultDate: { type: String, default: '' }
  },
  data() {
    return {
      temp: {
        Date: [new Date(timeThree()[1]), new Date(timeThree()[0])]
      }
    }
  },
  // watch: {
  //   // 监听对象temp，
  //   temp: {
  //     handler(newVal) {
  //       console.log('newVal', newVal)
  //       this.$emit('searchFormEmit', newVal)
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    myDateFormat(date, fmt = 'YYYY-MM-DD') {
    // eslint-disable-next-line no-undef
      return moment(date).format(fmt)
    },
    searching() {
      this.temp.beginTime = this.temp.Date[0]
      this.temp.endTime = this.temp.Date[1]
      this.$emit('searchFormEmit', this.temp)
    }
  }
}
</script>

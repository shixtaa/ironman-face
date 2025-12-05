<template>
  <div class="statistics">
    <div class="header all-center">
      <div class="title">人脸识别结果统计</div>
      <a-space :size="50">
        <span>今日新注册用户数：{{ statisticsData.today_total.toSeparatorString() }}</span>
        <span>人脸库样本用户数：{{ statisticsData.history_total.toSeparatorString() }}</span>
      </a-space>
    </div>
    <div class="filter">
      <a-space>
        <span>查询日期范围</span>
        <a-range-picker v-model:value="dateRange" :allow-clear="false" value-format="YYYY-MM-DD" @change="getInfo" />
      </a-space>
    </div>
    <div class="status-container">
      <div class="invoke">
        <div class="tr">
          <div class="sub-title">铁人接口调用情况</div>
          <a-row :gutter="20">
            <a-col :span="7">
              <div class="s-box all-center">
                调用总量：{{ statusData.tr.total.toSeparatorString() }}
              </div>
            </a-col>
            <a-col :span="7">
              <div class="s-box all-center">
                成功数：{{ statusData.tr.success_total.toSeparatorString() }}
              </div>
            </a-col>
            <a-col :span="7">
              <div class="s-box all-center">
                有结果返回：{{ statusData.tr.result_total.toSeparatorString() }}
              </div>
            </a-col>
            <a-col :span="3">
              <div class="arrow-box">
                <div class="bar"></div>
                <div class="triangle"><span></span></div>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="bd">
          <div class="sub-title">百度接口调用情况</div>
          <a-row :gutter="20">
            <a-col :span="7">
              <div class="s-box all-center">
                调用总量：{{ statusData.baidu.total.toSeparatorString() }}
              </div>
            </a-col>
            <a-col :span="7">
              <div class="s-box all-center">
                成功数：{{ statusData.baidu.success_total.toSeparatorString() }}
              </div>
            </a-col>
            <a-col :span="7">
              <div class="s-box all-center">
                有结果返回：{{ statusData.baidu.result_total.toSeparatorString() }}
              </div>
            </a-col>
            <a-col :span="3">
              <div class="arrow-box">
                <div class="bar"></div>
                <div class="triangle"><span></span></div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="compare">
        <div class="sub-title">查询结果对比情况</div>
        <a-space :size="20">
          <div class="box all-center">
            返回结果用户相同：{{ statusData.result.same_total.toSeparatorString() }}
          </div>
          <div class="box all-center">
            返回结果用户不同：{{ statusData.result.unsame_total.toSeparatorString() }}
          </div>
        </a-space>
      </div>
    </div>
    <div class="chart-container">
      <div class="sub-title">近30日查询结果</div>
      <div class="chart" ref="chartRef"></div>
    </div>
    <div class="table-container">
      <div class="sub-title">接口调用及对比记录</div>
      <div class="filter">
        <a-space>
          <a-input v-model:value="querySearch.userid" placeholder="用户ID" style="width:200px;"></a-input>
          <a-select v-model:value="querySearch.result" placeholder="是否有结果" style="width:200px;">
            <a-select-option :value="0"> 百度有铁人有 </a-select-option>
            <a-select-option :value="1"> 百度有铁人无 </a-select-option>
            <a-select-option :value="2"> 百度无铁人有 </a-select-option>
            <a-select-option :value="3"> 百度无铁人无 </a-select-option>
          </a-select>
          <a-select v-model:value="querySearch.issame" placeholder="用户是否一致" style="width:200px;">
            <a-select-option :value="0"> 一致 </a-select-option>
            <a-select-option :value="1"> 不一致 </a-select-option>
          </a-select>
          <a-range-picker v-model:value="searchRange" value-format="YYYY-MM-DD" />
          <a-button type="primary" @click="searchPageList">查询</a-button>
          <a-button @click="reset">重置</a-button>
        </a-space>
        <a-button>导出</a-button>
      </div>
      <div class="table">
        <a-table :dataSource="tableData" :columns="tableColumns" size="small" bordered :pagination="false"
          :loading="tableLoading" :scroll="{ y: '50vh' }">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'xh'">
              <span>{{ (pagination.pageIndex - 1) * pagination.pageSize + index + 1 }}</span>
            </template>
            <template v-if="column.dataIndex === 'url'">
              <a-button type="link" @click="openPic(record.url)">查看图片</a-button>
            </template>
            <template v-if="column.dataIndex === 'date'">
              <div>
                <div>铁人：{{ record.trdate }}</div>
                <div>百度：{{ record.bdate }}</div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'has_result'">
              <div>
                <div>铁人：{{ record.tr_has_result == 0 ? '没有' : '有' }}</div>
                <div>百度：{{ record.b_has_result == 0 ? '没有' : '有' }}</div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'score'">
              <div>
                <div>铁人：{{ record.trscore ? record.trscore + '%' : '-' }}</div>
                <div>百度：{{ record.bscore ? record.bscore + '%' : '-' }}</div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'peo'">
              <div>
                <div>铁人：{{ record.trpeo || '-' }}</div>
                <div>百度：{{ record.bpeo || '-' }}</div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'res_pic'">
              <div>
                <div>铁人：
                  <a-button type="link" @click="openPic(record.trurl)" v-if="record.trurl">查看图片</a-button>
                  <span v-else>-</span>
                </div>
                <div>百度：
                  <a-button type="link" @click="openPic(record.burl)" v-if="record.burl">查看图片</a-button>
                  <span v-else>-</span>
                </div>
              </div>
            </template>
          </template>
        </a-table>
        <div class="page-control">
          <div>
            <a-pagination v-model:current="pagination.pageIndex" showSizeChanger v-model:pageSize="pagination.pageSize"
              :total="pagination.total" :show-total="(total: number) => `共 ${total} 条`" show-quick-jumper
              @change="pageChange" />
          </div>
        </div>
      </div>
    </div>
    <preview v-if="visible" :url="faceUrl" @close="visible = false" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import Preview from './components/preview.vue';

const dateRange = ref<any>([dayjs().subtract(1, 'M').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
const statisticsData = ref<any>({
  today_total: 0,
  history_total: 0
});
const statusData = ref<any>({
  baidu: {
    total: 0,
    success_total: 0,
    result_total: 0
  },
  tr: {
    total: 0,
    success_total: 0,
    result_total: 0
  },
  result: {
    same_total: 0,
    unsame_total: 0
  }
})
const chartRef = ref();
let unlisten: Function = () => { };

const querySearch = ref<any>({
  userid: '',
  result: undefined,
  issame: undefined
});
const searchRange = ref<any>(undefined);
const pagination = ref<any>({
  pageSize: 10,
  pageIndex: 1,
  total: 0
})
const tableLoading = ref<boolean>(false);
const tableData = ref<any[]>([{}]);
const tableColumns = ref<any[]>([
  {
    dataIndex: 'xh',
    title: '序号',
    align: 'center',
    width: 80
  },
  {
    dataIndex: 'url',
    title: '请求原始图片',
    align: 'center',
    width: 120
  },
  {
    dataIndex: 'date',
    title: '接口调用时间',
    align: 'center',
    width: 230
  },
  {
    dataIndex: 'has_result',
    title: '是否有结果',
    align: 'center',
    width: 140
  },
  {
    dataIndex: 'score',
    title: '最高相似度',
    align: 'center',
    width: 140
  },
  {
    dataIndex: 'peo',
    title: '用户ID',
    align: 'center',
    width: 300
  },
  {
    dataIndex: 'col6',
    title: '用户是否一致',
    align: 'center',
    width: 140,
    customRender: (row: any) => {
      let record = row.record;
      if (record.bpeo && record.trpeo && record.bpeo == record.trpeo) {
        return '一致'
      } else {
        return '不一致'
      }
    }
  },
  {
    dataIndex: 'res_pic',
    title: '响应人脸图片',
    align: 'center',
    width: 160
  }
]);

const pageChange = (pageIndex: number, pageSize: number) => {
  pagination.value.pageIndex = pageIndex;
  pagination.value.pageSize = pageSize;
  queryPageList();
};
const queryPageList = async () => {
  tableLoading.value = true;
  try {
    let params = {
      ...querySearch.value,
      startdate: (searchRange.value && searchRange.value.length) ? searchRange.value[0] : '',
      enddate: (searchRange.value && searchRange.value.length) ? searchRange.value[1] : '',
      pageindex: pagination.value.pageIndex,
      pagesize: pagination.value.pageSize,
    }
    let res = await window.api.getTestList(params);
    tableData.value = res.data.DtData;
    pagination.value.total = res.data.RecordCount;
    if (res.data.DtData.length < 1 && pagination.value.pageIndex > 1) {
      //删除最后一条记录，要往前翻页。
      pagination.value.pageIndex--;
      queryPageList();
    }
  } catch (error) {
    alert(error);
  } finally {
    tableLoading.value = false;
  }
};
const searchPageList = () => {
  pagination.value.pageIndex = 1;
  queryPageList();
};
const reset = () => {
  querySearch.value = {
    userid: '',
    result: undefined,
    issame: undefined
  }
  searchRange.value = undefined;
  pagination.value = {
    pageSize: 10,
    pageIndex: 1,
    total: 0
  }
  queryPageList()
}
const drawLineChart = async () => {
  let myChart = echarts.init(chartRef.value);
  let option = {
    grid: {
      left: 60,
      right: 40,
      bottom: 20,
      top: 40,
      containLabel: true
    },
    legend: {
      show: true,
      icon: 'rect',
      itemHeight: 4,
      top: 0,
      right: 40
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: "总调用量",
        key: 'total',
        type: 'line',
        symbolSize: 0,
        smooth: true,
        data: []
      },
      {
        name: "铁人有结果",
        key: 'tr_total',
        type: 'line',
        symbolSize: 0,
        smooth: true,
        data: []
      },
      {
        name: "百度有结果",
        key: 'baidu_total',
        type: 'line',
        symbolSize: 0,
        smooth: true,
        data: []
      },
      {
        name: "比对结果相同",
        key: 'same_total',
        type: 'line',
        symbolSize: 0,
        smooth: true,
        data: []
      },
      {
        name: "比对结果不同",
        key: 'unsame_total',
        type: 'line',
        symbolSize: 0,
        smooth: true,
        data: []
      },
    ]
  };
  try {
    let res = await window.api.get30DaysData();
    let data = res.data;
    let list = data.sort((a: any, b: any) => dayjs(a.date).isAfter(b.date))
    option.series.forEach(item => {
      item.data = list.map((i: any) => i[item.key])
    })
    option.xAxis.data = list.map((i: any) => i.date)
    myChart.setOption(option);
  } catch (error) {
    alert(error);
  }
  unlisten = window.electron.ipcRenderer.on('window-event', (type) => {
    if (!!myChart) myChart.resize()
  });
};
const queryCount = async () => {
  try {
    let res = await window.api.getRegisterStatic();
    statisticsData.value = res.data
  } catch (error) {
    alert(error);

  }
};
const getInfo = async () => {
  let params = { startdate: dateRange.value[0], enddate: dateRange.value[1] }
  try {
    let res = await window.api.getCallStatic(params);
    statusData.value = res.data
  } catch (error) {
    alert(error);
  }
}

const visible = ref<boolean>(false);
const faceUrl = ref<string>('');
const openPic = (url: string) => {
  faceUrl.value = url;
  visible.value = true;
}
onUnmounted(() => {
  unlisten()
})
onMounted(() => {
  queryCount();
  getInfo()
  drawLineChart()
  queryPageList();
})
</script>
<style lang='less' scoped>
@import './style.less';
</style>
<template>
  <div class="record-page">
    <div class="title">人脸识别记录</div>
    <div class="filter">
      <a-row :gutter="12">
        <a-col :span="3">
          <a-input v-model:value="querySearch.deviceCode" placeholder="设备编号" allowClear></a-input>
        </a-col>
        <a-col :span="3">
          <a-select v-model:value="querySearch.productCode" placeholder="产品名称" :options="productOptions"
            :fieldNames="{ label: 'dictValue', value: 'dictKey' }" allowClear showSearch
            optionFilterProp="dictValue"></a-select>
        </a-col>
        <a-col :span="3">
          <a-select v-model:value="querySearch.detectCode" placeholder="人脸检测结果" :options="detectOptions"
            :fieldNames="{ label: 'dictValue', value: 'dictKey' }" allowClear showSearch
            optionFilterProp="dictValue"></a-select>
        </a-col>
        <a-col :span="3">
          <a-select v-model:value="querySearch.searchRes" placeholder="人脸识别结果" :options="searchOptions"
            :fieldNames="{ label: 'dictValue', value: 'dictKey' }" allowClear showSearch
            optionFilterProp="dictValue"></a-select>
        </a-col>
        <a-col :span="-1">
          <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" :allow-clear="false" />
        </a-col>
        <a-col :span="-1">
          <a-space>
            <a-button type="primary" @click="searchPageList">查询</a-button>
            <a-button @click="reset">重置</a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div class="table-container">
      <div class="table">
        <div class="card-item" v-for="item in tableData" :key="item.id">
          <img :src="item.faceUrl + '.min.png'" alt="" @click="handlePreview(item.faceUrl)" />
          <div class="font-bold">采集设备：{{ item.deviceCode }}</div>
          <div>产品名称：{{ item.productName }}</div>
          <div>采集时间：{{ item.createDate }}</div>
          <div>检测结果：{{ item.detectDesc }}</div>
          <div>识别结果：{{ item.searchScore || item.searchErrorMsg }}</div>
        </div>
      </div>
      <div class="pagination">
        <a-pagination v-model:current="pagination.pageIndex" :pageSize="pagination.pageSize" :total="pagination.total"
          @change="pageChange">
          <template #itemRender="{ type, originalElement }">
            <a-button v-if="type === 'prev'">上一页</a-button>
            <a-button v-else-if="type === 'next'">下一页</a-button>
            <component :is="originalElement" v-else></component>
          </template>
        </a-pagination>
      </div>
    </div>
    <a-modal :visible="previewVisible" title="查看图片" :footer="null" @cancel="handleCancel" width="55%">
      <div class="preview-image">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
const querySearch = ref<any>({
  deviceCode: '',
  productCode: undefined,
  detectCode: undefined,
  searchRes: undefined
});
const dateRange = ref<any>([dayjs().subtract(1, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
const pagination = ref<any>({
  pageSize: 8,
  pageIndex: 1,
  total: 0
})
const tableLoading = ref<boolean>(false);
const tableData = ref<any[]>([{}]);
// 切换页码
const pageChange = (index: number) => {
  pagination.value.pageIndex = index;
  queryPageList();
};
// 获取分页列表
const queryPageList = async () => {
  tableLoading.value = true;
  try {
    let params = {
      ...querySearch.value,
      start: (dateRange.value && dateRange.value.length) ? dateRange.value[0] : '',
      end: (dateRange.value && dateRange.value.length) ? dateRange.value[1] : '',
      pageIndex: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize,
    }
    let res = await window.api.queryFacePageList(params);
    tableData.value = res.data;
    pagination.value.total = res.totalCount;
    if (res.data.length < 1 && pagination.value.pageIndex > 1) {
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
// 重置
const reset = () => {
  querySearch.value = {
    deviceCode: '',
    productCode: undefined,
    detectCode: undefined,
    searchRes: undefined
  }
  dateRange.value = [dayjs().subtract(1, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')];
  searchPageList();
}
const previewVisible = ref<boolean>(false);
const previewImage = ref<any>('');
const handlePreview = async (file) => {
  previewImage.value = file;
  previewVisible.value = true;
};
const handleCancel = () => {
  previewImage.value = '';
  previewVisible.value = false;
}
const productOptions = ref<any[]>([]);//产品下拉
const detectOptions = ref<any[]>([]);//人脸检测结果下拉
const searchOptions = ref<any[]>([]);//人脸识别结果下拉
// 获取字典下拉
const getDict = (key) => {
  return window.api.getDict(key)
};
onMounted(async () => {
  productOptions.value = await getDict('com.ironman.enums.ProductEnum');
  detectOptions.value = await getDict('com.ironman.enums.DetectEnum');
  searchOptions.value = await getDict('com.ironman.enums.SearchEnum');
  queryPageList();
})
</script>
<style lang="less">
.preview-image {
  max-height: 800px;
  overflow-y: auto;
  width: 100%;
}
</style>
<style lang='less' scoped>
@import './style.less';
</style>
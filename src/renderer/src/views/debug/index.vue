<template>
  <div class="debug">
    <a-space class="header" :size="20">
      <span class="title">人脸识别接口调试</span>
      <a-button @click="isShow = true">批量导入人脸</a-button>
      <span>人脸库样本用户数： {{ count.toSeparatorString() }}</span>
    </a-space>
    <div class="flex-content">
      <div class="left">
        <h2>人脸图片</h2>
        <a-upload name="cardCoverUrl" accept=".jpg, .png, .jpeg, .bmp" :showUploadList="false"
          :before-upload="beforeUpload" :customRequest="customUpload">
          <a-button type="primary">选择图片</a-button>
        </a-upload>
        <a-spin :spinning="transformLoading" tip="转换中...">
          <a-textarea v-model:value="base64" placeholder="请输入base64编码字符串" :rows="20"></a-textarea>
        </a-spin>
        <div class="start-box">
          <a-button type="primary" :disabled="!base64" @click="detect" :loading="debugLoading">开始调试</a-button>
        </div>
      </div>
      <div class="right">
        <div class="baidu">
          <h2>百度响应结果</h2>
          <div class="res-box">
            <VueJsonPretty v-if="baiduRes" :data="baiduRes" />
          </div>
        </div>
        <div class="ironman">
          <h2>铁人响应结果</h2>
          <div class="res-box">
            <VueJsonPretty v-if="trRes" :data="trRes" />
          </div>
        </div>
      </div>
    </div>
    <batch-register v-if="isShow" @close="isShow = false" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import BatchRegister from './components/batchRegister.vue';

const count = ref<any>(0);
const base64 = ref<string>('');
const baiduRes = ref<any>(null);
const trRes = ref<any>(null);
const isShow = ref<boolean>(false);
const transformLoading = ref<boolean>(false);
const debugLoading = ref<boolean>(false);

const queryCount = async () => {
  let res = await window.api.getRegisterStatic();
  count.value = res.data.history_total;
}

// 文件格式、大小校验
const beforeUpload = (file: any) => {
  let acceptArr = ['png', 'jpg', 'jpeg', 'bmp'];
  const isAccept = acceptArr.findIndex((i) => file.type.includes(i)) != -1;
  if (!isAccept) {
    message.error(`仅支持${acceptArr.join('、')}格式！`);
  }
  const isLtSize = file.size / 1024 / 1024 < 10;
  if (!isLtSize) {
    message.error(`资源大小不超过 10 M！`);
  }
  return isAccept && isLtSize;
}

// 转换成base64格式
function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

// 图片转换
const customUpload = (e: any) => {
  let file: Blob = e.file;
  transformLoading.value = true;
  getBase64(file, (base64Url: string) => {
    base64.value = base64Url;
    transformLoading.value = false;
  })
}

//调试
const detect = async () => {
  try {
    debugLoading.value = true;
    let data = {
      base64: base64.value
    };
    let res = await window.api.testFaceDetect(data);
    let resList = res.data;
    baiduRes.value = resList.filter(i => i.type == 'baidu')[0].response;
    trRes.value = resList.filter(i => i.type == 'tr')[0].response;
  } catch (error) {

  } finally {
    debugLoading.value = false;
  }
}
onMounted(() => {
  queryCount()
})
</script>
<style lang="less" scoped>
@import './style.less';
</style>
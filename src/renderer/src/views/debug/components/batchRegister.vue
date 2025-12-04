<template>
  <a-modal :visible="true" title="人脸批量注册" width="680px" :footer="null" centered @cancel="close">
    <div class="batch-register">
      <a-space>
        <i>*</i>
        <span>人脸图片：</span>
        <a-upload name="cardCoverUrl" accept=".jpg, .png, .jpeg, .bmp" multiple :showUploadList="false"
          :before-upload="beforeUpload" :customRequest="customUpload">
          <a-button type="primary">上传图片</a-button>
        </a-upload>
      </a-space>
      <div class="table-container" ref="tableRef">
        <a-button type="link" @click="clearAll">全部删除</a-button>
        <a-table :dataSource="fileList" :columns="columns" size="small" bordered :pagination="false"
          :scroll="{ y: '50vh' }">
          <template #bodyCell="{ record, column, index }">
            <template v-if="column.dataIndex === 'base64'">
              <span class="tooltip-text">{{ record.base64 }}</span>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a-button type="link" @click="remove(index)">删除</a-button>
            </template>
          </template>
        </a-table>
      </div>
      <div class="footer">
        <a-space>
          <a-button @click="close">取消</a-button>
          <a-button type="primary" :loading="loading" :disabled="!fileList.length" @click="confirm">确认注册</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';

const tableRef = ref()
const emits = defineEmits(['close']);
const fileList = ref<Array<{ name: string; base64: string }>>([]);
const columns = [
  {
    dataIndex: 'name',
    title: '图片名称',
    ellipsis: true
  },
  {
    dataIndex: 'action',
    title: '操作',
    align: 'center',
    width: 120
  }
]
const loading = ref<boolean>(false);

const close = (): void => {
  emits('close')
};
// 文件格式、大小校验
const beforeUpload = (file: File): boolean => {
  const acceptArr = ['png', 'jpg', 'jpeg', 'bmp'];
  const isAccept = acceptArr.findIndex((i) => (file.type || '').includes(i)) != -1;
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
function getBase64(img: Blob, callback: (base64Url: string) => void): void {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

// 图片转换
const customUpload = (e: { file: File }): void => {
  const file: File = e.file;
  getBase64(file, (base64Url: string) => {
    fileList.value.push({
      name: (file as any).name,
      base64: base64Url
    })
  });
}

const clearAll = (): void => {
  fileList.value = []
}

const remove = (idx: number): void => {
  fileList.value.splice(idx, 1)
}


const confirm = async (): Promise<void> => {
  loading.value = true;
  const jsonArr = fileList.value.map(file => {
    return window.api.registerFace({ base64: file.base64 })
      .then(res => {
        return {
          ...res,
          filename: file.name
        }
      })
  })
  Promise.all(jsonArr).then((resArr) => {
    const errList = resArr.filter((i) => (i.code ?? i.data?.code) !== 200)
    if (!errList.length) {
      message.success('注册成功！')
    } else {
      message.error(`${errList.map((i) => i.filename).join('、')}注册失败！`)
    }
  })
    .finally(() => {
      loading.value = false;
    })
}
onMounted(() => { })
</script>
<style lang='less' scoped>
.batch-register {

  i {
    color: #ff4d4f;
  }

  .table-container {
    min-height: 300px;

    >.ant-btn {
      float: right;
    }

    .tooltip-text {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
  }

  .footer {
    margin: 20px;
    display: flex;
    justify-content: center;
  }

}
</style>
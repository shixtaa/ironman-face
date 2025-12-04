<template>
  <a-modal :visible="true" width="70%" title="查看图片" @cancel="close" :bodyStyle="{ padding: '20px' }" centered
    destroyOnClose>
    <a-image :src="props.url" :preview="false" />
    <template #footer>
      <div class="flex justify-center">
        <a-button @click="close">关闭</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
const emits = defineEmits(['close'])
const props = defineProps({
  url: String
})
const close = () => {
  emits('close')
} 
</script>
<style lang='less' scoped></style>
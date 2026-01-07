<template>
  <a-config-provider :locale="zhCN">
    <div class="main-container">
      <div class="menu">
        <img class="menu-logo" src="./assets/logo.png" />
        <div class="menu-item" :class="{ 'active': active == 1 }" @click="changeTab(1)">
          <ReconciliationOutlined />
          <span>记录</span>
        </div>
      </div>
      <div class="content">
        <RecordView v-if="active == 1" />
      </div>
    </div>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ReconciliationOutlined } from '@ant-design/icons-vue';
import RecordView from './views/record/index.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
dayjs.locale('zhCN');

const active = ref<number>(1);
const changeTab = (val: number) => {
  active.value = val;
} 
</script>
<style scoped>
.main-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}

.main-container .menu {
  width: 60px;
  height: 100%;
  background-color: #eeeeef;
  border-right: 1px solid #d3d5d8;
  padding: 6px;
  box-sizing: border-box;
}

.menu-logo {
  width: 48px;
  height: 48px;
  border-radius: 6px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 6px;
  margin-top: 16px;
  cursor: pointer;
}

.menu-item.active {
  background-color: #dddee0;
  color: #096dd9;
  font-weight: 500;
}

.menu-item .anticon {
  font-size: 16px;
  margin-bottom: 2px;
}

.menu-item span {
  font-size: 12px;
}

.content {
  flex: 1;
  height: 100%;
  overflow: hidden;
}
</style>
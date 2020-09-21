<template>
  <div class="km-container">
    <keep-alive :include="['role', 'roleAdd', 'accountSetting', 'accountSettingAdd', 'materialDownload']">
      <router-view />
    </keep-alive>
  </div>
</template>

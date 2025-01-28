<script lang="ts" setup>
const state = reactive({
  showLeftDrawer: true,
})
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="primary" scroll-behavior="elevate" title="A Todo">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="state.showLeftDrawer = !state.showLeftDrawer" />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="state.showLeftDrawer">
      <v-list>
        <v-list-item title="Drawer left"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item title="Drawer right"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <v-list>
        <v-list-item title="Drawer Content"></v-list-item>
      </v-list>
    </v-main>
  </v-layout>
</template>

<style lang="less"></style>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class App extends Vue {}
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}
</style>

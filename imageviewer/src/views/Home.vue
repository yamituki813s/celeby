<template>
  <div class="home">
    <ImageViewer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ImageViewer from "@/components/ImageViewer.vue"; // @ is an alias to /src

@Component({
  components: {
    ImageViewer
  }
})
export default class Home extends Vue {}
</script>

<template>
  <div>
    <div v-if="showImageurl">
      <div v-for="image in images" :key="image.id">
        <div
          v-bind:id="showImageurl == image['url'] ? 'viewer-area' : ''"
          :style="{ backgroundImage: 'url(' + image['url'] + ')' }"
        ></div>
      </div>
    </div>
    <div v-else>
      準備中。。。。
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { db } from "../plugins/firebase";

const images = db.collection("images");

@Component
export default class ImageViewer extends Vue {
  images: firebase.firestore.DocumentData = [];
  swiperOption = {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 50,
    loop: true
  };
  timer: number = 0;
  index: number = 0;
  showImageurl: string | null = null;
  changeTime: number = 8000;

  created() {
    db.collection("image").onSnapshot(ss => {
      clearTimeout(this.timer);
      let w: firebase.firestore.DocumentData = [];
      ss.forEach(doc => w.push(doc.data()));
      this.images = w;
      this.showImageurl = this.images[0]["url"] || null;
      this.onTimer();
    });
  }
  onTimer() {
    this.timer = setTimeout(() => {
      const nextIndex: number =
        this.images.length > this.index + 1 ? this.index + 1 : 0;
      this.showImageurl = this.images[nextIndex]["url"];
      this.index = nextIndex;
      this.onTimer();
    }, this.changeTime);
  }
  mounted() {
    this.onTimer();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#viewer-area {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  animation: fadeSlideImg 8s ease-out infinite;
}
@keyframes fadeSlideImg {
  0% {
    opacity: 1;
  }
  33% {
    opacity: 0.8;
  }
  66% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
  }
}
</style>

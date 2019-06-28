<template>
  <div id="container">
    <div v-if="showImageurl">
      <div v-for="comment in comments" :key="comment.id">
        <div class="comment" v-bind:style="{ top: comment['y'] + 'px' }">
          {{ comment["text"] }}
        </div>
      </div>
      <div v-for="image in images" :key="image.id">
        <div
          v-bind:class="showImageurl == image['url'] ? 'viewer-area' : 'hidden'"
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
  comments: any[] = [];
  images: any[] = [];
  swiperOption = {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 50,
    loop: true
  };
  timer: number = 0;
  index: number = 0;
  showImageurl: string | null = null;
  changeTime: number = 10000;

  created() {
    db.collection("images")
      .orderBy("created_at", "desc")
      .onSnapshot(async snapShot => {
        clearTimeout(this.timer);
        if (this.index !== 0) {
          await this.sleep(3000);
        }
        let docs: any[] = [];
        snapShot.forEach(doc => docs.push(doc.data()));
        this.images = docs.sort((a, b) => b.created_at - a.created_at);
        this.showImageurl = this.images[0]["url"] || null;
        this.index++;
        this.onTimer();
      });
    db.collection("comments")
      .orderBy("created_at", "desc")
      .onSnapshot(snapShot => {
        let docs: any[] = [];
        snapShot.forEach(doc => {
          const exists: boolean =
            this.comments.some(comment => {
              console.log(doc.id + ":" + comment.id);
              return comment.id === doc.id;
            }) || false;
          if (!exists) {
            this.comments.push(
              Object.assign(doc.data(), { y: this.getPosition(), id: doc.id })
            );
          }
        });
      });
  }
  async sleep(milliseconds: number) {
    return new Promise<void>(resolve => {
      setTimeout(() => resolve(), milliseconds);
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
  getPosition() {
    const max: number = 100;
    const min: number = window.outerHeight - 100;
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  background-color: dimgrey;
  width: 100%;
  height: 100vh;
}
.hidden {
  display: none;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.viewer-area {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  animation: fadeSlideImg 10s ease-out 0s 1 normal forwards;
}
@keyframes fadeSlideImg {
  0% {
    opacity: 1;
  }
  33% {
    opacity: 0.9;
  }
  40% {
    opacity: 0.8;
  }
  66% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
  }
}
.comment {
  z-index: 999;
  font-size: 2rem;
  width: 100%;
  position: fixed;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: comment 7s linear 0s 1 normal forwards;
}
@keyframes comment {
  0% {
    transform: translate(0%);
  }
  100% {
    transform: translate(100%);
  }
}
</style>

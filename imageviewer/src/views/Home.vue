<template>
  <div class="home" v-if="isAuth">
    <ImageViewer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ImageViewer from "@/components/ImageViewer.vue";
import firebase from "firebase";

@Component({
  components: {
    ImageViewer
  }
})
export default class Home extends Vue {
  isAuth: boolean = false;
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isAuth = true;
      } else {
        // login
        firebase
          .auth()
          .signInAnonymously()
          .then(e => {
            console.log(e);
          })
          .catch((error: Error) => {
            console.log(error.message);
          });
      }
    });
  }
}
</script>

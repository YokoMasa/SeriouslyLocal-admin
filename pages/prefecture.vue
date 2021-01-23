<template>
  <div style="display: flex; flex-direction: column; height: 100vh;" >
    <div class="headerWrapper flexRowAlignRight">
      <div class="leftSideButtonWrapper flexRowAlignLeft">
        <button class="importantButton" @click="navigateToMainMenu">&lt; Back to main menu</button>
      </div>
      <button class="importantButton" @click="save">Save</button>
    </div>

    <div class="editorWrapper">
      <div class="editor padding1">
        <div class="infoWrapper">
          <form>

            <div class="formBlock">
              <label class="formLabel">Prefecture</label>
              <select class="formInput" v-model="currentPrefecture">
                <option value="Aichi">Aichi</option>
                <option value="Akita">Akita</option>
                <option value="Aomori">Aomori</option>
                <option value="Chiba">Chiba</option>
                <option value="Ehime">Ehime</option>
                <option value="Fukui">Fukui</option>
                <option value="Fukuoka">Fukuoka</option>
                <option value="Fukushima">Fukushima</option>
                <option value="Gifu">Gifu</option>
                <option value="Gumma">Gumma</option>
                <option value="Hiroshima">Hiroshima</option>
                <option value="Hokkaido">Hokkaido</option>
                <option value="Hyogo">Hyogo</option>
                <option value="Ibaraki">Ibaraki</option>
                <option value="Ishikawa">Ishikawa</option>
                <option value="Iwate">Iwate</option>
                <option value="Kagawa">Kagawa</option>
                <option value="Kagoshima">Kagoshima</option>
                <option value="Kanagawa">Kanagawa</option>
                <option value="Kochi">Kochi</option>
                <option value="Kumamoto">Kumamoto</option>
                <option value="Kyoto">Kyoto</option>
                <option value="Mie">Mie</option>
                <option value="Miyagi">Miyagi</option>
                <option value="Miyazaki">Miyazaki</option>
                <option value="Nagano">Nagano</option>
                <option value="Nagasaki">Nagasaki</option>
                <option value="Nara">Nara</option>
                <option value="Niigata">Niigata</option>
                <option value="Oita">Oita</option>
                <option value="Okayama">Okayama</option>
                <option value="Okinawa">Okinawa</option>
                <option value="Osaka">Osaka</option>
                <option value="Saga">Saga</option>
                <option value="Saitama">Saitama</option>
                <option value="Shiga">Shiga</option>
                <option value="Shimane">Shimane</option>
                <option value="Shizuoka">Shizuoka</option>
                <option value="Tochigi">Tochigi</option>
                <option value="Tokushima">Tokushima</option>
                <option value="Tokyo">Tokyo</option>
                <option value="Tottori">Tottori</option>
                <option value="Toyama">Toyama</option>
                <option value="Wakayama">Wakayama</option>
                <option value="Yamagata">Yamagata</option>
                <option value="Yamaguchi">Yamaguchi</option>
                <option value="Yamanashi">Yamanashi</option>
              </select>
            </div>

            <div class="formBlock">
              <label class="formLabel">Prefecture Image</label>
              <div class="eyeCatchWrapper">
                <img v-if="currentPrefectureInfo.hero.originalImageUrl" :src="currentPrefectureInfo.hero.originalImageUrl" class="eyeCatchImg"/>
                <div v-else class="eyeCatchPlaceholder flexCenter">select one from the image list</div>
              </div>
            </div>

            <div class="formBlock">
              <label class="formLabel">Short Description</label>
              <textarea class="formInput" v-model="currentPrefectureInfo.description"></textarea>
            </div>

          </form>
        </div>
      </div>
      <image-picker class="imagePicker" @imageClicked="imageClicked"></image-picker>
    </div>
  </div>
</template>

<script>
import ImagePicker from '../components/ImagePicker.vue';

export default {
  mounted() {
    this.reload();
  },
  data() {
    return {
        currentPrefecture: 'Tokyo',
        currentPrefectureInfo: {
            name: '',
            description: '',
            hero: {}
        }
    }
  },
  methods: {
      imageClicked(image) {
          this.currentPrefectureInfo.hero = image;
      },
      async save() {
        if (this.currentPrefectureInfo.name === '' || this.currentPrefectureInfo.description === ''
                    || !this.currentPrefectureInfo.hero.id) {
            alert("fill out non-null fields before you save");
        } else {
            try {
              var res = await this.$api.prefecture.save(this.currentPrefectureInfo.name, this.currentPrefectureInfo.description, this.currentPrefectureInfo.hero.id);
              if (res.status === 201) {
                alert(`successfully saved PrefectureInfo: ${this.currentPrefectureInfo.name}`);
              } else {
                alert("failed to save");
              }
            } catch (error) {
              alert("failed to save");
              console.log(error);
            }
        }
      },
      async reload() {
        var res = await this.$api.prefecture.get(this.currentPrefecture).catch(err => console.log(err));
          if (res && res.data) {
              this.currentPrefectureInfo = res.data;
          } else {
              this.currentPrefectureInfo = {
                name: this.currentPrefecture,
                description: '',
                hero: {}
              }
          }
      },
      navigateToMainMenu() {
        this.$router.push("/");
      }
  },
  watch: {
      currentPrefecture() {
        this.reload();
      }
  },
  components: {
    ImagePicker
  }
};
</script>
<style scoped>
.headerWrapper {
  width: 100%;
  height: 50px;
  background: #0086c3;
}

.leftSideButtonWrapper {
  flex: 1 1;
}

.editorWrapper {
  position: relative;
  flex: 1 1;
  display: flex;
}

.editor {
  height: 100%;
  flex: 1 1;
}

.imagePicker {
  width: 350px;
  height: 100%;
}

.infoWrapper {
  max-width: 600px;
}

.eyeCatchWrapper {
  width: 400px;
  height: 300px;
}

.eyeCatchImg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.eyeCatchPlaceholder {
  width: 100%;
  height: 100%;
  background: #ccc;
  font-size: 10pt;
}
</style>

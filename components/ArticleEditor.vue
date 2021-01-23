<template>
  <div style="display: flex; flex-direction: column; height: 100vh;" >
    <div class="headerWrapper flexRowAlignRight">
      <div class="leftSideButtonWrapper flexRowAlignLeft">
        <button class="importantButton" @click="navigateAfterConfirm">&lt; Back to article list</button>
      </div>
      <button class="importantButton" v-if="isSavedArticle()" @click="isShowingDeleteDialog = true" style="color: red;">DELETE</button>
      <button class="importantButton" v-if="isInfoEditMode" @click="toggleMode">Edit article content</button>
      <button class="importantButton" v-else @click="toggleMode">Edit article info</button>
      <button class="importantButton" @click="preview()">Preview</button>
      <button class="importantButton" @click="save">Save</button>
    </div>

    <div class="editorWrapper">

      <yes-no-dialog v-if="isShowingDeleteDialog" 
              :content="'Are you sure you want to delete this article?'" 
              @no="isShowingDeleteDialog = false"
              @yes="deleteArticle"></yes-no-dialog>
        
      <yes-no-dialog v-if="isShowingSaveConfirmDialog" 
              :content="'There are unsaved changes. Are you sure you want to go back without saving?'" 
              @no="isShowingSaveConfirmDialog = false"
              @yes="navigateToArticleList()"></yes-no-dialog>

      <div class="modalBase flexCenter" v-if="isLoading">
        LOADING
      </div>

      <div v-if="isInfoEditMode" class="editor padding1">
        <div class="infoWrapper">
          <form>
            <div class="formBlock">
              <label class="formLabel">Title</label>
              <input class="formInput" type="text" v-model="article.title">
            </div>

            <div class="formBlock">
              <label class="formLabel">Eye catch</label>
              <div class="eyeCatchWrapper">
                <img v-if="article.thumbnail" :src="article.thumbnail.originalImageUrl" class="eyeCatchImg"/>
                <div v-else class="eyeCatchPlaceholder flexCenter">select one from the image list</div>
              </div>
            </div>

            <div class="formBlock">
              <label class="formLabel">Short Description</label>
              <textarea class="formInput" v-model="article.shortDescription"></textarea>
            </div>

            <div class="formBlock">
              <label class="formLabel">Address</label>
              <input class="formInput" type="text" v-model="article.address">
            </div>

            <div class="formBlock">
              <label class="formLabel">Prefecture</label>
              <select class="formInput" v-model="article.prefecture">
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
              <label class="formLabel">Category</label>
              <select class="formInput" v-model="article.category">
                <option v-for="category in categoryList" :key="category.id" :value="category">{{ category.name }}</option>
              </select>
            </div>

            <div class="formBlock">
              <label class="formLabel">Tags</label>
              <tag-selector @tagChange="onTagsChange" :tags="article.tags"></tag-selector>
            </div>

            <div class="formBlock">
              <label class="formLabel">Status</label>
              <select class="formInput" v-model="article.status">
                <option value="0">Private</option>
                <option value="1">Public</option>
              </select>
            </div>

          </form>
        </div>
      </div>
      <editor class="editor" ref="toastuiEditor" @change="onEditorChange" previewStyle="tab" :height="editorHeight" v-show="!isInfoEditMode" :options="{useDefaultHTMLSanitizer: false}"></editor>
      <image-picker class="imagePicker" @imageClicked="insertImage"></image-picker>
    </div>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import OriginalEditor from '@toast-ui/editor';
import { Editor } from '@toast-ui/vue-editor';

import ImagePicker from '../components/ImagePicker.vue';
import TagSelector from '../components/TagSelector.vue';
import YesNoDailog from '../components/YesNoDialog.vue';

export default {
  props: ['place_article_id'],
  async mounted() {
    var el = document.getElementsByClassName('editorWrapper')[0];
    if (el) {
      this.editorHeight = `${el.offsetHeight}px`;
    }
    
    var res = await this.$api.category.list();
    if (res.data) {
      this.categoryList = res.data;
    }

    if (this.place_article_id) {
        var articleResponse = await this.$api.placeArticle.get(this.place_article_id);
        if (articleResponse.data) {
            this.article = articleResponse.data;
            this.setHtmlToEditor();
        }
    }

    document.addEventListener('keydown', this.handleKeyEvent);
    document.addEventListener('keyup', this.handleKeyEvent);
  },
  data() {
    return {
      contentHtml: "",
      isInfoEditMode: false,
      isLoading: false,
      isShowingDeleteDialog: false,
      isShowingSaveConfirmDialog: false,
      unsavedChangesExist: false,
      editorHeight: '500px',
      categoryList: [],
      article: {
        id: null,
        title: null,
        thumbnail: null,
        shortDescription: null,
        address: null,
        prefecture: null,
        category: null,
        rawContent: null,
        status: 0,
        tags: []
      }
    }
  },
  watch: {
    article: {
      handler(after, before) {
        if (before.id === null && after.id !== null) {
          return;
        }

        console.log("change");
        console.log(after);
        this.unsavedChangesExist = true;
      },
      deep: true
    }
  },
  methods: {
    handleKeyEvent(e) {
      if (e.altKey && e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        switch (e.keyCode) {
          case 83:
            if (e.type === 'keyup') {
              this.save();
            }
            break;
          case 84:
            if (e.type === 'keyup') {
              this.toggleMode();
            }
            break;
          case 80:
            if (e.type === 'keyup') {
              this.preview();
            }
            break;
        }
        return false;
      }
    },
    isSavedArticle() {
      return this.article.id;
    },
    navigateAfterConfirm() {
      if (this.unsavedChangesExist) {
        this.isShowingSaveConfirmDialog = true;
      } else {
        this.navigateToArticleList();
      }
    },
    navigateToArticleList() {
      this.$router.push('/place_article');
    },
    insertImage(image) {
      if (this.isInfoEditMode) {
        this.article.thumbnail = image;
      } else {
        this.$refs.toastuiEditor.invoke("insertText", `\r![image](${image.originalImageUrl})\r`);
        this.$refs.toastuiEditor.invoke("insertText",`[credit: ${image.id}]\r`);
      }
    },
    getHtml() {
      var html = this.$refs.toastuiEditor.invoke('getHtml');
      if (html) {
        this.article.rawContent = html;  
      }
    },
    setHtmlToEditor() {
      this.$refs.toastuiEditor.invoke('setHtml', this.article.rawContent);
    },
    onEditorChange(e) {
      this.getHtml()
    },
    onTagsChange(tags) {
      this.article.tags = tags;
    },
    toggleMode() {
      if (this.isInfoEditMode) {
        this.isInfoEditMode = false;
      } else {
        this.isInfoEditMode = true;
      }
    },
    async save() {
      this.isLoading = true;
      var resp = await this.$api.placeArticle.save(this.article).catch(err => alert("failed to save"));
      if (resp && resp.data) {
        this.unsavedChangesExist = false;
        alert("successfully saved the article");
        this.$emit('save', resp.data);
      }
      this.isLoading = false;
    },
    async preview() {
      this.isLoading = true;
      var resp = await this.$api.placeArticle.preview(this.article).catch(err => alert("failed to preview. You might need to fill non null fields"));
      if (resp && resp.data) {
        window.open(resp.data.url);
      }
      this.isLoading = false;
    },
    deleteArticle() {
      var self = this;
      this.$api.placeArticle.delete(this.article.id).then(() => {
        self.$router.push("/place_article");
      }).catch(err => {
        alert("error occurred. could not delete this article");
        this.isShowingDeleteDialog = false;
      });
    }
  },
  components: {
    Editor,
    ImagePicker,
    TagSelector,
    YesNoDailog
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

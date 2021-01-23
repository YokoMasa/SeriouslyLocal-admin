<template>
    <div @paste="onPaste" @drop="onDrop" ondragover="return false" class="imagePickerWrapper">

        <div class="modalBase flexCenter" v-if="isLoadingMode">
            <p>LOADING...</p>
        </div>

        <div class="modalBase flexCenter" v-if="isUploadMode">
            <div class="uploadModal flexCenter">

                <div class="uploadModal-contentWrapper flexCenter">

                    <div v-if="currentImageFile && currentImageUri" class="flexCenter" style="width: 100%;">
                        <img :src="currentImageUri" class="currentImage"/>

                        <div class="creditInput">
                            <div class="formBlock">
                                <label class="formLabel">Credit display</label>
                                <input class="formInput" type="text" v-model="creditDisplay"/>
                            </div>
                            <div class="formBlock">
                                <label class="formLabel">Credit url</label>
                                <input class="formInput" type="text" v-model="creditUrl"/>
                            </div>
                            <div class="formBlock">
                                <label class="formLabel">Auto resize</label>
                                <input type="checkbox" v-model="resizeBeforeUpload"/>
                            </div>
                        </div>
                    </div>

                    <form v-else>
                        <label for="imagePicker-fileInput" class="fileInput flexCenter">
                            Drag'n drop here or <br>paste here or <br>click here <br>to upload an image.
                        </label>
                        <input type="file" @change="onFileChange" id="imagePicker-fileInput" style="display: none;"/>
                    </form>

                </div>

                <div class="uploadModal-buttonWrapper flexRowSpaceAround">
                    <button @click="finishUploadMode">Cancel</button>
                    <button @click="uploadCurrentImage" class="importantButton">Upload</button>
                </div>

            </div>
        </div>

        <div class="uploadedImageListWrapper" :style="uploadedImageListWrapperStyle">
            <div class="uploadedImageList" :style="uploadedImageListStyle">
                <div v-for="image in images" :key="image.thumbnailUrl" class="uploadedImage" :style="uploadedImageStyle" @click="onImageClicked(image)">
                    <img :src="image.thumbnailUrl" class="uploadedImage-image"/>
                </div>
            </div>
            <div>
                <button @click="changePage(-1)">←</button>
                <button @click="changePage(1)">→</button>
            </div>
        </div>

        <button @click="switchToUploadMode" class="uploadNewImageButton importantButton" >upload new image</button>

    </div>
</template>
<script>
import Compressor from 'compressorjs';

export default {
    async mounted() {
        await this.refreshImageList();
        document.defaultView.onresize = this.onResize;
        this.onResize();
    },
    data() {
        return {
            isUploadMode: false,
            isLoadingMode: false,
            resizeBeforeUpload: true,
            currentImageUri: '',
            currentImageFile: null,
            creditDisplay: '',
            creditUrl: '',
            uploadedImageStyle: {
                'height': 0
            },
            uploadedImageListStyle: {
                'grid-template-columns': ''
            },
            uploadedImageListWrapperStyle: {
                'height': 0
            },
            images: [],
            currentPage: 0,
            supportedTypes: ['image/jpeg', 'image/png', 'image/gif']
        }
    },
    methods: {
        async changePage(diff) {
            this.currentPage += diff;
            if (this.currentPage < 0) {
                this.currentPage -= diff;
            }

            var refreshed = await this.refreshImageList();
            if (!refreshed) {
                this.currentPage -= diff;
            }
        },
        onImageClicked(image) {
            this.$emit('imageClicked', image);
        },
        onDrop(e) {
            e.preventDefault();
            var self = this;
            var file = e.dataTransfer.files[0];
            if (file && this.supportedTypes.includes(file.type)) {
                if (self.checkFileSize(file)) {
                    self.setCurrentImage(file);
                    self.isUploadMode = true;
                } else {
                    return;
                }
            }
        },
        onResize() {
            var rootEl = document.getElementsByClassName('imagePickerWrapper')[0];
            if (rootEl) {
                this.uploadedImageListWrapperStyle['height'] = `${rootEl.offsetHeight - 40}px`;
            }

            var el = document.getElementsByClassName('uploadedImageList')[0];
            if (el) {
                var colCount = parseInt(el.offsetWidth / 100);
                this.uploadedImageStyle['height'] = `${el.offsetWidth / colCount}px`;
                this.uploadedImageListStyle['grid-template-columns'] = `repeat(${colCount}, 1fr)`
            }
        },
        onPaste(e) {
            var self = this;
            navigator.clipboard.read().then(async data => {
                if (data instanceof Array) {
                    if (data && data[0] instanceof ClipboardItem) {
                        var clipboardItem = data[0];
                        var pastedBlob;
                        var types = clipboardItem.types.filter(type => self.supportedTypes.includes(type));

                        if (types.length) {
                            pastedBlob = await clipboardItem.getType(types[0]).catch(e => {});
                        } else {
                            return;
                        }

                        if (self.checkFileSize(pastedBlob)) {
                            self.setCurrentImage(pastedBlob);
                            self.isUploadMode = true;
                        } else {
                            return;
                        }
                    }
                }
            }).catch(e => {})
        },
        async onFileChange(e, a) {
            var fileList = e.target.files;
            if (!fileList || !fileList[0]) {
                return;
            }

            var imageFile = fileList[0];
            if (this.checkFileSize(imageFile)) {
                this.setCurrentImage(imageFile);
            } else {
                 e.target.form.reset();
                return;
            }
        },
        switchToUploadMode() {
            this.isUploadMode = true;
        },
        setCurrentImage(imageFile) {
            if (!imageFile) {
                return;
            }
            this.currentImageUri = URL.createObjectURL(imageFile);
            this.currentImageFile = imageFile;
            this.isUploadMode = true;
        },
        checkFileSize(file) {
            if (!file) {
                alert("ファイルがnullです。");
                return false;
            }

            if (10000000 < file.size) {
                alert("画像のサイズが大きすぎます。10MB以下にしてください。");
                return false;
            } else {
                return true;
            }
        },
        async uploadCurrentImage() {
            if (!this.currentImageFile) {
                return;
            }

            this.isUploadMode = false;
            this.isLoadingMode = true;
            var thumbnail = await this.createThumbnail(this.currentImageFile);

            var original = this.currentImageFile;
            if (this.resizeBeforeUpload) {
                original = await this.optimizeImage(this.currentImageFile);
            }
            
            await this.$api.image.create(original, thumbnail, this.creditDisplay, this.creditUrl);
            this.currentImageFile = null;
            this.currentImageUri = '';
            this.creditDisplay = '';
            this.creditUrl = '';
            this.isLoadingMode = false;
            this.refreshImageList();
        },
        async createThumbnail(imageFile) {
            return new Promise((resolve, reject) => {
                new Compressor(imageFile, {
                    quality: 0.8,
                    maxWidth: 250,
                    maxHeight: 250,
                    success(resizedImageFile) {
                        resolve(resizedImageFile);
                    },
                    error(err) {
                        reject(err);
                    }
                })
            });
        },
        async optimizeImage(imageFile) {
            return new Promise((resolve, reject) => {
                new Compressor(imageFile, {
                    quality: 0.8,
                    maxWidth: 1500,
                    maxHeight: 500,
                    success(resizedImageFile) {
                        resolve(resizedImageFile);
                    },
                    error(err) {
                        reject(err);
                    }
                })
            });
        },
        async refreshImageList() {
            var refreshed = false;
            var resp = await this.$api.image.list(this.currentPage);
            if (resp.data.length != 0) {
                this.images = resp.data
                refreshed = true;
            }
            return refreshed;
        },
        finishUploadMode() {
            this.isUploadMode = false;
            this.currentImageUri = '';
            this.currentImageFile = null;
        }
    }
}
</script>
<style scoped>
.imagePickerWrapper {
    display: flex;
    position: relative;
    flex-direction: column;
}

.uploadNewImageButton {
    width: 100%;
    height: 40px;
}

.uploadedImageListWrapper {
    /*flex: 1 1;*/
    overflow: scroll;
}

.uploadedImageList {
    display: grid;
}

.uploadedImage {
    padding: 5px;
    border: 1px solid #dddddd;
}

.uploadedImage:hover {
    background: #dddddd;
}

.uploadedImage-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.uploadModal {
    width: 85%;
    background: white;
    border: 1px solid #ccc;
}

.uploadModal-contentWrapper {
    width: 100%;
    padding: 20px 20px 0 20px;
    min-height: 300px;
}

.uploadModal-buttonWrapper {
    width: 100%;
    height: 60px;
}

.fileInput {
    width: 200px;
    height: 200px;
    text-align: center;
    border: 2px dashed #ccc;
}

.fileInput:hover {
    cursor: pointer;
}

.fileInput img {
    width: 60%;
    height: 60%;
}

.creditInput {
    width: 100%;
    margin-top: 20px;
}

.currentImage {
    width: 100%;
    object-fit: contain;
}
</style>
export default class ImageApi {

    list(page) {
        return this.axios.get(`/admin/api/image?page=${page}`);
    }

    create(originalImageFile, thumbnailImageFile, creditDisplay, creditUrl) {
        var formData = new FormData()
        formData.append('image', originalImageFile);
        formData.append('thumbnail', thumbnailImageFile);
        formData.append('credit_display', creditDisplay);
        formData.append('credit_url', creditUrl);
        return this.axios.post('/admin/api/image', formData);
    }

    constructor(axios) {
        this.axios = axios;
    }
}
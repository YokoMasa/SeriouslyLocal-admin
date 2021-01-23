export default class PlaceArticleApi {

    get(place_article_id) {
        return this.axios.get(`/admin/api/place_article/${place_article_id}`);
    }

    list(page) {
        return this.axios.get(`/admin/api/place_article?page=${page}`);
    }

    save(article) {
        return this.axios.post('/admin/api/place_article', article);
    }

    preview(article) {
        return this.axios.post('/admin/api/place_article/preview', article);
    }

    delete(place_article_id) {
        return this.axios.delete(`/admin/api/place_article/${place_article_id}`);
    }

    constructor(axios) {
        this.axios = axios
    }
}
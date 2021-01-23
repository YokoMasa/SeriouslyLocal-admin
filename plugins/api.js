import CategoryApi from './CategoryApi'
import ImageApi from './ImageApi';
import TagApi from './TagApi';
import PlaceArticleApi from './PlaceArticleApi';
import AuthApi from './AuthApi';
import PrefectureApi from './PrefectureApi';

export default ({ app }, inject) => {
    inject("api", {
        image: new ImageApi(app.$axios),
        tag: new TagApi(app.$axios),
        category: new CategoryApi(app.$axios),
        placeArticle: new PlaceArticleApi(app.$axios),
        auth: new AuthApi(app.$axios),
        prefecture: new PrefectureApi(app.$axios)
    })

    app.$axios.interceptors.request.use(function (config) {
        const apiKey = window.sessionStorage.getItem("api_key");
        if (apiKey) {
            config.headers['Authorization'] = `Bearer ${apiKey}`;
        }
        return config;
    })
}
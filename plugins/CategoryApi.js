export default class CategoryApi {

    list() {
        return this.axios.get(`/admin/api/category`);
    }

    save(category) {
        return this.axios.post('/admin/api/category', category);
    }

    constructor(axios) {
        this.axios = axios;
    }
}
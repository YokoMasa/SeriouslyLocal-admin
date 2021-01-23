export default class TagApi {

    listByName(q) {
        return this.axios.get(`/admin/api/tag?q=${q}`);
    }

    getOneByName(q) {
        return this.axios.get(`/admin/api/tag/${q}`);
    }

    constructor(axios) {
        this.axios = axios
    }
}
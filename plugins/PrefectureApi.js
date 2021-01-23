export default class PrefectureApi {

    get(name) {
        return this.axios.get(`/admin/api/prefecture/${name}`);
    }

    save(name, description, heroImageId) {
        var formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('hero', heroImageId);
        return this.axios.post('/admin/api/prefecture', formData);
    }

    constructor(axios) {
        this.axios = axios;
    }
}
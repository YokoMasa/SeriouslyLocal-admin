export default class AuthApi {

    authenticate(username, password) {
        var formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        return this.axios.post('/admin/api/auth', formData);
    }

    constructor(axios) {
        this.axios = axios;
    }
}
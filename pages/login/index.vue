<template>
    <div class="wrapper">
        <admin-header></admin-header>
        <div class="flexCenter bodyWrapper" @keydown.enter="login">
            <div class="loginFormWrapper flexCenter">
                <form>
                    <div class="formBlock">
                        <label class="formLabel">username</label>
                        <input type="text" class="formInput" v-model="username"/>
                    </div>
                    <div class="formBlock">
                        <label class="formLabel">password</label>
                        <input type="password" class="formInput" v-model="password"/>
                    </div>
                </form>
                <button class="importantButton loginButton" @click="login">login</button>
            </div>
        </div>    
    </div>
</template>
<script>
import AdminHeader from '../../components/AdminHeader.vue';

export default {
    data() {
        return {
            username: '',
            password: '',
            loading: false
        }
    },
    methods: {
        async login() {
            if (this.loading) {
                return;
            }

            this.loading = true;
            const res = await this.$api.auth.authenticate(this.username, this.password).catch(e => alert("login failed"));
            if (res && res.data && res.data.token) {
                window.sessionStorage.setItem("api_key", res.data.token);
                this.$router.push("/");
            }
            this.loading = false;
        }
    },
    components: { AdminHeader }
}
</script>
<style scoped>
.loginFormWrapper {
    width: 300px;
    height: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.loginFormWrapper form {
    width: 100%;
    margin-bottom: 20px;
}

.loginButton {
    width: 100%;
}
</style>
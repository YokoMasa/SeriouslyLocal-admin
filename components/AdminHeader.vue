<template>
    <div class="header">
        <div class="flexRowAlignLeft headerContent">
            <div class="headerLogoWrapper">
                <router-link to="/">Admin Page</router-link>
            </div>
            <div class="headerMenuWrapper flexRowAlignRight">
                <span class="menuButton" v-if="isLoggedIn()" @click="logout">logout</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        isLoggedIn() {
            return window.sessionStorage.getItem("api_key");
        },
        logout() {
            window.sessionStorage.removeItem("api_key");
            this.$router.push("/login");
        }
    }
}
</script>
<style scoped>
a {
    color: black;
    text-decoration: none;
}

.header {
    width: 100vw;
    height: 50px;
    padding: 10px 30px;
    border-bottom: 1px solid #ccc;
}

.headerContent {
    width: 1000px;
    height: 100%;
    margin-right: auto;
    margin-left: auto;
}

.headerLogoWrapper {
    width: 150px;
    font-size: 13pt;
    font-weight: 600;
}

.headerMenuWrapper {
    flex: 1 1;
}

.menuButton {
    padding: 5px 15px;
    font-size: 10pt;
    cursor: pointer;
}

.menuButton:hover {
    opacity: 0.8;
}
</style>
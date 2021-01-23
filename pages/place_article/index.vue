<template>
    <div class="wrapper">
        <admin-header></admin-header>
        <div class="bodyWrapper">
            <div class="content">
                <div class="flexRowAlignLeft">
                    <h3>Place Article</h3>
                    <div class="flexGrow flexRowAlignRight">
                        <router-link to="/place_article/new" class="newArticleLink">create new article</router-link>
                    </div>
                </div>
                <router-link class="listItem" v-for="article in articles" :key="article.id" :to="`/place_article/${article.id}`">
                    {{ article.title }}
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '../../components/AdminHeader';

export default {
    async mounted() {
        var res = await this.$api.placeArticle.list(1).catch(err => alert("Error occurred while fetching article list"));
        if (res.data) {
            this.articles = res.data;
        }
    },
    data() {
        return {
            articles: []
        }
    },
    components: {
        AdminHeader
    }
}
</script>
<style scoped>
.newArticleLink {
    font-size: 10pt;
}
</style>
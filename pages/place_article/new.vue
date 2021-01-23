<template>
    <article-editor @save="onSave"></article-editor>
</template>
<script>
import ArticleEditor from '../../components/ArticleEditor.vue';

export default {
    methods: {
        onSave(article) {
            if (article) {
                this.$router.push({path: `/place_article/${article.id}`});
            }
        }
    },
    components: {
        ArticleEditor
    }
}
</script>
<style scoped>

</style>
<template>
    <article-editor :place_article_id="id"></article-editor>
</template>
<script>
import ArticleEditor from '../../components/ArticleEditor.vue';

export default {
    asyncData({ params }) {
        return params;
    },
    components: {
        ArticleEditor
    }
}
</script>
<style scoped>

</style>
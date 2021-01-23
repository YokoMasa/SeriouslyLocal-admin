<template>
  <div class="wrapper">
    <admin-header></admin-header>
    <div class="bodyWrapper">
      <div class="content">
        <h3>Menu</h3>
        <router-link class="listItem" to="/place_article">place article</router-link>
        <router-link class="listItem" to="/prefecture">prefecture info</router-link>
        <router-link class="listItem" to="/category">category</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AdminHeader from '../components/AdminHeader.vue';

export default {
  components: {
    AdminHeader
  }  
};
</script>
<style scoped>

</style>
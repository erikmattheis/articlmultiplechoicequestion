<template>
  <article>
    <h1>Articls</h1>
    <div class="grid">
      <the-articls-form-search />
      <div>
        <the-articls-search-params />
      </div>
    </div>
    <articls-list />
  </article>
</template>

<script>
import TheArticlsFormSearch from '@/components/layout/TheArticlsSearchForm.vue';
import TheArticlsSearchParams from '@/components/layout/TheArticlsSearchParams.vue';
import ArticlsList from '@/components/layout/ArticlsList.vue';

export default {
  name: 'ArticlsSearch',
  components: {
    TheArticlsFormSearch,
    TheArticlsSearchParams,
    ArticlsList,
  },
  data() {

    return {};

  },
};
</script>

<style scoped>
</style>

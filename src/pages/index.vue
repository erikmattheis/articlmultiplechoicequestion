<template>
  <article>
    <h2>{{ title }} <span :aria-busy="isLoading" /></h2>
    <ul>
      <li
        v-for="category in categories || []"
        :key="category.slug"
      >
        <router-link :to="{ name: 'categoryPage', params: { slug: category.slug } }">
          {{ category.title }}
        </router-link>
      </li>

      <li v-if="isLoggedIn">
        <router-link :to="{ name: 'createCategoryPage', query: { parentSlug: '0' } }">
          New Category Here
        </router-link>
      </li>
      <li v-if="isLoggedIn">
        <router-link :to="{ name: 'createArticlPage', query: { slug: '0' } }">
          New Articl Here
        </router-link>
      </li>
    </ul>
  </article>
</template>

<script>
import { isLoggedIn } from '@/services/tokensService';

import { setTitleAndDescription } from '@/services/htmlMetaService';

export default {
  name: 'HomePage',
  // components: { TheBreadcrumbs },
  data() {

    return {
      isLoading: true,
      slug: null,
      title: '',
      categories: [],
    };

  },
  computed: {
    isLoggedIn,
  },
  created() {

    this.categories = this.fetchData('0');

  },
  mounted() {

    this.setTitleAndDescription();

  },
  methods: {
    async fetchData(slug) {

      try {

        this.isLoading = true;

        const result = await this.getCategoryPageBySlug(slug);
        const documentTitle = result?.data?.category[0]?.title;
        const metaDescription = result?.data?.category[0]?.description;

        this.title = documentTitle;
        this.$store.dispatch('metas/setMetaDescriptionAndDocumentTitle', {
          documentTitle,
          metaDescription,
        });
        this.categories = result.data.categories;

      } catch (error) {

        this.$store.dispatch('errors/setError', error);

      } finally {

        this.isLoading = false;

      }

    },
    getCategoryPageBySlug(slug) {

      return this.$http({

        method: 'GET',
        url: `/d/${slug || ''}`,

      });

    },
    setTitleAndDescription,
  },
};
</script>

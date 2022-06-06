<template>
  <article>
    <h2>{{ title }}</h2>

    <draggable-items
      v-model="categories"
      tag="ul"
      item-key="id"
      handle=".handle"
      ghost-class="ghost"
      @change="onUpdateOrderValues"
    >
      >
      <template #item="{element}">
        <articls-list-item
          :articl="element"
          order="0"
        />
      </template>
    </draggable-items>

    <ul v-if="isLoggedIn">
      <li>
        <router-link
          :to="{
            name: 'createCategoryPage',
            query: {parentSlug: $route.params.slug},
          }"
        >
          New Category Here
        </router-link>
      </li>
      <li>
        <router-link
          :to="{
            name: 'createArticlPage',
            query: {slug: $route.params.slug},
          }"
        >
          New Articl Here
        </router-link>
      </li>
    </ul>

    <template
      v-for=" articlType in articlTypes"
      :key="articlType"
    >
      <ul>
        <li
          v-for=" articl in articls[ articlType ]||[]"
          :key="articl.id"
        >
          {{ articl.title }}
          <articls-list-item
            :articl="articl"
            :order="articl.order"
          />
        </li>
      </ul>
    </template>
  </article>
</template>

<script>
import { setTitleAndDescription } from '@/services/htmlMetaService';
import { groupBy } from 'lodash';
import DraggableItems from 'vuedraggable';
import ArticlsListItem from '@/components/layout/ArticlsListItem.vue';
import { isLoggedIn } from '@/services/tokensService';

export default {
  name: 'CategoryPage',
  components: {
    DraggableItems, ArticlsListItem,
  },
  data() {

    return {
      isLoading: true,
      slug: null,
      title: '',
      categories: [],
      articls: [],
      articlTypes: [],
    };

  },
  computed: {
    isLoggedIn,
  },
  watch: {
    '$route.params.slug': {
      handler() {

        this.updateData();

      },
      immediate: true,
    },
  },
  created() {

    this.updateData();

  },
  methods: {
    async updateData() {

      const results = await this.fetchData(this.$route.params.slug);

      this.categories = results.categories;

      this.articlTypes = results.articlTypes;

      this.articls = results.articls;

      this.title = results.category[0]?.title;

      const description = results.category[0]?.description;

      this.setTitleAndDescription({
        title: this.title, description,
      });

      this.isLoading = false;

      console.log(
        'categories',
        this.categories?.length,
      );

      console.log(
        'articlTypes',
        this.articlTypes?.length,
      );

      console.log(
        'articls',
        this.articls?.length,
      );

    },

    async fetchData(slug) {

      const result = await this.$http({
        method: 'GET',
        url: `/d/${slug || ''}`,
      });

      return {
        categories: result.categories,
        articlTypes: result.articls?.length
          ? [...new Set(result.articls.map((item) => item.type))]
          : [],
        articls: groupBy(result.articls, (articl) => articl.type),
      };

    },

    updateOrderValues() {

      this.categories.forEach((obj, index) => {

        const objRef = obj;

        objRef.order = index;

      });

    },

    async saveOrderValues() {

      const order = this.categories.map((obj) => ({
        id: obj.id, order: obj.order,
      }));

      await this.saveOrder(order);

    },

    async saveOrder(order) {

      this.isLoading = true;

      const result = await this.$http({
        method: 'POST',
        url: '/categories/order',
        data: {
          order,
        },
      });

      this.isLoading = false;

      return result.data;

    },

    onUpdateOrderValues() {

      this.updateOrderValues();

      this.saveOrderValues();

    },
    setTitleAndDescription,
  },
};
</script>

<style lang="css" scoped>
pre {
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.ghost {
  border: 2px dashed red;
}

.ghost {
  border: 2px dashed red;
}
</style>

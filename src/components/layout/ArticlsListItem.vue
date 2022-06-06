<template>
  <li class="grid">
    <div
      v-if="isLoggedIn&&$route.name!=='searchArticls'&&articl"
      class="handle handle-container"
    >
      <a href="#"><span class="sr">Reorder articl</span>
        <vue-feather
          alt="reorder articl"
          size="1rem"
          type="move"
          aria-label="move"
        />
      </a>
    </div>
    <ul>
      <li>
        <a :href="articl.url">
          {{ highlightedSubstring(articl.title,params.title,"prefix")
          }}<strong
            :class="{
              'not-strong': noCaseIndexOf(articl.title,params.title)===-1,
            }">{{
            highlightedSubstring(articl.title,params.title,"term")
          }}</strong>{{ highlightedSubstring(articl.title,params.title,"suffix") }}</a>
      </li>
      <li v-if="articl.titleExcerpt">
        <a :href="articl.url">
          {{ highlightedSubstring(articl.titleExcerpt,params.title,"prefix")
          }}<strong
            :class="{
              'not-strong':
                noCaseIndexOf(articl.titleExcerpt,params.title)===-1,
            }">{{
            highlightedSubstring(articl.titleExcerpt,params.title,"term")
          }}</strong>{{
            highlightedSubstring(articl.titleExcerpt,params.title,"suffix")
          }}</a>
      </li>
      <li v-if="params.authors">
        {{ highlightedSubstring(articl.authors,params.authors,"prefix")
        }}<strong
          :class="{
            'not-strong': noCaseIndexOf(articl.authors,params.authors)===-1,
          }">{{
          highlightedSubstring(articl.authors,params.authors,"term")
        }}</strong>{{ highlightedSubstring(articl.authors,params.authors,"suffix") }}
      </li>
      <li v-if="params.journal">
        <strong>{{ articl.journal }}</strong>
      </li>
      <li v-if="articl.yearComparison&&Number(articl.year)!==yearsStart">
        <strong>{{ articl.yearComparison }}{{ articl.year }}</strong>
      </li>
    </ul>
    <div v-if="isLoggedIn">
      <articl-actions
        :id="articl.id"
        :title="articl.title"
      />
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex';
import VueFeather from 'vue-feather';
import { isLoggedIn } from '@/services/tokensService';
import { highlightedSubstring, noCaseIndexOf } from '@/services/stringsService';
import ArticlActions from '@/components/layout/ArticlActions.vue';

export default {
  name: 'ArticlsListItem',
  components: {
    VueFeather,
    ArticlActions,
  },
  props: {
    articl: Object,
  },
  data() {

    return {
      articls: [],
      totalResults: '--',
      isLoading: false,
    };

  },

  computed: {
    isLoggedIn,
    ...mapGetters({
      params: 'articlsParams/params',
      allTypes: 'articlsParams/allTypes',
      allStatuses: 'articlsParams/allStatuses',
      yearsStart: 'articlsParams/yearsStart',
    }),
  },
  methods: {
    highlightedSubstring,
    noCaseIndexOf,
  },
};
</script>

<style scoped>
#app > main > article > div > div > small > ul > li > a {
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
  color: red !important;
}

.handle-container {
  width: 1rem !important;
}

strong:not([class="not-strong"]) {
  background-color: #749157;
  color: black;
  padding: 0.2rem 0.1rem;
}

li {
  font-size: 0.65rem;
}
</style>


<template>
  <small>
    <ul>
      <li v-if="params.text">
        Search for <strong>{{ params.text }}</strong>
        <a
          href
          @click.prevent="resetValue('text')"
          @keyup.enter="resetValue('text')"
        >
          <vue-feather
            size="1.2rem"
            type="x-square"
          /><span class="sr">Reset search value to empty</span>
        </a>
      </li>
      <li v-if="params.title">
        Title contains <strong>{{ params.title }}</strong>
        <a
          href
          @click.prevent="resetValue('title')"
          @keyup.enter="resetValue('title')"
        >
          <vue-feather
            size="1.2rem"
            type="x-square"
          /><span class="sr">Reset title value to empty</span>
        </a>
      </li>

      <li v-if="params.journal">
        Journal is <strong>{{ params.journal }}</strong>
        <a href @click.prevent="resetValue('journal')" @keyup.enter="resetValue('journal')">
          <vue-feather
            size="1.2rem"
            type="x-square"
          /><span class="sr">Reset journal value to empty</span>
        </a>
      </li>

      <li v-if="params.authors">
        Authors contains <strong>{{ params.authors }}</strong>
        <a href @click.prevent="resetValue('authors')" @keyup.enter="resetValue('authors')">
          <vue-feather
            size="1.2rem"
            type="x-square"
          /><span class="sr">Reset authors value to empty</span>
        </a>
      </li>

      <li v-if="params.year && Number(params.year) !== yearsStart">
        Year is
        <strong>{{ params.yearComparison }} {{ params.year }}</strong>
        <a
          href @click.prevent="resetValue('year')" @keyup.enter="resetValue('year')">
          <vue-feather
            size="1.2rem"
            type="x-square"
          ><span class="sr">Reset year value to {{ yearsStart }}</span>
          </vue-feather></a>
      </li>

      <li
        v-if="
          params?.types?.length && params?.types?.length !== allTypes?.length
        ">
        Type is <span v-if="params?.types?.length > 1">one of </span>
        <strong>{{ toListWithOptionalConjuction(params.types, "or") }}</strong>
        <a href @click.prevent="resetValue('types')" @keyup.enter="resetValue('types')">
          <vue-feather
            size="1.2rem"
            type="x-square"
          /><span class="sr">Reset type value to all types</span>
        </a>
      </li>

      <li
        v-if="
          params?.statuses?.length &&
            params?.statuses?.length !== allStatuses?.length
        ">
        Status is <span v-if="params?.statuses?.length > 1">one of </span>
        <strong>{{
          toListWithOptionalConjuction(params.statuses, "or")
        }}</strong>
        <a
          href
          @click.prevent="resetValue('statuses')" @keyup.enter="resetValue('statuses')">
          <vue-feather
            size="1.2rem"
            type="x-square"
          ><span class="sr">Reset statuses value to all statuses</span>
          </vue-feather></a>
      </li>
    </ul>
  </small>
</template>

<script>
import { mapGetters } from 'vuex';
import VueFeather from 'vue-feather';
import { toListWithOptionalConjuction } from '@/services/stringsService';

export default {
  name: 'TheArticlsSearchParams',
  components: {
    VueFeather,
  },
  data() {

    return {
    };

  },
  computed: {
    ...mapGetters({
      params: 'articlsParams/params',
      allTypes: 'articlsParams/allTypes',
      allStatuses: 'articlsParams/allStatuses',
      yearsStart: 'articlsParams/yearsStart',
    }),
  },
  methods: {
    resetValue(arrName) {

      switch (arrName) {

        case 'statuses': {

          this.$store.dispatch(
            'articlsParams/statuses',
            this.allStatuses.slice(),
          );

          break;

        }

        case 'types': {

          this.$store.dispatch('articlsParams/types', this.allTypes.slice());

          break;

        }

        case 'text': {

          this.$store.dispatch('articlsParams/text', '');

          break;

        }

        case 'title': {

          this.$store.dispatch('articlsParams/title', '');

          break;

        }

        case 'journal': {

          this.$store.dispatch('articlsParams/journal', '');

          break;

        }

        case 'authors': {

          this.$store.dispatch('articlsParams/authors', '');

          break;

        }

        case 'year': {

          this.$store.dispatch('articlsParams/year', this.yearsStart);

          break;

        }

        default:
          throw new Error('Unknown search parameter passed.');

      }

    },
    toListWithOptionalConjuction,
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
strong:not([class="not-strong"]) {
  background-color: #749157;
  color: black;
  padding: 0.2rem 0.1rem;
}
</style>

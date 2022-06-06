<template>
  <form>
    <ul class="grid nav-tabs">
      <li :class="{ active: activeTab === 0 }">
        <a
          href
          @click.prevent="activeTab = 0"
          @keyup.enter.prevent="activeTab = 0"
        >Search</a>
      </li>
      <li :class="{ active: activeTab === 1 }">
        <a
          href
          @click.prevent="activeTab = 1"
          @keyup.enter.prevent="activeTab = 1"
        >More options</a>
      </li>
    </ul>
    <div
      v-show="activeTab === 0"
      class="active tab-content"
    >
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
        type="text"
      >
    </div>
    <div
      v-show="activeTab === 1"
      class="active tab-content"
    >
      <label for="journal">Journal</label>
      <input-typeahead
        src="/articls/journal"
        :input-value="journal"
        query="journal"
        @typeahead-updated="onJournalChange"
      />

      <label for="author">Author</label>
      <input-typeahead
        src="/articls/authors"
        :input-value="authors"
        query="authors"
        @typeahead-updated="onAuthorsChange"
      />

      <label>Year published</label>
      <label
        v-if="yearsStart === Number(year)"
        class="horizontal"
      ><input
        v-model="yearComparison"
        type="radio"
        value="after"
        name="yearComparison"
      >
        After
      </label>
      <label
        v-for="comparison in yearComparisons"
        v-else
        :key="comparison"
        class="horizontal"
      ><input
         v-model="yearComparison"
         type="radio"
         :value="comparison"
         name="yearComparison"
       >
        {{ comparison }}
      </label>
      <select
        v-model="year"
        autocomplete="off"
        @change="onYearChange"
      >
        <option
          v-for="i in years"
          :key="i"
        >
          {{ i }}
        </option>
      </select>

      <div class="grid">
        <div>
          <fieldset>
            Type
            <label
              v-for="type in allTypes"
              :key="type"
            >
              <input
                v-model="types"
                type="checkbox"
                :value="type"
                checked="checked"
              >{{ type }}</label>
          </fieldset>
        </div>
        <div>
          <fieldset>
            Status
            <label
              v-for="status in allStatuses"
              :key="status"
            >
              <input
                v-model="statuses"
                type="checkbox"
                :value="status"
                checked="checked"
              >{{ status }}</label>
          </fieldset>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import { debounce } from 'lodash';
import InputTypeahead from '@/components/ui/InputTypeahead.vue';

export default {
  name: 'TheArticlsFormSearch',
  components: {
    InputTypeahead,
  },
  data() {

    return {
      activeTab: 0,
      allStatuses: this.$store.state.articlsParams.allStatuses,
      allTypes: this.$store.state.articlsParams.allTypes,
      yearsStart: this.$store.state.articlsParams.yearsStart,
      yearComparisons: this.$store.state.articlsParams.yearComparisons,
    };

  },
  computed: {
    ...mapGetters({
      years: 'articlsParams/years',
    }),
    text: {
      get() {

        return this.$store.state.articlsParams.text;

      },
      set(value) {

        this.$store.dispatch('articlsParams/text', value);

      },
    },
    title: {
      get() {

        return this.$store.state.articlsParams.title;

      },
      set(value) {

        this.$store.dispatch('articlsParams/title', value);

      },
    },
    journal: {
      get() {

        return this.$store.state.articlsParams.journal;

      },
      set(value) {

        this.$store.dispatch('articlsParams/journal', value);

      },
    },
    authors: {
      get() {

        return this.$store.state.articlsParams.authors;

      },
      set(value) {

        this.$store.dispatch('articlsParams/authors', value);

      },
    },
    yearComparison: {
      get() {

        return this.$store.state.articlsParams.yearComparison;

      },
      set(value) {

        this.$store.dispatch('articlsParams/yearComparison', value);

      },
    },
    year: {
      get() {

        return this.$store.state.articlsParams.year;

      },
      set(value) {

        if (Number(value) === Number(this.yearsStart)) {

          this.$store.dispatch('articlsParams/yearComparison', 'after');

        }

        this.$store.dispatch('articlsParams/year', value);

      },
    },
    types: {
      get() {

        return this.$store.state.articlsParams.types;

      },
      set(value) {

        this.$store.dispatch('articlsParams/types', value);

      },
    },
    statuses: {
      get() {

        return this.$store.state.articlsParams.statuses;

      },
      set(value) {

        this.$store.dispatch('articlsParams/statuses', value);

      },
    },
  },
  watch: {
    yearComparison: {
      handler(newValue) {

        this.$store.dispatch('articlsParams/yearComparison', newValue);

      },
      deep: true,
    },
  },
  created() {

    this.$store.dispatch(
      'articlsParams/statuses',
      this.$store.state.articlsParams.allStatuses,
    );
    this.$store.dispatch(
      'articlsParams/types',
      this.$store.state.articlsParams.allTypes,
    );
    this.onTitleChange = debounce(this.onTitleChange, 200);

  },
  methods: {
    onTypesChange() {

      this.$store.dispatch('articlsParams/types', event.target.value);

    },
    onYearChange(event) {

      this.$store.dispatch('articlsParams/year', event.target.value);

    },
    onJournalChange(event) {

      this.$store.dispatch('articlsParams/journal', event.value);

    },
    onAuthorsChange(event) {

      this.$store.dispatch('articlsParams/authors', event.value);

    },
    onTitleChange(event) {

      this.$store.dispatch('articlsParams/title', event.target.value);

    },
    onYearComparisonChange(event) {

      this.$store.dispatch('articlsParams/yearComparison', event.target.value);

    },
  },
};
</script>

<style lang="scss" scoped>
select {
  overflow: scroll;
}

.horizontal {
  display: inline-block;
  margin-right: 0.5rem;
}

/*
* Nav tabs
*/

.grid > li {
  display: inline-block;
  margin-top: 0;
  margin-bottom: 0;
}

.nav-tabs {
  column-gap: 0;
}

.tab-content {
  width: 100%;
  padding: 1.2rem;
}

html[data-theme="light"] {
  .nav-tabs li.active,
  .active {
    background-color: #d4d4d4;
  }
}

html[data-theme="dark"] {
  .nav-tabs li.active,
  .active {
    background-color: #17262b;
  }
}

/*
* End nav btabs
*/
</style>

<!--
<template>
  <form>
    <ul class="grid nav-tabs">
      <li :class="{ active: activeTab === 0 }">
        <a href @click.prevent="activeTab = 0">Search</a>
      </li>
      <li :class="{ active: activeTab === 1 }">
        <a href @click.prevent="activeTab = 1">More options</a>
      </li>
    </ul>
    <div v-show="activeTab === 0" class="active tab-content">
      <label for="title">Title</label>
      <input type="text" id="title" v-model="title" />
    </div>
    <div v-show="activeTab === 1" class="active tab-content">
      <label for="journal">Journal</label>
      <input-typeahead
        src="/articls/values/journal"
        @typeahead-updated="onJournalChange"
        :input-value="journal"
        query="journal"
      />

      <label for="author">Author</label>
      <input-typeahead
        src="/articls/values/authors"
        @typeahead-updated="onAuthorsChange"
        :input-value="authors"
        query="authors"
      />

      <label>Year published</label>
      <label v-if="yearsStart === Number(year)" class="horizontal"
        ><input
          type="radio"
          v-model="yearComparison"
          value="after"
          name="yearComparison"
        />
        After
      </label>
      <label
        v-else
        class="horizontal"
        v-for="comparison in yearComparisons"
        :key="comparison"
        ><input
          type="radio"
          v-model="yearComparison"
          :value="comparison"
          name="yearComparison"
        />
        {{ comparison }}
      </label>
      <select v-model="year" autocomplete="off" @change="onYearChange">
        <option v-for="i in years" :key="i">
          {{ i }}
        </option>
      </select>

      <div class="grid">
        <div>
          <fieldset>
            Type
            <label v-for="type in allTypes" :key="type">
              <input
                type="checkbox"
                :value="type"
                v-model="types"
                checked="checked"
              />{{ type }}</label
            >
          </fieldset>
        </div>
        <div>
          <fieldset>
            Status
            <label v-for="status in allStatuses" :key="status">
              <input
                type="checkbox"
                :value="status"
                v-model="statuses"
                checked="checked"
              />{{ status }}</label
            >
          </fieldset>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters } from "vuex";
import { debounce } from "lodash";
import InputTypeahead from "@/components/ui/InputTypeahead.vue";

export default {
  name: "theArticlsFormSearch",
  components: { InputTypeahead },
  data() {
    return {
      activeTab: 0,
      allStatuses: this.$store.state.articlsParams.allStatuses,
      allTypes: this.$store.state.articlsParams.allTypes,
      yearsStart: this.$store.state.articlsParams.yearsStart,
      yearComparisons: this.$store.state.articlsParams.yearComparisons,
    };
  },
  computed: {
    ...mapGetters({
      years: "articlsParams/years",
    }),
    text: {
      get() {
        return this.$store.state.articlsParams.text;
      },
      set(value) {
        this.$store.dispatch("articlsParams/text", value);
      },
    },
    title: {
      get() {
        return this.$store.state.articlsParams.title;
      },
      set(value) {
        this.$store.dispatch("articlsParams/title", value);
      },
    },
    journal: {
      get() {
        return this.$store.state.articlsParams.journal;
      },
      set(value) {
        this.$store.dispatch("articlsParams/journal", value);
      },
    },
    authors: {
      get() {
        return this.$store.state.articlsParams.authors;
      },
      set(value) {
        this.$store.dispatch("articlsParams/authors", value);
      },
    },
    yearComparison: {
      get() {
        return this.$store.state.articlsParams.yearComparison;
      },
      set(value) {
        this.$store.dispatch("articlsParams/yearComparison", value);
      },
    },
    year: {
      get() {
        return this.$store.state.articlsParams.year;
      },
      set(value) {
        if (Number(value) === Number(this.yearsStart)) {
          this.$store.dispatch("articlsParams/yearComparison", "after");
        }
        this.$store.dispatch("articlsParams/year", value);
      },
    },
    types: {
      get() {
        return this.$store.state.articlsParams.types;
      },
      set(value) {
        this.$store.dispatch("articlsParams/types", value);
      },
    },
    statuses: {
      get() {
        return this.$store.state.articlsParams.statuses;
      },
      set(value) {
        this.$store.dispatch("articlsParams/statuses", value);
      },
    },
  },
  created() {
    this.$store.dispatch(
      "articlsParams/statuses",
      this.$store.state.articlsParams.allStatuses
    );
    this.$store.dispatch(
      "articlsParams/types",
      this.$store.state.articlsParams.allTypes
    );
    this.onTitleChange = debounce(this.onTitleChange, 200);
  },
  watch: {
    yearComparison: {
      handler(newValue) {
        this.$store.dispatch("articlsParams/yearComparison", newValue);
      },
      deep: true,
    },
  },
  methods: {
    onTypesChange() {
      this.$store.dispatch("articlsParams/types", event.target.value);
    },
    onYearChange(event) {
      this.$store.dispatch("articlsParams/year", event.target.value);
    },
    onJournalChange(event) {
      this.$store.dispatch("articlsParams/journal", event.value);
    },
    onAuthorsChange(event) {
      this.$store.dispatch("articlsParams/authors", event.value);
    },
    onTitleChange(event) {
      this.$store.dispatch("articlsParams/title", event.target.value);
    },
    onYearComparisonChange(event) {
      this.$store.dispatch("articlsParams/yearComparison", event.target.value);
    },
  },
  unmounted() {
    this.$store.dispatch("articlsParams/reset");
  },
};
</script>

<style lang="scss" scoped>
select {
  overflow: scroll;
}
.horizontal {
  display: inline-block;
  margin-right: 0.5rem;
}

/*
* Nav tabs
*/

.grid > li {
  display: inline-block;
  margin-top: 0;
  margin-bottom: 0;
}

.nav-tabs {
  column-gap: 0;
}

.tab-content {
  width: 100%;
  padding: 1.2rem;
}

html[data-theme="light"] {
  .nav-tabs li.active,
  .active {
    background-color: #d4d4d4;
  }
}

html[data-theme="dark"] {
  .nav-tabs li.active,
  .active {
    background-color: #17262b;
  }
}

/*
* End nav btabs
*/
</style>
-->

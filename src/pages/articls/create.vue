<template>
  <article>
    <h1 v-if="!success">
      {{ id ? "Edit" : "Create" }} articl {{ id }}
    </h1>
    <h1 v-else>
      Articl created
    </h1>
    <template v-if="isLoggedIn">
      <form v-if="!success">
        <template v-if="!id">
          <label for="articlUrl">URL</label>
          <input
            id="articlUrl"
            v-model="articlUrl"
            type="text"
            name="articlUrl"
          >

          <button
            type="button"
            :aria-busy="buttonFetchDisabled"
            @click.prevent="getData()"
          >
            FETCH DATA
          </button>
        </template>
        <label for="">Title</label>
        <input
          id=""
          v-model="title"
          name=""
          autocomplete="off"
        >

        <label for="authors">Authors</label>
        <input
          id="authors"
          v-model="authors"
          name="authors"
          autocomplete="off"
        >

        <label for="affiliation">Affiliation</label>
        <input
          id="affiliation"
          v-model="affiliation"
          name="affiliation"
          autocomplete="off"
        >

        <label for="journal">Journal</label>
        <input
          id="journal"
          v-model="journal"
          name="journal"
          autocomplete="off"
        >

        <label for="">Publication Year</label>
        <input
          id="year"
          v-model="year"
          name="year"
          autocomplete="off"
        >

        <label for="">Publication Month</label>
        <input
          id="month"
          v-model="month"
          name="month"
          autocomplete="off"
        >

        <label for="">Abstract</label>
        <input
          id="abstract"
          v-model="abstract"
          name="abstract"
          autocomplete="off"
        >

        <label for="type">Link type</label>
        <select
          id="type"
          v-model="type"
          name="type"
          autocomplete="off"
        >
          <optgroup value="Resources">
            <option value="Review (OA)">
              Review (OA)
            </option>
            <option value="Review (OA)">
              Review (PA)
            </option>
            <option value="Research (OA)">
              Research (OA)
            </option>
            <option value="Research (PA)">
              Research (PA)
            </option>
            <option value="Web">
              Web
            </option>
            <option value="on-medical journal articles">
              Non-medical journal articles
            </option>
            <option value="Images">
              Images
            </option>
            <option value="Presentations">
              Presentations
            </option>
            <option value="Videos">
              Videos
            </option>
            <option value="Podcast">
              Podcast
            </option>
          </optgroup>
        </select>

        <label for="status">Status</label>
        <select
          id="status"
          v-model="status"
          name="status"
        >
          <option value="Published">
            Published
          </option>
          <option value="Draft">
            Draft
          </option>
          <option value="Pending">
            Pending
          </option>
          <option value="Trash">
            Trash
          </option>
        </select>

        <label for="typeaheadQuery">Category slug</label>
        <input-typeahead
          src="/categories/titles"
          query="category"
          :input-value="categorySlug"
          @update-value="onTypeaheadHit"
          @keyup="onTypeaheadHit"
        />
        <button
          type="button"
          :aria-busy="buttonDisabled"
          @click.prevent="submitForm(id)"
        >
          {{ !id ? "Create" : "Edit" }} Articl
        </button>
      </form>
      <template v-else>
        <card-notification success-message="Success" />
        <a
          href
          @click="$router.go()"
        >Create another article</a>
      </template>
    </template>
    <p v-else>
      Please <a href="/login?reditect=/articls/create">log in</a> to continue.
    </p>
  </article>
</template>

<script>
import cardNotification from '@/components/ui/CardNotification.vue';
import inputTypeahead from '@/components/ui/InputTypeahead.vue';
import { fetchData } from '@/services/fetchingService';
import { isLoggedIn } from '@/services/tokensService';

export default {
  name: 'EditArticlPage',
  components: {
    cardNotification,
    inputTypeahead,
  },
  props: {
    id: {
      default: '',
      type: String,
    },
  },
  data() {

    return {
      abstract: '',
      affiliation: '',
      articlUrl: '',
      authors: '',
      buttonDisabled: false,
      buttonFetchDisabled: false,
      categorySlug: this.$route.query.slug,
      journal: '',
      month: '',
      status: 'Published',
      success: false,
      title: '',
      type: 'Review (OA)',
      year: '',
    };

  },
  computed: {
    isLoggedIn,
  },
  mounted() {

    if (!this.id) {

      this.categorySlug = this.$route.query.slug;
      this.onTypeaheadHit({
        value: this.categorySlug,
      });

    } else {

      this.getCurrentArticl();

    }

  },
  methods: {
    async getCurrentArticl() {

      if (this.id) {

        const result = await this.getArticl(this.id);

        console.log('result', result);
        Object.assign(this, result);

      }

    },
    async getData() {

      if (this.articlUrl) {

        try {

          this.buttonFetchDisabled = true;

          const result = await fetchData(this.articlUrl);

          if (result) {

            Object.assign(this, result);

          }

        } catch (error) {

          this.$store.dispatch('errors/setError', error);

        } finally {

          this.buttonFetchDisabled = false;

        }

      } else {

        this.$store.dispatch('errors/setError', 'Please enter a URL');

      }

    },
    setTitleAndDescription() {

      const documentTitle = 'Articl.net Registration';
      const metaDescription = '';

      this.$store.dispatch('metas/setMetaDescriptionAndDocumentTitle', {
        documentTitle,
        metaDescription,
      });

    },
    resetFormErrors() {

      this.success = null;
      this.result = null;
      this.errorMessage = '';

    },
    checkForm() {

      this.resetFormErrors();

      let passed = true;

      if (!this.title === '') {

        this.errorMessage = 'Please enter a title.';
        passed = false;

      } else if (this.authors === '') {

        this.errorMessage = 'Please enter author names.';
        passed = false;

      } else if (this.type === '') {

        this.errorMessage = 'Please enter a type.';
        passed = false;

      } else if (this.status === '') {

        this.errorMessage = 'Please choose a status.';
        passed = false;

      }

      return passed;

    },
    async submitForm(id) {

      this.resetFormErrors();

      if (this.checkForm() === true) {

        this.buttonDisabled = true;

        const verb = id ? 'PUT' : 'POST';

        this.$http({
          method: verb,
          url: `/articls/${id}`,
          data: {
            abstract: this.abstract,
            affiliation: this.affiliation,
            articlUrl: this.articlUrl,
            type: this.type,
            authors: this.authors,
            categorySlug: this.categorySlug,
            journal: this.journal,
            month: this.month,
            status: this.status,
            title: this.title,
            year: this.year,
          },
        })
          .then((result) => {

            if (result.data) {

              this.success = true;
              this.result = result.data;

            }

          })
          .catch((error) => {

            this.$store.dispatch('errors/setError', error);

          })
          .finally(() => {

            this.buttonDisabled = false;

          });

      } else {

        this.$store.dispatch('errors/setError', {
          message: this.errorMessage,
        });

      }

    },

    async getArticl(id) {

      this.buttonDisabled = true;

      return this.$http({
        method: 'GET',
        url: `/articls/${id}`,
      })
        .then((result) => result.data)
        .catch((error) => {

          this.$store.dispatch('errors/setError', error);

        })
        .finally(() => {

          this.buttonDisabled = false;

        });

    },
    onTypeaheadHit(e) {

      this.categorySlug = e.value;

    },
  },
};
</script>

<style scoped>
form input.another {
  padding-right: 4.6 rem;
}
form input.another button {
  position: absolute;
  top: 0;
  right: 0;
  width: 4.4rem;
}
</style>

<template>
  <article>
    <h1 v-if="!success">
      Create category
    </h1>
    <h1 v-else>
      Category created
    </h1>

    <template v-if="isLoggedIn">
      <form v-if="!success">
        <label for="title">Title
          <input
            id="title"
            v-model="title"
            type="text"
            name="title"
          ></label>
        <label for="slug">Slug
          <input
            id="slug"
            v-model="slug"
            readonly
            type="text"
            name="slug"
          ></label>
        <label for="parentSlug">Parent slug
          <input
            id="parentSlug"
            v-model="parentSlug"
            type="text"
            name="parentSlug"
          ></label>

        <label for="description">Description
          <textarea
            id="description"
            name="description"
            rows="10"
            cols="70"
          /></label>
        <button
          id="Login"
          type="submit"
          :aria-busy="buttonDisabled"
          @click.prevent="submitForm()"
        >
          <span v-if="!buttonDisabled">Create Category</span>
        </button>
      </form>
      <template v-else>
        <card-notification success-message="Category created." />
        <a
          href
          @click="$router.go()"
          @keyup.enter="$router.go()"
        >Create another category</a>
      </template>
    </template>
    <p v-else>
      Please <a href="/login?reditect=/categories">log in</a> to continue.
    </p>
  </article>
</template>

<script>
import CardNotification from '@/components/ui/CardNotification.vue';
import { isLoggedIn } from '@/services/tokensService';

export default {
  name: 'CreateCategoryPage',
  components: {
    CardNotification,
  },
  data() {

    return {
      title: null,
      description: null,
      parentSlug: null,
      categories: [],
      buttonDisabled: false,
      errorMessage: '',
      success: false,
      result: null,
      chrs: 0,
    };

  },
  computed: {
    slug() {

      if (!this.title) {

        return '';

      }

      let str = this.title.replace(
        /\s/g,
        '-',
      );

      str = str.toLowerCase();

      return encodeURIComponent(str);

    },
    isLoggedIn,
  },
  mounted() {

    this.parentSlug = this.$route.query.parentSlug;

  },

  params: {
    slug: String,
  },
  methods: {
    resetFormErrors() {

      this.success = null;

      this.result = null;

      this.errorMessage = '';

    },
    checkForm() {

      this.resetFormErrors();

      let passed = true;

      if (!this.title) {

        this.titleInvalid = true;

        this.errorMessage = 'Please enter a title.';

        passed = false;

      } else if (!this.slug) {

        this.slugInvalid = true;

        this.errorMessage = 'Please enter a slug.';

        passed = false;

      } else if (!this.parentSlug) {

        this.parentIdInvalid = true;

        this.errorMessage = 'Please eselect a parent category.';

        passed = false;

      }

      return passed;

    },
    async submitForm() {

      this.resetFormErrors();

      if (this.checkForm() === true) {

        this.buttonDisabled = true;

        this.$http({
          method: 'POST',
          url: '/categories',
          data: {
            title: this.title,
            slug: this.slug,
            description: this.description,
            parentSlug: this.parentSlug,
          },
        })
          .then((result) => {

            if (result.data) {

              this.success = true;

              this.result = result.data;

            }

          })
          .catch((error) => {

            this.$store.dispatch(
              'errors/setError',
              error,
            );

          })
          .finally(() => {

            this.buttonDisabled = false;

          });

      } else {

        this.$store.dispatch(
          'errors/setError',
          {
            message: this.errorMessage,
          },
        );

      }

    },
  },
};
</script>

<style scoped>
*[readonly] {
  cursor: not-allowed;
}

.success {
  border: 8px solid green;
  background-color: honeydew;
}
</style>

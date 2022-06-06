<template>
  <article>
    <h1 v-if="!success">
      Import categories
    </h1>
    <h1 v-else>
      Categories imported
    </h1>
    <form v-if="!success">
      <button
        id="Login"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        Start
      </button>
      <pre>{{ result }}</pre>
    </form>
  </article>
</template>

<script>
export default {
  name: 'ImportCategoriesPage',
  data() {

    return {
      buttonDisabled: false,
      success: false,
      result: null,
      chrs: 0,
    };

  },
  methods: {
    async submitForm() {

      this.buttonDisabled = true;
      this.$http({
        method: 'POST',
        url: '/categories/import-categories',
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

<template>
  <article>
    <h1>Delete Articl</h1>
    <p>Really delete "{{ title }}"?</p>
    <form>
      <button
        v-if="!!id"
        @click="deleteArticl()"
      >
        Delete
      </button>
    </form>
  </article>
</template>

<script>
export default {
  name: 'DeleteArticl',
  components: {
  },
  data() {

    return {
      id: undefined,
      title: 'Nothing to delete',
    };

  },
  mounted() {

    if (this.$route.params?.id) {

      this.id = this.$route.params?.id;

      this.title = this.$route.params?.title;

    }

  },
  methods: {
    async deleteArticl() {

      const result = await this.submitDelete(this.id);

      console.log('result', result);

      this.$store.dispatch('modals/setSuccessTitle', 'Deletion successful.');

      this.$store.dispatch(
        'modals/setSuccessMessage',
        `The articl "${this.title}" has been permanently deleted.`,
      );

    },
    async submitDelete(id) {

      this.buttonDisabled = true;

      const result = await this.$http({
        method: 'DELETE',
        url: '/articls',
        data: {
          id,
        },
      });

      return result;

    },
  },
};
</script>

<style scoped>
</style>

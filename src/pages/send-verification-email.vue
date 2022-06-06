<template>
  <article>
    <p v-text="result" />
  </article>
</template>

<script>
export default {
  data() {

    return {
      result: null,
    };

  },
  mounted() {

    this.$http({
      method: 'GET',
      url: `/auth/send-verification-email?token=${this.$route.query.token}`,
    })
      .then(() => {

        this.result = 'Click the link in the email we sent to verify your address.';

      })

      .catch((error) => {

        this.$store.dispatch(
          'errors/setError',
          error,
        );

      });
    this.setTitleAndDescription({
      title: 'Verification sent',
    });

  },
  methods: {},
};
</script>

<style scoped>
</style>

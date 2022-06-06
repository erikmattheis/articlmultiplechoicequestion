<template>
  <article>
    <h1>{{ resultTitle }}</h1>
    <p v-if="resultTitle">
      Please <a href="/login">log in</a> to continue.
    </p>
  </article>
</template>

<script>
import { setTitleAndDescription } from '@/services/htmlMetaService';

export default {
  name: 'VerifyEmailPage',
  data() {

    return {
      resultTitle: null,
      result: null,
    };

  },
  mounted() {

    this.submitForm();

    this.setTitleAndDescription({
      title: 'Forgot Password',
    });

  },
  methods: {
    setTitleAndDescription,
    async submitForm() {

      this.buttonDisabled = true;

      const response = await this.$http({
        method: 'GET',
        url: `/auth/verify-email?token=${this.$route.query.token}`,
      });

      if (response?.status === 204) {

        this.resultTitle = 'Email verified';

      } else {

        this.$store.dispatch(
          'errors/setError',
          response,
        );

      }

      this.buttonDisabled = false;

    },
  },
};

</script>

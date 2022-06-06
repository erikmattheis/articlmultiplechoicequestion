<template>
  <article>
    <h1>Forgot password</h1>
    <form v-if="!result">
      <label for="email">Email
        <input
          id="email"
          v-model="email"
          type="text"
          name="email"
          autocomplete="email"
        ></label>
      <input
        id="username"
        type="hidden"
        name="username"
        value=""
        autocomplete="username"
      >
      <button
        id="reset"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Reset</span>
      </button>
    </form>
    <p v-if="result">
      {{ result }}
    </p>
    <p
      v-if="errorMessage"
      class="error"
    >
      {{ errorMessage }}
    </p>
  </article>
</template>

<script>
import { setTitleAndDescription } from '@/services/htmlMetaService';

export default {
  name: 'ForgotPass',
  data() {

    return {
      email: null,
      emailInvalid: null,
      errorMessage: '',
      buttonDisabled: false,
      result: null,
    };

  },
  mounted() {

    this.setTitleAndDescription();

  },
  methods: {
    resetForm() {

      this.emailInvalid = null;

      this.result = null;

    },
    checkForm() {

      return this.email !== '';

    },
    async submitForm() {

      this.resetForm();

      if (this.checkForm() === true) {

        this.buttonDisabled = true;

        this.$http({
          method: 'POST',
          url: '/auth/forgot-password',
          data: {
            email: this.email,
          },
        })
          .then((result) => {

            this.$store.dispatch('modals/setSuccessTitle', 'Email sent');

            this.$store.dispatch('modals/setSuccessMessage', 'Check your email for instructions how to reset your password.');

            if (result?.data?.message) {

              this.result = result?.data?.message;

            } else {

              this.result = result.response;

            }

          })
          .catch((error) => {

            this.$store.dispatch('errors/setError', error);

          })
          .finally(() => {

            this.buttonDisabled = false;

          });

      }

    },
    setTitleAndDescription,
  },
};
</script>

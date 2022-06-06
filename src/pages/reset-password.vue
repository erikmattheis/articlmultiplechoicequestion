<template>
  <article>
    <h1>Reset password</h1>
    <form ng-if="!result">
      <input
        id="username"
        type="hidden"
        name="username"
        value=""
        autocomplete="username"
      >

      <label for="password">New password
        <small
          v-if="passwordComplexity < 3"
          class="lighter left-space"
        >
          Use upper- and lowercase, numerical and special characters.
        </small>
        <small
          v-else-if="password.length < 8"
          class="lighter left-space"
        >
          Please use 8 or more characters.
        </small>

        <div class="toggle-password">
          <input
            v-if="showPassword"
            id="password"
            v-model="password"
            type="text"
            name="password"
            autocomplete="new-password"
          >
          <input
            v-if="!showPassword"
            id="password2"
            v-model="password"
            type="password"
            name="password2"
            autocomplete="new-password"
          >
          <the-button-toggle-hidden
            class="togglePasswordMask"
            @show="showPassword = !showPassword"
          />
        </div>
      </label>
      <label for="password3">Confirm new password
        <div class="toggle-password">
          <input
            v-if="showPassword2"
            id="password3"
            v-model="password2"
            type="text"
            name="passwor32"
            autocomplete="new-password"
          >
          <input
            v-if="!showPassword2"
            id="password4"
            v-model="password2"
            type="password"
            name="password4"
            autocomplete="new-password"
          >
          <the-button-toggle-hidden
            class="togglePasswordMask"
            @show="showPassword2 = !showPassword2"
          />
        </div>
      </label>

      <button
        id="reset"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Reset Password</span>
      </button>
      <p
        v-if="result"
        class="invalid"
      >
        {{ result }}
      </p>
    </form>
  </article>
</template>

<script>
import { scoreChars, validateEmail } from '@/services/userService';
import { setTitleAndDescription } from '@/services/htmlMetaService';
import theButtonToggleHidden from '@/components/ui/TheButtonToggleHidden.vue';

export default {
  name: 'PasswordReset',
  components: {
    theButtonToggleHidden,
  },
  data() {

    return {
      email: null,
      password: null,
      password2: null,
      showPassword: false,
      showPassword2: false,
      buttonDisabled: false,
      passwordComplexity: 0,
      errorMessage: '',
      success: false,
      result: null,
      chrs: 0,
    };

  },
  watch: {
    password: {
      handler(val) {

        this.passwordComplexity = this.scoreChars(val);

      },
    },
  },
  mounted() {

    this.setTitleAndDescription({
      title: 'Reset Password',
    });

  },
  methods: {
    checkForm() {

      let passed = true;

      if (this.validateEmail(this.email)) {

        this.errorMessage = 'Please enter a valid email.';

        passed = false;

      } else if (this.password && this.password.length < 8) {

        this.errorMessage = 'Passwords are at least eight characters.';

        passed = false;

      }

      return passed;

    },

    resetFormErrors() {

      this.success = null;

      this.result = null;

    },

    async submitForm() {

      const {
        token,
      } = this.$route.query;

      if (this.checkForm() === true) {

        this.buttonDisabled = true;

        await this.$http({
          method: 'POST',
          url: '/auth/reset-password',
          params: {
            token,
          },
          data: {
            password: this.password,
          },
        });

        this.$store.dispatch('modals/setSuccessTitle', 'Password updated');

        this.$store.dispatch(
          'modals/setSuccessMessage',
          'You have successfully changed your password.',
        );

        this.buttonDisabled = false;

      } else {

        this.$store.dispatch('errors/setError', this.errorMessage);

      }

    },
    scoreChars,
    validateEmail,
    setTitleAndDescription,
  },
};
</script>

<style scoped>
.toggle-password {
  position: relative;
}

.togglePasswordMask {
  position: absolute;
  right: 1rem;
  top: 40%;
  transform: translateY(-40%);
  cursor: pointer;
  height: 2.2rem;
  width: 2.2rem;
}

.success {
  border: 8px solid green;
  background-color: honeydew;
}
</style>

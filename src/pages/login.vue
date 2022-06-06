<template>
  <article>
    <h1>Log in</h1>
    <form v-if="!isLoggedIn">
      <input
        id="username"
        type="hidden"
        name="username"
        autocomplete="username"
      >
      <label for="email">Email
        <input
          id="email"
          v-model="email"
          type="text"
          name="email"
          autocomplete="email"
        ></label>

      <label for="password">Password<div class="toggle-password">
        <input
          v-if="showPassword"
          id="password"
          v-model="password"
          type="text"
          name="password"
          autocomplete="current-password"
        >
        <input
          v-if="!showPassword"
          id="password"
          v-model="password"
          type="password"
          name="password"
          autocomplete="current-password"
        >
        <the-button-toggle-hidden
          class="togglePasswordMask"
          @show="showPassword = !showPassword"
        />
      </div></label>
      <button
        id="Login"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Login</span>
      </button>
    </form>
    <p v-else>
      You are already logged in.
    </p>
    <router-link to="/forgot-pass">
      Forgot pass
    </router-link>
    <router-link
      to="/register"
      class="right"
    >
      Create account
    </router-link>
  </article>
</template>

<script>
import { isLoggedIn, setTokens } from '@/services/tokensService';
import { setTitleAndDescription } from '@/services/htmlMetaService';
import theButtonToggleHidden from '@/components/ui/TheButtonToggleHidden.vue';
import validateEmail from '@/services/emailValidationService';

export default {
  name: 'LoginPage',
  components: {
    theButtonToggleHidden,
  },
  data() {

    return {
      email: null,
      emailInvalid: null,
      password: null,
      passwordInvalid: null,
      showPassword: false,
      buttonDisabled: false,
    };

  },
  computed: {
    isLoggedIn,
  },
  mounted() {

    this.setTitleAndDescription({
      title: 'Login',
    });

  },
  methods: {
    resetFormErrors() {

      this.errorMessage = '';

    },
    checkForm() {

      let passed = true;

      if (!validateEmail.validateEmail(this.email)) {

        this.errorMessage = 'Please enter a valid email.';

        passed = false;

      } else if (this.password && this.password.length < 8) {

        this.errorMessage = 'Passwords are at least eight characters.';

        passed = false;

      }

      return passed;

    },

    async submitForm() {

      if (this.checkForm() === true) {

        this.buttonDisabled = true;

        const result = this.$http({
          method: 'POST',
          url: '/auth/login',
          data: {
            password: this.password,
            email: this.email,
          },
        });

        if (result?.status > 309) {

          this.$store.dispatch(
            'errors/setError',
            result,
          );

          return;

        }

        this.resetFormErrors();

        setTokens(result);

        const theme = result?.data?.user?.theme !== 'dark' ? 'light' : 'dark';

        this.$cookies.set(
          'data-theme',
          theme,
        );

        document.documentElement.setAttribute(
          'data-theme',
          theme,
        );

        if (
          this.$route.query.redirect
          && this.$route.query.redirect !== '/login'
        ) {

          this.$router.push({
            path: this.$route.query.redirect,
          });

        } else {

          this.$router.push({
            name: 'homePage',
          });

        }

      }

      this.buttonDisabled = false;

    },
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

.right {
  float: right;
}
</style>

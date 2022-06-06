<template>
  <article>
    <h1 v-if="!success">
      Articl.net User: {{ fullName }}
    </h1>
    <h1 v-else>
      Account Updated
    </h1>
    <form>
      <fieldset class="grid">
        <div>
          <label for="nameFirst">First Name
            <input
              id="nameFirst"
              v-model="nameFirst"
              type="text"
              name="nameFirst"
              autocomplete="given-name"
            ></label>
        </div>
        <div>
          <label for="nameLast">Last Name
            <input
              id="nameLast"
              v-model="nameLast"
              type="text"
              name="nameLast"
              autocomplete="family-name"
            ></label>
        </div>
      </fieldset>
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
      <label for="institution">Institution
        <input
          id="institution"
          v-model="institution"
          type="text"
          name="institution"
          autocomplete="organization"
        ></label>
      <label for="education">Education
        <input
          id="education"
          v-model="education"
          type="text"
          name="education"
          autocomplete="education"
        ></label>
      <button
        id="Login"
        type="submit"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Update Account</span>
      </button>
    </form>
  </article>
</template>

<script>
import { setTitleAndDescription } from '@/services/htmlMetaService';
import { validateEmail } from '@/services/userService';

export default {
  name: 'UsersPage',
  data() {

    return {
      nameFirst: '',
      nameLast: '',
      email: null,
      password2: undefined,
      institution: null,
      education: null,
      buttonDisabled: false,
      errorMessage: '',
      success: false,
      result: null,
    };

  },
  computed: {
    fullName() {

      return `${this.nameFirst} ${this.nameLast}`;

    },
  },
  mounted() {

    this.fetchData();

  },
  methods: {
    async fetchData() {

      try {

        this.buttonDisabled = true;

        const result = await this.getMe();

        if (result) {

          this.nameFirst = result.nameFirst ? result.nameFirst : '';

          this.nameLast = result.nameLast ? result.nameLast : '';

          this.email = result.email ? result.email : '';

          this.institution = result.institution ? result.institution : '';

          this.education = result.education ? result.education : '';

        }

      } catch (error) {

        this.$store.dispatch('errors/setError', error);

      } finally {

        this.buttonDisabled = false;

      }

    },

    async getMe() {

      const result = await this.$http({
        method: 'GET',
        url: '/users/me',
      });

      return result.data;

    },
    resetFormErrors() {

      this.success = null;

      this.result = null;

      this.errorMessage = '';

    },
    checkForm() {

      this.resetFormErrors();

      let passed = true;

      if (!this.validateEmail(this.email)) {

        this.errorMessage = 'Please enter a valid email.';

        passed = false;

      }

      return passed;

    },

  },
  async submitForm() {

    this.resetFormErrors();

    if (this.checkForm() === true) {

      this.buttonDisabled = true;

      const result = await this.$http({
        method: 'PATCH',
        url: '/users/me',
        data: {
          nameFirst: this.nameFirst,
          nameLast: this.nameLast,
          email: this.email,
          institution: this.institution,
          education: this.education,
          theme: this.theme,
        },
      });

      if (result.data) {

        this.success = true;

        this.result = result.data;

        this.$store.dispatch('modals/setSuccessTitle', 'User Updated');

        this.$store.dispatch(
          'modals/setSuccessMessage',
          'Your account information was successfully updated.',
        );

        this.buttonDisabled = false;

      }

    } else {

      this.$store.dispatch('errors/setError', {
        message: this.errorMessage,
      });

    }

  },
  validateEmail,
  setTitleAndDescription,

};
</script>

<style scoped>
nav ul {
  display: block;
}
</style>


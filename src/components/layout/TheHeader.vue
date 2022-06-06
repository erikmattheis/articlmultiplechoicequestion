<template>
  <header>
    <article>
      <nav>
        <ul>
          <li class="brand">
            <router-link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 112.8 103.84"
              >
                <path
                  class="a"
                  d="M52.8,87.77c-18.8-5.2-28.1-26-19.5-48a17.71,17.71,0,0,1,.8-1.9A52.8,52.8,0,0,0,24,54.27c-8.6,22-1.3,43.2,17.5,48.4,18.3,5.1,40.7-6.8,49.8-27.7C80.5,86.87,66.32,91.47,52.8,87.77Z"
                />
                <path
                  class="a"
                  d="M97.1,95.38a13.88,13.88,0,0,1-3.2-4.9,9.62,9.62,0,0,1-1-4.8c0-2.5.3-11.2,1.6-26.1a194.84,194.84,0,0,0,.5-24.4c-.9-9.1-4.2-24.9-21.7-31.9-20-8-36.6.4-43.3,6.6-7.9,7.3-12.2,11-29.2,18.3a7.46,7.46,0,0,1-.8.4c19-3.9,25.8-5.5,48.6-5.5,8.3,0,16.5,2.5,21.9,7.1,4.5,3.8,6.8,13.6,7.1,19.5s.3,39.2.3,39.2c.2,4.4,2.4,7.8,6.6,10.3a33,33,0,0,0,16.8,4.4,43,43,0,0,0,11.5-1.6A24.54,24.54,0,0,1,97.1,95.38ZM37.4,17.28a2.5,2.5,0,1,1,2.5-2.5,2.48,2.48,0,0,1-2.44,2.5H37.4Z"
                />
              </svg>
            </router-link>
          </li>
          <li>
            <router-link to="/"> Articl.net </router-link>
          </li>
        </ul>

        <ul class="right">
          <li>
            <router-link :to="{ name: 'searchArticls' }" class="search-articls">
              <vue-feather size="2rem" type="search" aria-label="Search" />
            </router-link>
          </li>

          <li v-if="!isLoggedIn">
            <router-link to="/users/me">
              <vue-feather size="2rem" type="user" aria-label="User" />
            </router-link>
          </li>

          <li v-else>
            <details role="list">
              <summary aria-haspopup="listbox">
                <vue-feather size="2rem" type="user" aria-label="User" />
              </summary>

              <ul role="listbox">
                <li>
                  <label for="theme">
                    <input
                      id="theme"
                      type="checkbox"
                      name="theme"
                      role="switch"
                      :checked="theme === 'dark'"
                      :aria-checked="theme === 'dark'"
                      @click="toggleTheme()"
                    >
                    {{ theme }}</label>
                </li>

                <li>
                  <div class="grid">
                    <div>
                      <a
                        class="less-margin"
                        href
                        @click.prevent="setTextSize(0.8)"
                        @keyup.enter="setTextSize(0.8)"
                      >
                        <vue-feather
                          size="0.6rem"
                          type="type"
                          aria-label="Small text"
                          alt="Small text"
                        /><span class="sr">Small text</span>
                      </a>
                    </div>

                    <div>
                      <a
                        class="less-margin"
                        href
                        @click.prevent="setTextSize(1)"
                        @keyup.enter="setTextSize(1)"
                      >
                        <vue-feather
                          size="0.8rem"
                          type="type"
                          aria-label="Normal text"
                        /><span class="sr">Normal text</span>
                      </a>
                    </div>

                    <div>
                      <a
                        class="less-margin"
                        href
                        @click.prevent="setTextSize(1.2)"
                        @keyup.enter="setTextSize(1.2)"
                      >
                        <vue-feather
                          size="1rem"
                          type="type"
                          aria-label="Large text"
                        /><span class="sr">Large text</span>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <router-link class="less-margin" to="/users/me">
                    Edit profile
                  </router-link>
                </li>
                <li>
                  <a href="#" class="less-margin" @click.prevent="logout"
                  >Log out</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="less-margin"
                    @click.prevent="clearLocalData"
                  >For development: clear data</a
                  >
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </article>
  </header>
</template>

<script>
import VueFeather from 'vue-feather';
import { getRefreshTokenValue, isLoggedIn } from '@/services/tokensService';
import { clear as clearLocalStorage } from '@/services/localStorageService';

export default {
  components: {
    VueFeather,
  },
  data() {

    return {
      theme: 'light',
    };

  },
  computed: {
    isLoggedIn,
  },
  beforeMount() {

    const theme = this.$cookies.get('data-theme');

    this.theme = theme !== 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', this.theme);

    if (this.$cookies.isKey('--font-size')) {

      this.setTextSize(this.$cookies.get('--font-size'));

      this.originalFontSize = parseInt(getComputedStyle(document.body).getPropertyValue('--font-size'), 10);

    }

  },

  methods: {
    setTextSize(size) {

      document.documentElement.style.setProperty(
        '--font-size',
        `${18 * size}px`,
      );

      this.$cookies.set('--font-size', size);

    },

    clearLocalData() {

      this.$cookies.keys().forEach((cookie) => this.$cookies.remove(cookie));

      clearLocalStorage();

    },
    async logout() {

      const refreshToken = getRefreshTokenValue();

      if (refreshToken) {

        await this.$http({
          method: 'POST',
          url: '/auth/logout',
          data: {
            refreshToken,
          },
        });

        localStorage.clear();

        this.$store.dispatch('tokens/logout');

        this.$router.push('/');

      } else {

        localStorage.clear();

        this.$store.dispatch('tokens/logout');

      }

    },
    toggleTheme() {

      this.theme = this.theme === 'light' ? 'dark' : 'light';

      document.documentElement.setAttribute('data-theme', this.theme);

      this.$cookies.set('data-theme', this.theme);

    },
  },
};
</script>

<style scoped lang="scss">
svg {
  width: 2rem;
  height: 2rem;
}

li .grid {
  text-align: left;
}

.less-margin {
  margin: 0;
  padding: 0;
}

.a {
  fill: #039be5;
}

articl nav {
  overflow: auto;
}

.search-articls {
  margin-right: 1rem;
}

.nav-user a {
  width: 5rem;
}

.nav-user {
  margin: 0 1rem;
}
</style>

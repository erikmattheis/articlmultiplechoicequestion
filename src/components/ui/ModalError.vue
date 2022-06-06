<template>
  <div
    v-if="errorTitle"
    class="modal-container"
    @click.prevent="close()"
    @keyup.enter="close()"
  >
    <dialog
      open
      class="modal"
      @click.stop
    >
      <article class="max-container-width">
        <header>
          <vue-feather
            size="20"
            type="x-square"
            aria-label="Close"
            class="close"
            @click.prevent="close()"
          />
          <h2>{{ errorTitle }}</h2>
        </header>
        <section>
          <div
            class="tab"
            title="error"
          >
            <vue-feather
              size="3rem"
              type="alert-triangle"
            />
          </div>
          <div class="info">
            <ul>
              <li v-if="errorFileName">
                Error in file: {{ errorFileName }}
              </li>
              <li v-if="errorLineNumber">
                On line: {{ errorLineNumber }}
              </li>
              <li v-if="errorMessage">
                Message: {{ errorMessage }}
              </li>
              <li v-if="errorStack">
                <small>Stack: {{ errorStack }}</small>
              </li>
            </ul>
          </div>
        </section>
        <button @click.prevent="close()">
          OK
        </button>
      </article>
    </dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueFeather from 'vue-feather';

export default {
  components: {
    VueFeather,
  },
  data() {

    return {
      title: '',
      showErrorStack: '',
    };

  },
  computed: {
    ...mapGetters({
      errorTitle: 'errors/errorTitle',
      errorMessage: 'errors/errorMessage',
      errorDetail: 'errors/errorDetail',
      errorLineNumber: 'errors/errorLineNumber',
      errorFileName: 'errors/errorFileName',
      errorStack: 'errors/errorStack',
    }),
  },
  methods: {
    close() {

      this.$store.dispatch('errors/clearError');

    },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: black;
  display: flex;
}

.modal {
  margin: auto;
  width: 90%;
  background-color: white;
  border: 0.2rem;
}

article {
  max-width: 100%;
}

section {
  overflow: auto;
  white-space: nowrap;
}

section div {
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab {
  width: 6rem;
  height: 6rem;
}

#app > div > dialog > article > section > div.info {
  min-height: 6rem;
  min-width: calc(100% - 6rem);
  padding: 1rem;
  background-color: #fca;
  color: #dd2c00;
}
.tab,
dialog article button {
  background-color: #dd2c00;
  color: #fff;
}
.close {
  cursor: pointer;
}
dialog article header,
dialog article button:hover {
  background-color: #b30202;
  transition: background-color 0.5s ease;
}

dialog article header h2 {
  color: #fff;
  margin-bottom: 0;
}
dialog article ul li {
  white-space: pre-wrap;
  word-break: break-all;
}

html[data-theme="dark"] .modal-container {
  background-color: black;
}

html[data-theme="dark"] .modal {
  background-color: black;
}

html[data-theme="dark"] article {
  background-color: #141e26;
}

html[data-theme="dark"] #app > div > dialog > article > section > div.info,
html[data-theme="dark"]
  #app
  > div
  > dialog
  > article
  > section
  > div.info
  ul
  li {
  color: black !important;
}

small {
  display: inline-block;
  font-size: 0.7rem;
  line-height: 1;
}
</style>

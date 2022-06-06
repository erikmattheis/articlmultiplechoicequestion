<template>
  <the-header />
  <main>
    <router-view />
  </main>
  <the-footer />
  <modal-error />
  <modal-success />
</template>

<script>
/* VUE
 * 1939,1200, 1,244 .js
 *  538, 3250, 3,623 .vue
 *

 *
 * NODE
 * 2706,2,487, 2,553 .js
 *
 * 4/15.5/20, 6/1
 * 5183,6937,7420
 *** */
import ModalError from '@/components/ui/ModalError.vue';
import ModalSuccess from '@/components/ui/ModalSuccess.vue';
import TheFooter from '@/components/layout/TheFooter.vue';
import TheHeader from '@/components/layout/TheHeader.vue';

export default {
  components: {
    TheHeader,
    TheFooter,
    ModalError,
    ModalSuccess,
  },
};
</script>

<style lang="scss">
@import "~/node_modules/@picocss/pico/css/pico.css";

@import url("//fonts.googleapis.com/css2?family=Poppins&display=swap");

body {
  border-radius: 0;
}

body,
input:-webkit-autofill::first-line,
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  font: "Poppins", sans-serif;
  font-size: 1rem;
  line-height: 1.6rem;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
}

body * {
  border-radius: 0 !important;
}
input[role="switch"],
input[type="radio"] {
  border-radius: 1rem !important;
}

ul {
  padding-left: 0;
  list-style-type: none !important;
}

ul li {
  list-style-type: none !important;
}

.left-space {
  padding-left: 2rem;
}

.right {
  text-align: right;
}

header article,
footer article {
  background-color: #efefef;
}

html[data-theme="dark"] header article,
html[data-theme="dark"] footer article {
  background-color: #0f191c;
}

header article {
  margin-top: 0.5rem;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}
main article {
  margin-top: 0;
  margin-bottom: 0;
}
main form {
  margin-bottom: 0;
}
footer article {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

form ul li,
input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]),
select,
textarea {
  padding: 0.4rem 0.6rem !important;
}
form ul li,
input:not([type="checkbox"]):not([type="radio"]):not([type="range"]) {
  height: initial;
}

a span.sr {
 height: 1px;
 width: 1px;
 position: absolute;
 overflow: hidden;
 top: -10px;
}

@import "~/node_modules/@picocss/pico/scss/_variables.scss";

@media (min-width: map-get($breakpoints, "xs")) {
  #app,
  .max-container-width {
    width: 96%;
  }
}

@media (min-width: map-get($breakpoints, "lg")) {
  #app,
  .max-container-width {
    max-width: map-get($viewports, "lg");
  }
}

@media (min-width: map-get($breakpoints, "xl")) {
  #app,
  .max-container-width {
    width: map-get($viewports, "lg");
  }
}
</style>

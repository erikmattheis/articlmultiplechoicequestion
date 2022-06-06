<template>
  <nav>
    <ul>
      <li>
        <router-link :to="{ name: 'editArticl', params: { id } }">
          edit
        </router-link>
      </li>
      <li>
        <a>Change status</a>
      </li>
      <li>
        <router-link :to="{ name: 'deleteArticl', params: { id, title } }">
          delete
        </router-link>
      </li>
    </ul>
  </nav>
  <ul role="listbox" />
</template>

<script>
import { isLoggedIn } from '@/services/tokensService';

export default {
  name: 'ArticlActions',
  components: {},
  props: ['id', 'title'],
  data() {

    return {
      expanded: false,
    };

  },
  computed: {
    isLoggedIn,
  },
  methods: {},
};
</script>

<style scoped>
.above {
  position: absolute;
  top: 0;
  right: 0;
}

svg {
  width: 2rem;
  height: 2rem;
}

.a {
  fill: #039be5;
}

articl nav {
  overflow: auto;
}
</style>

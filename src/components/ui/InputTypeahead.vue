<template>
  <div>
    <label :for="query">
      <vue-feather
        class="icon"
        size="1.5rem"
        type="search"
        aria-label="Search"
      />
      <input
        ref="input"
        v-model="stringValue"
        type="text"
        autocomplete="off"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.enter="hit"
        @keydown.esc="removeItems"
        @blur="removeItems"
        @keyup="update"
        :id="query"
      >
    </label>

    <ul v-show="hasItems">
      <!-- for vue@1.0 use: ($item, item) -->
      <li
        v-for="(item, $index) in items"
        :key="$index"
        :class="activeClass($index)"
        @mousedown="hit"
        @mousemove="setActive($index)"
      >
        <span v-text="item" />
      </li>
    </ul>
  </div>
</template>
<script>
import VueFeather from 'vue-feather';
import { debounce } from 'lodash';

export default {
  components: {
    VueFeather,
  },
  props: {
    src: String, query: String, inputValue: String,
  },
  emits: {
    typeaheadUpdated: null,
  },
  data() {

    return {
      items: [],
      current: -1,
      loading: false,
      selectFirst: true,
      stringValue: '',
    };

  },
  computed: {
    hasItems() {

      return this.items.length > 0;

    },

    isEmpty() {

      return !this.stringValue;

    },

    isDirty() {

      return !!this.stringValue;

    },
  },
  watch: {
    inputValue: {
      handler(val) {

        this.stringValue = val;

      },
    },
  },
  mounted() {

    this.$refs.input.addEventListener(
      'blur',
      () => {
        // it will work now
      },
      true,
    );

    this.setActive = debounce(this.setActive, 10);

    this.up = debounce(this.up, 200);

    this.update = debounce(this.update, 200);

    this.down = debounce(this.down, 200);

    this.stringValue = this.inputValue;

  },
  methods: {
    async update() {

      this.cancel();

      if (!this.stringValue) {

        this.$emit('typeaheadUpdated', {
          field: this.query,
          value: '',
        });

        this.removeItems();

      }

      this.loading = true;

      this.hit();

      this.$emit('typeaheadUpdated', {
        field: this.query,
        value: this.stringValue,
      });

      this.fetchData().then((response) => {

        const {
          data,
        } = response;

        this.items = data.slice(0, 7);

        this.current = -1;

        this.loading = false;

        this.hit();

      });

    },

    async fetchData() {

      const params = {
        q: this.stringValue,
      };
      const result = await this.$http.get(this.src, {
        params,
      });

      return result;

    },

    cancel() {
      // used to cancel after request made
    },

    removeItems() {

      this.items = [];

      this.loading = false;

    },

    setActive(index) {

      this.current = index;

    },

    activeClass(index) {

      return {
        active: this.current === index,
      };

    },

    hit() {

      if (this.current !== -1 && this.items && this.items[this.current]) {

        this.onHit(this.items[this.current]);

      }

    },

    up() {

      if (this.current > 0) {

        this.current -= 1;

      } else if (this.current === -1) {

        this.current = this.items.length - 1;

      } else {

        this.current = -1;

      }

    },

    down() {

      if (this.current < this.items.length - 1) {

        this.current += 1;

      } else {

        this.current = -1;

      }

    },

    onHit(val) {

      this.stringValue = val;

      this.$emit('typeaheadUpdated', {
        field: this.query, value: val,
      });

    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  position: absolute;
  z-index: 1;
  background-color: #11191f;
  width: 100%;
}

li {
  padding: 0.2rem 0.5rem;
}

label {
  margin-top: 0;
  display: block;
  position: relative;
}

label .icon {
  position: absolute;
  top: 0.5rem;
  right: 0.4rem;
  opacity: 50%;
}

.active {
  background-color: #1095c1;
  cursor: pointer;
}

label > :where(input, select, textarea) {
  margin-top: 0;
}
</style>

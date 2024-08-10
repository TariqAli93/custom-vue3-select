<script setup>
import gsap from "gsap";
import { ref, watch, onMounted } from "vue";

import "./style.css";

const isOpen = ref(false);

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
    required: true
  },
  label: {
    type: String,
    default: "Select an item"
  },
  selectAllText: {
    type: String,
    default: "Select all"
  },
  noDataText: {
    type: String,
    default: "No data found"
  },
  multiple: {
    type: Boolean,
    default: undefined
  },

  selectAll: {
    type: Boolean,
    default: undefined
  },

  modelValue: {
    type: [String, Number, Object],
    default: null
  },

  returnObject: {
    type: Boolean,
    default: true
  },

  darkBg: {
    type: String,
    default: "#1a1a1a"
  },

  darkBgSecondary: {
    type: String,
    default: "#2a2a2a"
  },

  darkBgTertiary: {
    type: String,
    default: "#3a3a3a"
  },

  darkText: {
    type: String,
    default: "#f0f0f0"
  },

  lightBg: {
    type: String,
    default: "#fff"
  },

  lightBgSecondary: {
    type: String,
    default: "#ececec"
  },

  lightBgTertiary: {
    type: String,
    default: "#e9e9e9"
  },

  lightText: {
    type: String,
    default: "#1a1a1a"
  },

  onChange: {
    type: Function,
    default: () => {}
  }
});

let selectedValue = props.modelValue ? ref(props.modelValue) : ref([]);
const multiple = props.multiple != undefined;
const selector = props.selectAll != undefined;

const handleSelectOne = (item, el) => {
  if (props.returnObject) selectedValue.value = item;
  else selectedValue.value = item.id;
  isOpen.value = false;
  const options = document.querySelector(".c-select--options");

  gsap.to(options, {
    duration: 0.13,
    visibility: "hidden",
    opacity: 0,
    y: 0
  });
};

const handleSelectMultiple = (item, el) => {
  const includesObject = selectedValue.value.some((i) => i.id === item.id);

  if (includesObject) {
    selectedValue.value = selectedValue.value.filter((i) => i.id !== item.id);
  } else {
    if (props.returnObject) selectedValue.value = [...selectedValue.value, item];
    else selectedValue.value = [...selectedValue.value, item.id];
  }

  const option = document.getElementById(`option${el}`);
  option.classList.toggle("active");

  const selectAllBtn = document.getElementById("selectAllBtn");

  if (selector) {
    if (selectedValue.value.length === props.items.length) {
      selectAllBtn.classList.add("active");
    } else {
      selectAllBtn.classList.remove("active");
    }
  }

  if (selectedValue.value.length === 0) {
    const options = document.querySelectorAll(".c-select--options__option:not(.all-select)");
    options.forEach((option) => {
      option.classList.remove("active");
    });
  }
};

const handleSelect = (item, el) => {
  if (!multiple) handleSelectOne(item, el);
  else handleSelectMultiple(item, el);
};

const handleSelectAll = () => {
  const selectAllBtn = document.getElementById("selectAllBtn");
  if (selectedValue.value.length === props.items.length) {
    selectedValue.value = [];
    const options = document.querySelectorAll(".c-select--options__option:not(.all-select)");
    options.forEach((option) => {
      option.classList.remove("active");
    });

    selectAllBtn.classList.remove("active");
  } else {
    // return object
    if (props.returnObject) selectedValue.value = props.items;
    else selectedValue.value = props.items.map((item) => item.id);

    const options = document.querySelectorAll(".c-select--options__option:not(.all-select)");
    options.forEach((option) => {
      option.classList.add("active");
    });

    selectAllBtn.classList.add("active");
  }
};

const handleToggle = () => {
  isOpen.value = !isOpen.value;
  const options = document.querySelector(".c-select--options");

  gsap.to(options, {
    duration: 0.13,
    visibility: isOpen.value ? "visible" : "hidden",
    opacity: isOpen.value ? 1 : 0,
    y: isOpen.value ? 5 : 0
  });
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".c-select")) {
    isOpen.value = false;
    const options = document.querySelector(".c-select--options");

    gsap.to(options, {
      duration: 0.13,
      visibility: "hidden",
      opacity: 0,
      y: 0
    });
  }
};

const emit = defineEmits(["update:modelValue"]);

watch(isOpen, (newValue) => {
  // if is open add active class to chevron icon else remove it
  const selected = document.querySelector(".c-select--selected");
  selected.classList.toggle("active", newValue);
});

watch(selectedValue, (newValue) => {
  emit("update:modelValue", newValue);
  props.onChange(newValue);
});

const hasDuplicateValues = props.items.some((item) => {
  return props.items.filter((i) => i.id === item.id).length > 1;
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // update css variables with props values
  document.documentElement.style.setProperty("--dark-bg", props.darkBg);
  document.documentElement.style.setProperty("--dark-bg-secondary", props.darkBgSecondary);
  document.documentElement.style.setProperty("--dark-bg-tertiary", props.darkBgTertiary);
  document.documentElement.style.setProperty("--dark-text", props.darkText);

  document.documentElement.style.setProperty("--light-bg", props.lightBg);
  document.documentElement.style.setProperty("--light-bg-secondary", props.lightBgSecondary);
  document.documentElement.style.setProperty("--light-bg-tertiary", props.lightBgTertiary);
  document.documentElement.style.setProperty("--light-text", props.lightText);

  if (hasDuplicateValues) {
    throw new Error("Items must have unique id");
  }
});
</script>
<template>
  <div class="c-select">
    <div class="c-select--selected" @click="handleToggle" :class="{ 'pointer-events-none': hasDuplicateValues }">
      <span v-show="selectedValue.length < 1"> {{ props.label || "select an item" }} </span>

      <span v-if="!multiple && selectedValue && props.returnObject">
        {{ selectedValue?.name }}
      </span>

      <span v-else-if="!multiple && selectedValue && !props.returnObject">
        {{ selectedValue }}
      </span>

      <span v-else-if="multiple && selectedValue.length > 0 && !props.returnObject">
        <template v-if="selectedValue.length > 3">
          <span v-for="(item, index) in selectedValue.slice(0, 3)" :key="index"> {{ item }}{{ index < 2 ? ", " : "" }} </span>
          <span> +{{ selectedValue.length - 3 }} </span>
        </template>

        <template v-else>
          <span v-for="(item, index) in selectedValue" :key="index"> {{ item }}{{ index < selectedValue.length - 1 ? ", " : "" }} </span>
        </template>
      </span>

      <span v-else-if="multiple && selectedValue.length > 0 && props.returnObject">
        <template v-if="selectedValue.length > 3">
          <span v-for="(item, index) in selectedValue.slice(0, 3)" :key="index"> {{ item.name }}{{ index < 2 ? ", " : "" }} </span>
          <span> +{{ selectedValue.length - 3 }} </span>
        </template>

        <template v-else>
          <span v-for="(item, index) in selectedValue" :key="index"> {{ item.name }}{{ index < selectedValue.length - 1 ? ", " : "" }} </span>
        </template>
      </span>

      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z" fill="currentColor" />
      </svg>
    </div>

    <div class="c-select--options">
      <!-- select all check box -->
      <div class="c-select--options__option all-select" id="selectAllBtn" v-if="selector && props.items.length > 0" @click="handleSelectAll">
        <div class="c-select--options__option__checkbox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z" fill="currentColor" />
          </svg>
        </div>
        <span> {{ props.selectAllText }} </span>
      </div>

      <div class="c-select--options__option" :id="`option${item.id}`" v-for="item in props.items" :key="item.id" @click="handleSelect(item, item.id)">
        <div class="c-select--options__option__checkbox" v-if="multiple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z" fill="currentColor" />
          </svg>
        </div>
        <span>{{ item.name }}</span>
      </div>

      <div class="no-data" v-if="props.items.length === 0">{{ props.noDataText }}</div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  color-scheme: light dark;

  --dark-bg: #1a1a1a;
  --dark-bg-secondary: #2a2a2a;
  --dark-bg-tertiary: #3a3a3a;
  --dark-text: #f0f0f0;

  --light-bg: #fff;
  --light-bg-secondary: #ececec;
  --light-bg-tertiary: #e9e9e9;
  --light-text: #1a1a1a;

  --border-radius: 5px;
  --padding-inline: 15px;
  --padding-block: 10px;

  --transition: all 0.3s;

  --box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  --box-border: 1px solid rgba(0, 0, 0, 0.1);
}

* {
  ::before,
  ::after {
    box-sizing: border-box;
    content: "";
    display: none;
  }
}

.pointer-events-none {
  pointer-events: none !important;
  background-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: none !important;
  border: none !important;
}

.c-select {
  position: relative;
  color: light-dark(var(--light-text), var(--dark-text));
  cursor: pointer;

  &--selected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: light-dark(var(--light-bg), var(--dark-bg));
    padding: var(--padding-block) var(--padding-inline);
    border-radius: var(--border-radius);
    transition: var(--transition);
    box-shadow: var(--box-shadow);
    border: var(--box-border);
    user-select: none;

    svg {
      transition: var(--transition);
    }

    &.active {
      svg {
        transform: rotate(180deg);
      }
    }
  }

  &--options {
    position: absolute;
    background-color: light-dark(var(--light-bg), var(--dark-bg));
    top: 100%;
    left: 0;
    width: 100%;
    border-radius: var(--border-radius);
    padding-block: var(--padding-block);
    margin-top: 3px;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: var(--transition);
    box-shadow: var(--box-shadow);
    border: var(--box-border);

    &__option {
      display: flex;
      align-items: center;
      padding: var(--padding-block) var(--padding-inline);
      cursor: pointer;
      user-select: none;
      transition: var(--transition);

      &__checkbox {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        border-radius: var(--border-radius);
        border: 1px solid light-dark(var(--light-bg-tertiary), var(--dark-bg---light-bg-tertiary));
        background-color: light-dark(var(--light-bg-secondary), var(--dark-bg-secondary));
        margin-inline-end: 10px;

        svg {
          fill: light-dark(var(--light-text), var(--dark-text));
          visibility: hidden;
          opacity: 0;
        }
      }

      span {
        color: light-dark(var(--light-text), var(--dark-text));
      }

      &.active {
        background-color: light-dark(var(--light-bg-tertiary), var(--dark-bg-tertiary));

        .c-select--options__option__checkbox {
          background-color: light-dark(var(--light-bg), var(--dark-bg));
          border: 1px solid light-dark(var(--light-bg), var(--dark-bg));

          svg {
            visibility: visible;
            opacity: 1;
          }
        }
      }

      &:not(.active):hover:not(.all-select) {
        background-color: light-dark(var(--light-bg-secondary), var(--dark-bg-secondary));

        .c-select--options__option__checkbox {
          background-color: light-dark(var(--light-bg), var(--dark-bg));
          border: 1px solid light-dark(var(--light-bg), var(--dark-bg));
        }
      }

      &.all-select {
        border-bottom: 1px solid light-dark(var(--light-bg-secondary), var(--dark-bg-secondary));
        margin-bottom: 10px;

        .c-select--options__option__checkbox {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          border-radius: var(--border-radius);
          border: 1px solid light-dark(var(--light-bg-tertiary), var(--dark-bg---light-bg-tertiary));
          background-color: light-dark(var(--light-bg-secondary), var(--dark-bg-secondary));
          margin-inline-end: 10px;

          svg {
            visibility: hidden;
            opacity: 0;
          }
        }

        &.active {
          background-color: inherit;

          .c-select--options__option__checkbox {
            background-color: light-dark(var(--light-bg-tertiary), var(--dark-bg-tertiary));

            svg {
              visibility: visible;
              opacity: 1;
            }
          }

          &:hover {
            background-color: inherit;

            .c-select--options__option__checkbox {
              background-color: light-dark(var(--light-bg-tertiary), var(--dark-bg-tertiary));
            }
          }
        }

        &:hover {
          background-color: inherit !important;

          .c-select--options__option__checkbox {
            background-color: light-dark(var(--light-bg-secondary), var(--dark-bg-secondary));
          }
        }
      }
    }

    .no-data {
      padding: var(--padding-block) var(--padding-inline);
      color: light-dark(var(--light-text), var(--dark-text));
      font-size: 0.768rem;
    }
  }
}
</style>

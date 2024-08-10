import CustomSelect from "./CustomVue3Select.vue";

export default {
  install(app, options) {
    app.component("CustomSelect", CustomSelect);
  }
};

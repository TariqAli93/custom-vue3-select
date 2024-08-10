# custom vue3 select component

#### **installation:**

```javascript
npm i custom-vue3-select
or
yarn add custom-vue3-select
```

```javascript
import customSelect from "custom-vue3-select";

import "custom-vue3-select/dist/style.css";

import createApp from "vue";

const app = createApp();

app.use("customSelect");

app.mount("#app");
```

---

#### use it:

```javascript
<custom-select
  :items="[
    { id: 1, name: 'test' },
    { id: 2, name: 'test2' },
    { id: 3, name: 'test3' }
  ]"
  v-model="selected"
  multiple
  label="يرجى الاختيار"
  no-data-text="لا توجد بيانات"
  select-all-text="تحديد الكل"
  :onChange="handleSelect"
/>
```

---

#### component props:

| Prop Name        | Type                   | Default Value    | Required | Description                                                     |
| ---------------- | ---------------------- | ---------------- | -------- | --------------------------------------------------------------- |
| items            | Array                  | []               | Yes      | An array of objects representing the selectable items.          |
| label            | String                 | "Select an item" | No       | The label displayed at the top of the dropdown.                 |
| selectAllText    | String                 | "Select all"     | No       | The text displayed for the "Select All" option.                 |
| noDataText       | String                 | "No data found"  | No       | The text displayed when there are no items in the items array.  |
| multiple         | Boolean                | undefined        | No       | Enables multiple item selection.                                |
| selectAll        | Boolean                | undefined        | No       | Enables the "Select All" option.                                |
| modelValue       | String, Number, Object | null             | No       | The currently selected value(s).                                |
| returnObject     | Boolean                | TRUE             | No       | Determines whether the selected value is returned as an object. |
| darkBg           | String                 | "#1a1a1a"        | No       | The background color for dark mode.                             |
| darkBgSecondary  | String                 | "#2a2a2a"        | No       | The secondary background color for dark mode.                   |
| darkBgTertiary   | String                 | "#3a3a3a"        | No       | The tertiary background color for dark mode.                    |
| darkText         | String                 | "#f0f0f0"        | No       | The text color for dark mode.                                   |
| lightBg          | String                 | "#fff"           | No       | The background color for light mode.                            |
| lightBgSecondary | String                 | "#ececec"        | No       | The secondary background color for light mode.                  |
| lightBgTertiary  | String                 | "#e9e9e9"        | No       | The tertiary background color for light mode.                   |
| lightText        | String                 | "#1a1a1a"        | No       | The text color for light mode.                                  |
| onChange         | Function               | () => {}         | No       | A callback function triggered when the selected value changes.  |

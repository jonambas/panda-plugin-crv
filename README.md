# panda-plugin-ct

Allows aliases to tokens without generating alias-level class names.

The plugin allows you to structure your tokens in a way makes sense to you, and does not need to adhere to Panda's token structure.

```ts
// panda.config.ts

import { defineConfig } from '@pandacss/dev';
import { pluginComponentTokens } from 'panda-plugin-ct';

export default defineConfig({
  plugins: [
    pluginComponentTokens({
      alert: {
        background: 'red.500',
        text: 'gray.100',
      },
    }),
  ],
});
```

```tsx
// Component code

import { css, ct } from "../../styled-system/css";

<div className={css({
  display: 'flex',
  // Token paths are fully typed
  background: ct('alert.background')
})}>
```

Which will produce:

```html
<!-- With ct -->
<div class="d_flex bg_red.500" />

<!-- With Panda's semanticTokens -->
<div class="d_flex bg_alert.background" />
```

```css
/* With ct */
--colors-red-500: #ef4444;

/* With Panda's semanticTokens */
--colors-alert-background: var(--colors-red-500);

.d_flex {
  display: flex;
}

/* With ct */
.bg_red\.500 {
  background: var(--colors-red-500);
}

/* With Panda's semanticTokens */
.bg_alert\.background {
  background: var(--colors-alert-background);
}
```

---

### Supported syntax

This plugin supports aliasing to Panda's object syntax via a `value` key, just as you would define semantic tokens in Panda's theme. Anything Panda supports will work, including raw values.

```ts
export default defineConfig({
  plugins: [
    pluginComponentTokens({
      alert: {
        background: {
          value: {
            base: 'red.500',
            lg: 'blue.500',
          },
        },
        text: {
          value: '#111',
        },
      },
    }),
  ],
});
```

```tsx
<div className={css({
  background: ct('alert.background'),
  color: ct('alert.text'),
})}>
```

Produces:

```html
<div class="bg_red.500 lg:bg_blue.500 text_#111" />
```

---

### Further optimization

This plugin generates a performant JS runtime to map paths to their respective class names. This runtime can be completely removed using [@pandabox/unplugin](https://github.com/astahmer/pandabox/tree/main/packages/unplugin), with a transformer exported from this package. Your bundler's config will need to be modified to achieve this.

Example Next.js config:

```js
import unplugin from '@pandabox/unplugin';
import { transform } from 'panda-plugin-ct';

// Your token object
// This should be the same as the object you supplied to the Panda plugin
const tokens = {};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
      unplugin.webpack({
        transform: transform(tokens),
      }),
    );
    return config;
  },
};

export default nextConfig;
```

---

### Acknowledgement

- [Jimmy](https://github.com/jimmymorris) – for the idea and motivation behind the plugin
- [Alex](https://github.com/astahmer) – for providing feedback with the plugin's internals and functionality

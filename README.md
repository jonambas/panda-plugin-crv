# panda-plugin-crv

A [Panda CSS](https://panda-css.com) plugin for responsive `cva` variants. This plugin allows you to to use Panda's responsive syntax, without config recipes, such as:

```tsx
<Component variant={{ base: 'secondary', lg: 'primary' }} />
```

---

### Installation

```sh
npm i panda-plugin-crv
```

```ts
// panda.config.ts

import { defineConfig } from '@pandacss/dev';
import { pluginResponsiveVariants } from 'panda-plugin-crv';

export default defineConfig({
  plugins: [pluginResponsiveVariants()],
});
```

---

### Usage

This plugin removes the boilerplate required to build responsive variants within `cva`. This allows you to (1) co-locate variants near your components instead of in Panda's config, and (2) generate atomic class names.

Example component styles:

```tsx
import { crv, cva } from '@/styled-system/css';

const styles = cva({
  variants: {
    // create responsive variants
    ...crv('variant', {
      primary: { bg: 'blue.500' },
      secondary: { bg: 'gray.500' },
      destructive: { bg: 'red.500' },
    }),
  },
});
```

This plugins ships two helpers to parse responsive variants in your components.

- `ResponsiveVariant` – creates appropriate types, with your theme's breakpoints
- `splitResponsiveVariant` – translates the incoming responsive object into variants generated by `crv`

```tsx
import {
  splitResponsiveVariant,
  type ResponsiveVariant,
} from '@/styled-system/css';

type ComponentProps = PropsWithChildren<{
  variant?: ResponsiveVariant<'primary' | 'secondary' | 'destructive'>;
}>;

const Component: FC<ComponentProps> = (props) => {
  const { children, variant = 'secondary' } = props;
  const variants = splitResponsiveVariant('variant', variant);

  return <div className={styles({ ...variants })}>{children}</div>;
};
```

Using your component will look like this:

```tsx
<Component variant="primary" />
<Component variant={{ base: 'secondary', lg: 'primary' }} />
```

---

### Current Limitations

- The plugin generates variants for all breakpoints defined in your theme, and does not include Panda's generated breakpoints, such as `mdDown`, `mdOnly`, `mdToLg`.
- There is currently no way to limit which breakpoints you wish to generate.

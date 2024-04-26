import { FC, PropsWithChildren } from 'react';
import './styles.css';
import {
  crv,
  ccv,
  css,
  cva,
  ct,
  splitResponsiveVariant,
  ResponsiveVariant,
  splitCrv,
} from '@/styled-system/css';

const recipe = cva({
  base: {
    color: 'black',
    p: 3,
    borderRadius: '3px',
  },
  variants: {
    ...crv('variant1', {
      foo: {},
      bar: {},
    }),
    ...crv('variant2', {
      foo: {
        bg: 'gray.200',
      },
      bar: {
        bg: 'red.200',
      },
      baz: {
        bg: 'green.200',
      },
    }),
    ...crv('visible', {
      false: { opacity: 0 },
      true: { opacity: 1 },
    }),
  },
  compoundVariants: [
    ...ccv(
      { variant1: 'bar', variant2: 'foo' },
      { borderRadius: '10px', margin: ct('margin.sm') },
    ),
    ...ccv(
      { variant1: 'foo', variant2: 'bar' },
      { color: 'red.600', margin: ct('margin.sm') },
    ),
    ...ccv(
      { variant1: 'foo', variant2: 'baz' },
      { bg: 'indigo.500', color: 'gray.100', margin: 0 },
    ),
  ],
});

const Component: FC<
  PropsWithChildren<{
    variant2?: ResponsiveVariant<'foo' | 'bar' | 'baz'>;
    visible?: ResponsiveVariant<boolean>;
    variant1?: ResponsiveVariant<'foo' | 'bar'>;
  }>
> = (props) => {
  const { children, variant1, variant2, visible } = props;
  const splitV1 = splitCrv('variant1', variant1);
  const splitV2 = splitResponsiveVariant('variant2', variant2);
  const splitVisible = splitResponsiveVariant('visible', visible);

  return (
    <div className={recipe({ ...splitV1, ...splitV2, ...splitVisible })}>
      {children}
    </div>
  );
};

export const App = () => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '1',
        h: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Component variant2="foo">Direct variant</Component>
      <Component variant2={{ base: 'foo', md: 'bar', lg: 'baz' }}>
        Responsive variants
      </Component>
      <Component visible={{ base: true, md: false, lg: true }}>
        Responsive boolean variants
      </Component>
      <Component variant1="foo" variant2="bar">
        Direct compound variants
      </Component>
      <Component
        variant1={{ base: 'foo', md: 'bar', lg: 'foo' }}
        variant2={{ base: 'foo', md: 'foo', lg: 'baz' }}
      >
        Responsive compound variants
      </Component>
    </div>
  );
};

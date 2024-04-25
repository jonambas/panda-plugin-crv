import { FC, PropsWithChildren } from 'react';
import './styles.css';
import {
  crv,
  ccv,
  css,
  cva,
  cx,
  splitResponsiveVariant,
  ResponsiveVariant,
  splitCrv,
} from '@/styled-system/css';

const recipe = cva({
  base: {
    color: 'black',
    p: 3,
  },
  variants: {
    test: {
      foo: {},
      bar: {},
    },
    ...crv('tone', {
      neutral: {
        bg: 'gray.200',
      },
      negative: {
        bg: 'red.200',
      },
      positive: {
        bg: 'green.200',
      },
    }),
    ...crv('visible', {
      false: { opacity: 0 },
      true: { opacity: 1 },
    }),
  },
  compoundVariants: [
    ...ccv({ tone: 'neutral', test: 'foo' }, { bg: 'amber.400' }),
  ],
});

const Component: FC<
  PropsWithChildren<{
    tone?: ResponsiveVariant<'neutral' | 'negative' | 'positive'>;
    visible?: ResponsiveVariant<boolean>;
    test?: ResponsiveVariant<'foo' | 'bar'>;
  }>
> = (props) => {
  const { children, tone = 'negative', visible, test } = props;
  const splitTone = splitCrv('tone', tone);
  const splitVisible = splitResponsiveVariant('visible', visible);
  const splitTest = splitResponsiveVariant('test', test);
  console.log(JSON.stringify(splitTest));
  console.log(JSON.stringify(splitTone));
  console.log(
    JSON.stringify(ccv({ tone: 'neutral', test: 'foo' }, { bg: 'amber.400' })),
  );
  return (
    <div
      className={cx(recipe({ ...splitTone, ...splitVisible, ...splitTest }))}
    >
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
      <Component tone="positive">Direct variant</Component>
      <Component tone={{ base: 'negative', md: 'neutral', lg: 'positive' }}>
        Responsive variants
      </Component>
      <Component visible={{ base: true, md: false, lg: true }}>
        Responsive boolean variants
      </Component>
      <Component test="foo" tone="neutral">
        Compound variants
      </Component>
      <Component
        test={{ base: 'bar', md: 'foo', lg: 'foo' }}
        tone={{ base: 'negative', md: 'neutral', lg: 'positive' }}
      >
        Responsive compound variants
      </Component>
    </div>
  );
};

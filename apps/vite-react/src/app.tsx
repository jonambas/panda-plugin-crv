import { FC, PropsWithChildren } from 'react';
import './styles.css';
import {
  crv,
  css,
  cva,
  cx,
  ResponsiveVariant,
  splitCrv,
} from '@/styled-system/css';

const componentRecipe = cva({
  base: {
    color: 'black',
    p: 3,
  },
  variants: {
    test: {
      foo: {},
    },
    ...crv(`tone`, {
      neutral: {
        bg: `gray.200`,
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
});

const Component: FC<
  PropsWithChildren<{
    tone?: ResponsiveVariant<'neutral' | 'negative' | 'positive'>;
    visible?: ResponsiveVariant<boolean>;
  }>
> = (props) => {
  const { children, tone = 'negative', visible } = props;
  const splitTone = splitCrv('tone', tone);
  const splitVisible = splitCrv('visible', visible);

  return (
    <div className={cx(componentRecipe({ ...splitTone, ...splitVisible }))}>
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
    </div>
  );
};

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
  },
});

const Component: FC<
  PropsWithChildren<{
    tone?: ResponsiveVariant<'neutral' | 'negative' | 'positive'>;
  }>
> = (props) => {
  const { children, tone = 'negative' } = props;
  const splitTone = splitCrv('tone', tone);

  return (
    <div className={cx(componentRecipe({ ...splitTone }))}>{children}</div>
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
      <Component tone="positive">Hello</Component>
      <Component tone={{ base: 'negative', lg: 'positive' }}>
        Responsive
      </Component>
    </div>
  );
};

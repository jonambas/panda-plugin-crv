import { css, cva, ct } from '../../styled-system/css';

export default function Home() {
  return (
    <main>
      <div
        className={css({
          display: 'block',
          // width: ct('alert.widths.sm'),
          bg: ct('alert.background'),
          // color: ct('alert.colors.text'),
          p: '5',
        })}
      >
        Test
      </div>
    </main>
  );
}

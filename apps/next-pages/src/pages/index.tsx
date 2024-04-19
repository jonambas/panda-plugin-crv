import { css, ct } from '../../styled-system/css';

export default function Home() {
  return (
    <>
      <div
        className={css({
          background: ct('raw.blue'),
          color: ct('semantic.red'),
        })}
      >
        hello
      </div>
    </>
  );
}

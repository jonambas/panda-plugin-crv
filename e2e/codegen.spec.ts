import { test, expect } from '@playwright/test';

test('Vite is running', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vite \+ React/);
});

test.describe('codegen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('semantic token references', async ({ page }) => {
    await expect(page.getByText('{colors.tone.positive}')).toHaveClass(
      'bg_{colors.tone.positive}',
    );
    await expect(page.getByText('{colors.tone.negative}')).toHaveClass(
      'bg_{colors.tone.negative}',
    );
  });

  test('raw values', async ({ page }) => {
    await expect(page.getByText('#0000ff')).toHaveClass('bg_#0000ff');
    await expect(page.getByText('#ff0000')).toHaveClass('bg_#ff0000');
  });

  test('value keys', async ({ page }) => {
    await expect(page.getByText('#9a9a9a')).toHaveClass('bg_#9a9a9a');
    await expect(
      page.getByText('{"base":"#000","lg":"#555","_hover":"#999"}'),
    ).toHaveClass('bg_#000 lg:bg_#555 hover:bg_#999');
  });
});

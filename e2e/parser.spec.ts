import { test, expect } from '@playwright/test';

test.describe('parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('semantic tokens', async ({ page }) => {
    await expect(page.getByText('{colors.tone.positive}')).toHaveCSS(
      'background-color',
      'rgb(34, 197, 94)',
    );

    await expect(page.getByText('{colors.tone.positive}')).toHaveCSS(
      'background-color',
      'rgb(34, 197, 94)',
    );
  });

  test('raw values', async ({ page }) => {
    await expect(page.getByText('#0000ff')).toHaveCSS(
      'background-color',
      'rgb(0, 0, 255)',
    );
    await expect(page.getByText('#ff0000')).toHaveCSS(
      'background-color',
      'rgb(255, 0, 0)',
    );
  });

  test('value keys', async ({ page }) => {
    await expect(page.getByText('#9a9a9a')).toHaveCSS(
      'background-color',
      'rgb(154, 154, 154)',
    );

    const el = page.getByText('{"base":"#000","lg":"#555","_hover":"#999"}');

    await expect(el).toHaveCSS('background-color', 'rgb(85, 85, 85)');
    await page.setViewportSize({ width: 320, height: 568 });
    await expect(el).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await el.hover();
    await expect(el).toHaveCSS('background-color', 'rgb(153, 153, 153)');
  });
});

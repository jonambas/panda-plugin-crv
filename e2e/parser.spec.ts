import { test, expect } from '@playwright/test';

test.describe('parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('direct variant', async ({ page }) => {
    await expect(page.getByText('Direct variant')).toHaveCSS(
      'background-color',
      'rgb(187, 247, 208)',
    );
  });

  test('responsive variant', async ({ page }) => {
    await expect(page.getByText('Responsive variant')).toHaveCSS(
      'background-color',
      'rgb(187, 247, 208)',
    );

    page.setViewportSize({ width: 768, height: 1024 });

    await expect(page.getByText('Responsive variant')).toHaveCSS(
      'background-color',
      'rgb(229, 231, 235)',
    );

    page.setViewportSize({ width: 300, height: 1024 });

    await expect(page.getByText('Responsive variant')).toHaveCSS(
      'background-color',
      'rgb(254, 202, 202)',
    );
  });

  test('boolean variants', async ({ page }) => {
    await expect(page.getByText('Responsive boolean variants')).toHaveCSS(
      'opacity',
      '1',
    );

    page.setViewportSize({ width: 768, height: 1024 });

    await expect(page.getByText('Responsive boolean variants')).toHaveCSS(
      'opacity',
      '0',
    );

    page.setViewportSize({ width: 300, height: 1024 });

    await expect(page.getByText('Responsive boolean variants')).toHaveCSS(
      'opacity',
      '1',
    );
  });
});

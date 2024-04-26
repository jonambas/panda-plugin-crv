import { test, expect } from '@playwright/test';

test.describe('parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('direct variant', async ({ page }) => {
    await expect(page.getByText('Direct variant')).toHaveCSS(
      'background-color',
      'rgb(229, 231, 235)',
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
      'rgb(254, 202, 202)',
    );

    page.setViewportSize({ width: 300, height: 1024 });

    await expect(page.getByText('Responsive variant')).toHaveCSS(
      'background-color',
      'rgb(229, 231, 235)',
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

  test('compound variants', async ({ page }) => {
    await expect(page.getByText('Direct compound variants')).toHaveCSS(
      'background-color',
      'rgb(254, 202, 202)',
    );

    await expect(page.getByText('Direct compound variants')).toHaveCSS(
      'color',
      'rgb(220, 38, 38)',
    );

    await expect(page.getByText('Direct compound variants')).toHaveCSS(
      'margin',
      '12px',
    );
  });

  test('responsive compound variants', async ({ page }) => {
    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'background-color',
      'rgb(99, 102, 241)',
    );

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'color',
      'rgb(243, 244, 246)',
    );

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'margin',
      '0px',
    );

    page.setViewportSize({ width: 768, height: 1024 });

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'background-color',
      'rgb(229, 231, 235)',
    );

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'color',
      'rgb(0, 0, 0)',
    );

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'border-radius',
      '10px',
    );

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'margin',
      '12px',
    );

    page.setViewportSize({ width: 300, height: 1024 });

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'background-color',
      'rgb(245, 158, 11)',
    );

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'color',
      'rgb(0, 0, 0)',
    );

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'border-radius',
      '3px',
    );

    await expect(page.getByText('Responsive compound variants')).toHaveCSS(
      'margin',
      '0px',
    );
  });
});

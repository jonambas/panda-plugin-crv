import { test, expect } from '@playwright/test';

test('Vite is running', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vite \+ React/);
});

test.describe('codegen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('direct variant', async ({ page }) => {
    await expect(page.getByText('Direct variant')).toHaveClass(
      'text_black p_3 rounded_3px bg_gray.200',
    );
  });

  test('responsive variant', async ({ page }) => {
    await expect(page.getByText('Responsive variant')).toHaveClass(
      'text_black p_3 rounded_3px bg_gray.200 md:bg_red.200 lg:bg_green.200',
    );
  });

  test('boolean variants', async ({ page }) => {
    await expect(page.getByText('Responsive boolean variant')).toHaveClass(
      'text_black p_3 rounded_3px opacity_1 md:opacity_0 lg:opacity_1',
    );
  });

  test('compound variants', async ({ page }) => {
    await expect(page.getByText('Compound variants').first()).toHaveClass(
      'text_red.600 p_3 rounded_3px bg_red.200 m_3',
    );
  });

  test('responsive compound variants', async ({ page }) => {
    await expect(page.getByText('Responsive compound variants')).toHaveClass(
      'text_black p_3 rounded_3px md:bg_gray.200 md:rounded_10px md:m_3 lg:bg_indigo.500 lg:text_gray.100 lg:m_0 bg_gray.200',
    );
  });
});

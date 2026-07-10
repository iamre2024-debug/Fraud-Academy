import { expect, test } from '@playwright/test';

const builtInCases = ['CASE-ATO-001', 'CASE-FPF-002', 'CASE-VND-003'];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

for (const caseId of builtInCases) {
  test(`opens built-in case ${caseId}`, async ({ page }) => {
    await page.getByRole('button', { name: new RegExp(caseId) }).click();
    await expect(page.getByRole('heading', { name: 'Investigation Workspace' })).toBeVisible();
    await expect(page.getByText(caseId, { exact: true })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Insider / Vendor / Third Party' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'API / Open Banking' })).toBeVisible();
  });
}

test('generates and opens a case immediately without refresh', async ({ page }) => {
  await page.getByRole('button', { name: 'Generate & Open Case' }).click();
  await expect(page.getByRole('heading', { name: 'Investigation Workspace' })).toBeVisible();
  await expect(page.getByText(/CASE-GEN-\d{6}/).first()).toBeVisible();
});

test('submitting an investigator package updates Luna and Academy progress', async ({ page }) => {
  await page.getByRole('button', { name: /CASE-ATO-001/ }).click();
  await page.getByRole('button', { name: /Customer 360/ }).click();
  await page.getByLabel('Investigator notes').fill('Reviewed access, profile change, and customer context records.');
  await page.getByLabel('Final review decision').selectOption({ label: 'More Review Needed' });
  await page.getByRole('button', { name: 'Submit Investigator Package' }).click();
  await expect(page.getByRole('button', { name: 'Package Submitted ✓' })).toBeVisible();
  await expect(page.getByText('Packages submitted: 1')).toBeVisible();
});

import { test, expect } from '@playwright/test'
import path from 'path'

const FIXTURE_PDF = path.join(__dirname, '../fixtures/sample-cv.pdf')
const JOB_DESCRIPTION = `Senior Software Engineer

We are looking for an experienced software engineer to join our team.

Requirements:
- 5+ years of experience with TypeScript and Node.js
- Experience with React and modern frontend tooling
- Strong understanding of RESTful API design
- Experience with cloud platforms (AWS, GCP, or Azure)
- Excellent communication skills

Responsibilities:
- Design and implement scalable backend services
- Collaborate with frontend engineers on API contracts
- Mentor junior engineers
- Participate in code reviews`

// Serial: both tests make a real Gemini API call; running concurrently risks 429 rate-limit errors
test.describe.serial('CV to ATS Converter — Happy Path', () => {
  test('uploads PDF, shows spinner, and provides download link', async ({ page }) => {
    await page.goto('/')

    // Verify initial state
    await expect(page.getByRole('heading', { name: /cv to ats converter/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /convert to ats/i })).toBeVisible()

    // Upload PDF
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(FIXTURE_PDF)

    // Paste job description
    await page.getByLabel(/job description/i).fill(JOB_DESCRIPTION)

    // Submit
    await page.getByRole('button', { name: /convert to ats/i }).click()

    // Spinner should appear (or conversion already completed quickly)
    // Wait for result (up to 120s for Gemini)
    const downloadLink = page.getByRole('link', { name: /download ats cv/i }).first()
    await expect(downloadLink).toBeVisible({ timeout: 120_000 })

    // Verify the href is a blob URL
    const href = await downloadLink.getAttribute('href')
    expect(href).toMatch(/^blob:/)
  })

  test('shows "Download Again" button after successful conversion', async ({ page }) => {
    await page.goto('/')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(FIXTURE_PDF)
    await page.getByLabel(/job description/i).fill(JOB_DESCRIPTION)
    await page.getByRole('button', { name: /convert to ats/i }).click()

    const downloadAgain = page.getByRole('link', { name: /download again/i })
    await expect(downloadAgain).toBeVisible({ timeout: 120_000 })

    const href = await downloadAgain.getAttribute('href')
    expect(href).toMatch(/^blob:/)
  })
})

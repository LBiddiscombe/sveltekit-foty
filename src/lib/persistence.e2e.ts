import { test, expect } from '@playwright/test';

test.describe('Game persistence', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
	});

	test('redirects to title page when refreshing on hub without loaded game', async ({ page }) => {
		// Set up a valid save in localStorage
		await page.evaluate(() => {
			const save = {
				player: {
					name: 'TestPlayer',
					age: 17,
					bankBalance: 5075,
					goals: 1,
					appearances: 1,
					club: 'Ackrington',
					division: 4,
					deck: [3, 1, 2, 1, 3, 2, 1, 3, 2, 1],
					careerXp: 50,
					matchXpHistory: [50]
				},
				season: {
					weekNumber: 2,
					seasonNumber: 1,
					fixtures: [
						{
							opponent: 'Barnett',
							isHome: true,
							weekNumber: 1,
							result: { goalsFor: 2, goalsAgainst: 1, playerGoals: 1 }
						},
						{
							opponent: 'Croo',
							isHome: false,
							weekNumber: 1,
							result: { goalsFor: 1, goalsAgainst: 1, playerGoals: 0 }
						}
					],
					divisionSchedule: { weeks: [] },
					gamesPlayed: 2,
					phase: 'hub',
					morale: 6,
					lastWageWeek: 2
				},
				inboxItems: [],
				matchResult: null,
				standings: Array.from({ length: 24 }, (_, i) => ({
					club: `Club${i + 1}`,
					played: 1,
					won: 0,
					drawn: 0,
					lost: 0,
					goalsFor: 0,
					goalsAgainst: 0,
					goalDifference: 0,
					points: 0,
					lastFive: [] as string[]
				})),
				lastProcessedWeek: 1
			};
			save.standings[0] = {
				club: 'Ackrington',
				played: 2,
				won: 1,
				drawn: 1,
				lost: 0,
				goalsFor: 3,
				goalsAgainst: 2,
				goalDifference: 1,
				points: 4,
				lastFive: ['W', 'D']
			};
			localStorage.setItem('foty-save', JSON.stringify(save));
		});

		// Navigate to /hub directly (simulating page refresh while on hub)
		await page.goto('/hub');

		// Should redirect to /
		await expect(page).toHaveURL('/');

		// Resume button should be visible
		await expect(page.locator('button:has-text("Resume Career")')).toBeVisible({ timeout: 10000 });

		// Click Resume
		await page.click('button:has-text("Resume Career")');
		await page.waitForURL('/hub');

		// Hub should show Week 2
		await expect(page.locator('text=Week 2')).toBeVisible();

		// Affairs should show league table
		await page.click('button:has-text("State of Affairs")');
		await page.waitForURL('/hub/affairs');
		await expect(page.locator('text=League Standings')).toBeVisible();
	});
});

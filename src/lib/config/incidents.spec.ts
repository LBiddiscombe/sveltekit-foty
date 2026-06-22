import { describe, it, expect, vi } from 'vitest';
import { INCIDENT_CARDS, pickRandomIncident, incidentCardById } from './incidents';

describe('INCIDENT_CARDS', () => {
	it('has exactly 2 cards', () => {
		expect(INCIDENT_CARDS).toHaveLength(2);
	});

	it('each card has an id, theme, title, description, and outcomes', () => {
		for (const card of INCIDENT_CARDS) {
			expect(card.id).toBeTypeOf('string');
			expect(card.theme).toMatch(/^positive|negative$/);
			expect(card.title).toBeTypeOf('string');
			expect(card.description).toBeTypeOf('string');
			expect(card.outcomes).toHaveLength(4);
		}
	});

	it('each outcome has a label and effects array', () => {
		for (const card of INCIDENT_CARDS) {
			for (const outcome of card.outcomes) {
				expect(outcome.label).toBeTypeOf('string');
				expect(Array.isArray(outcome.effects)).toBe(true);
				for (const effect of outcome.effects) {
					expect(['bankBalance', 'morale', 'stat']).toContain(effect.type);
					expect(effect.delta).toBeTypeOf('number');
				}
			}
		}
	});

	it('has one positive and one negative card', () => {
		const themes = INCIDENT_CARDS.map((c) => c.theme);
		expect(themes.filter((t) => t === 'positive')).toHaveLength(1);
		expect(themes.filter((t) => t === 'negative')).toHaveLength(1);
	});

	it('each card has at least one outcome with effects', () => {
		for (const card of INCIDENT_CARDS) {
			const outcomesWithEffects = card.outcomes.filter((o) => o.effects.length > 0);
			expect(outcomesWithEffects.length).toBeGreaterThanOrEqual(1);
		}
	});
});

describe('incidentCardById', () => {
	it('returns the correct card', () => {
		const card = incidentCardById('positive-windfall');
		expect(card).toBeDefined();
		expect(card!.id).toBe('positive-windfall');
		expect(card!.title).toBe('Windfall');
	});

	it('returns undefined for unknown id', () => {
		expect(incidentCardById('nonexistent')).toBeUndefined();
	});
});

describe('pickRandomIncident', () => {
	it('returns a card from the list', () => {
		const rng = () => 0.5;
		vi.spyOn(Math, 'random').mockImplementation(rng);
		const card = pickRandomIncident();
		expect(INCIDENT_CARDS).toContain(card);
	});

	it('returns first card when Math.random is 0', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		expect(pickRandomIncident().id).toBe(INCIDENT_CARDS[0].id);
	});

	it('returns last card when Math.random is near 1', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.999);
		expect(pickRandomIncident().id).toBe(INCIDENT_CARDS[INCIDENT_CARDS.length - 1].id);
	});
});

import { describe, it, expect } from 'vitest';
import { INCIDENT_CARDS, pickRandomIncident, incidentCardById } from './incidents';
import type { IncidentCategory, IncidentEffectType } from '$lib/types/game';

const VALID_CATEGORIES: IncidentCategory[] = [
	'career',
	'training',
	'purchases-sales',
	'investments',
	'family',
	'media',
	'gambling',
	'dressing-room',
	'travel',
	'absurd'
];

const VALID_EFFECT_TYPES: IncidentEffectType[] = [
	'bankBalance',
	'morale',
	'xp',
	'deckAdd',
	'deckRemove',
	'appearanceSkip',
	'wageMultiplier'
];

describe('INCIDENT_CARDS', () => {
	it('has cards', () => {
		expect(INCIDENT_CARDS.length).toBeGreaterThanOrEqual(1);
	});

	it('each card has id, category, title, description, and 4 outcomes', () => {
		for (const card of INCIDENT_CARDS) {
			expect(card.id).toBeTypeOf('string');
			expect(VALID_CATEGORIES).toContain(card.category);
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
					expect(VALID_EFFECT_TYPES).toContain(effect.type);
					expect(effect.delta).toBeTypeOf('number');
				}
			}
		}
	});

	it('each card has at least one outcome with effects', () => {
		for (const card of INCIDENT_CARDS) {
			const outcomesWithEffects = card.outcomes.filter((o) => o.effects.length > 0);
			expect(outcomesWithEffects.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('no two cards share the same id', () => {
		const ids = INCIDENT_CARDS.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('incidentCardById', () => {
	it('returns the correct card', () => {
		const card = incidentCardById('late-night-tv');
		expect(card).toBeDefined();
		expect(card!.id).toBe('late-night-tv');
	});

	it('returns undefined for unknown id', () => {
		expect(incidentCardById('nonexistent')).toBeUndefined();
	});
});

describe('pickRandomIncident', () => {
	it('returns a card from the list', () => {
		const card = pickRandomIncident();
		expect(INCIDENT_CARDS.map((c) => c.id)).toContain(card.id);
	});

	it('returns valid cards over many picks', () => {
		const seen = new Set<string>();
		for (let i = 0; i < 100; i++) {
			seen.add(pickRandomIncident().id);
		}
		for (const id of seen) {
			expect(INCIDENT_CARDS.map((c) => c.id)).toContain(id);
		}
	});
});

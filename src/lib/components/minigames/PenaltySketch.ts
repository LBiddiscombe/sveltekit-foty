import type { Outcome } from '$lib/types/game';
import { createFooty } from './footy';
import type p5 from 'p5';

interface PenaltySketchOptions {
	onComplete: (outcome: Outcome) => void;
	showCrowd?: boolean;
}

const GOALIE_DECISIONS = ['read', 'read', 'freeze', 'randcorner'];
const MAX_REACTION_DELAY_MS = 400;
const KICK_RADIUS = 100;
const MAX_VX = 16;
const MAX_VY = 18;
const POWER_CYCLE_MS = 600;

interface Ball {
	x: number;
	y: number;
	z: number;
	vx: number;
	vy: number;
	vz: number;
	radius: number;
}

export function createPenaltySketch({ onComplete, showCrowd = true }: PenaltySketchOptions) {
	let resolveStart: (() => void) | null = null;
	let startRequested = false;

	const sketch = function (p: p5, width: number, height: number) {
		const ft = createFooty(p);
		const s = p as unknown as Record<string, unknown>;

		let ball: Ball;
		let scored = false;
		let saved = false;
		let outcome: string | null = null;
		let charging = false;
		let chargeStartTime = 0;
		let completed = false;
		let paused = true;
		let firstFrame = true;

		resolveStart = () => {
			paused = false;
		};
		if (startRequested) {
			resolveStart();
		}

		s.setup = async () => {
			await ft.preload();
			p.createCanvas(width, height);
			p.noSmooth();
			resetBall();
		};

		s.draw = () => {
			p.background(50, 150, 60);

			ft.drawStadium(scored, showCrowd);
			ft.drawPitch();
			ft.drawGoal();

			if (paused && !firstFrame) return;

			firstFrame = false;

			if (paused) {
				ft.drawGoalie();
				ft.drawBall(ball);
				return;
			}

			ft.updateGoalie();
			updateBall();

			ft.drawGoalie();
			ft.drawBall(ball);

			drawPowerBar();
		};

		p.mousePressed = (): boolean => {
			if (paused) return false;
			if (charging) return false;
			if (ball.z > 5) return false;

			const ballScreen = ft.project(ball.x, ball.y, ball.z);
			const d = Math.hypot(p.mouseX - ballScreen.x, p.mouseY - ballScreen.y);
			if (d > KICK_RADIUS) return false;

			charging = true;
			chargeStartTime = p.millis();
			return false;
		};

		p.mouseReleased = (): boolean => {
			if (!charging) return false;
			charging = false;

			const elapsed = p.millis() - chargeStartTime;
			if (elapsed < 100) return false;

			const power = (elapsed % POWER_CYCLE_MS) / POWER_CYCLE_MS;
			kickBall(power);
			return false;
		};

		s.touchStarted = (): boolean => {
			p.mousePressed();
			return false;
		};

		s.touchEnded = (): boolean => {
			p.mouseReleased();
			return false;
		};

		function resetBall() {
			ball = { x: 0, y: 0.11, z: 0, vx: 0, vy: 0, vz: 0, radius: 0.11 };
			scored = false;
			saved = false;
			outcome = null;
			completed = false;
			ft.reset();
		}

		function kickBall(power: number) {
			const ballScreen = ft.project(ball.x, ball.y, ball.z);
			const aim = ft.computeKickAim(ballScreen, p.mouseX, p.mouseY, KICK_RADIUS, MAX_VX, MAX_VY);
			ball.vx = aim.vx;
			ball.vy = aim.vy;
			ball.vz = 20 * power + 5;

			const t = ft.goal.z / ball.vz;
			const predX = ball.vx * t;
			let predY = ball.y + ball.vy * t - 0.5 * ft.gravity * t * t;
			if (predY < ball.radius) predY = ball.radius;

			ft.goalieReact(predX, predY, GOALIE_DECISIONS, MAX_REACTION_DELAY_MS);
		}

		function updateBall() {
			const dt = p.deltaTime / 1000;

			ball.vy -= ft.gravity * dt;

			ball.x += ball.vx * dt;
			ball.y += ball.vy * dt;
			ball.z += ball.vz * dt;

			if (ball.y < ball.radius) {
				ball.y = ball.radius;

				if (Math.abs(ball.vy) > 0.5) {
					ball.vy *= -0.55;
				} else {
					ball.vy = 0;
				}
			}

			if (ball.z >= ft.goal.z && ball.z <= ft.goal.z + 1 && !scored && !saved) {
				const inFrame =
					ball.x > -ft.goal.width / 2 && ball.x < ft.goal.width / 2 && ball.y <= ft.goal.height;

				if (inFrame && ft.goalieSaveCheck(ball.x, ball.y, ball.radius)) {
					ball.vx *= 0.5;
					ball.vz *= -0.4;
					ball.vy *= 0.8;
					saved = true;
					outcome = 'Saved!';
					emitResult('saved');
				} else if (inFrame) {
					scored = true;
					ft.netRipple.active = true;
					ft.netRipple.impactX = ball.x;
					ft.netRipple.impactY = ball.y;
					ft.netRipple.startTime = p.millis();
					outcome = 'Goal!';
					emitResult('goal');
				}
			}

			if (scored) {
				ball.z = Math.min(ball.z, ft.goal.z + 2);
				ball.x = p.constrain(ball.x, -ft.goal.width / 2, ft.goal.width / 2);
				ball.vx *= 0.9;
			}

			if (ball.z > ft.goal.z + 3 && !outcome) {
				outcome = 'Missed!';
				emitResult('miss');
			}

			if (!outcome && ball.z > 30) {
				outcome = 'Missed!';
				emitResult('miss');
			}
		}

		function emitResult(result: Outcome) {
			if (completed) return;
			completed = true;
			onComplete(result);
		}

		function drawPowerBar() {
			if (!charging) return;
			const elapsed = (p.millis() - chargeStartTime) % POWER_CYCLE_MS;
			const power = elapsed / POWER_CYCLE_MS;

			const ballScreen = ft.project(ball.x, ball.y, ball.z);
			const barX = ballScreen.x + 30;
			const barY = ballScreen.y;
			const barW = 10;
			const barH = 40;

			p.push();
			p.noStroke();

			p.fill(0, 120);
			p.rect(barX, barY - barH, barW, barH);

			p.fill(255, 220, 0);
			const fillH = barH * power;
			p.rect(barX, barY - fillH, barW, fillH);

			p.noFill();
			p.stroke(255, 180);
			p.strokeWeight(1);
			p.rect(barX, barY - barH, barW, barH);
			p.pop();
		}
	};

	return {
		sketch,
		start: () => {
			if (resolveStart) {
				resolveStart();
			} else {
				startRequested = true;
			}
		}
	};
}

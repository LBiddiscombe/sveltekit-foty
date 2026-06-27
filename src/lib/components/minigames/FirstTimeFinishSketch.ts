import type { Outcome } from '$lib/types/game';
import { createFooty } from './footy';
import type p5 from 'p5';

interface FirstTimeFinishSketchOptions {
	onComplete: (outcome: Outcome) => void;
}

const SPAWN_X = -2;
const SPAWN_VX = () => Math.random() * 3 + 3;
const SPAWN_VY = () => Math.random() * 2 + 2;
const SPAWN_Z = () => Math.random() * 3.5 - 1.5;
const RESET_X_THRESHOLD = 15;
const GHOST_SCREEN_X = 14;
const PRE_KICK_SPEED_MULT = 0.2;
const TRAIL_LENGTH = 40;
const KICK_VX_MAX = 16;
const KICK_VY_MAX = 18;
const KICK_VZ = 25;
const KICK_RADIUS = 50;
const GOALIE_DECISIONS = ['read'];
const MAX_REACTION_DELAY_MS = 800;

interface Ball {
	x: number;
	y: number;
	z: number;
	vx: number;
	vy: number;
	vz: number;
	radius: number;
	kicked: boolean;
}

export function createFirstTimeFinishSketch({ onComplete }: FirstTimeFinishSketchOptions) {
	let resolveStart: (() => void) | null = null;
	let startRequested = false;

	const sketch = function (p: p5, width: number, height: number) {
		const ft = createFooty(p);
		const s = p as unknown as Record<string, unknown>;
		ft.camera.z = -4;

		let ball: Ball;
		let scored = false;
		let saved = false;
		let outcome: string | null = null;
		let outcomeTime = 0;
		let completed = false;
		let trail: { x: number; y: number; z: number }[] = [];
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

			ft.drawStadium(scored);
			ft.drawPitch();
			ft.drawGoal();

			if (paused && !firstFrame) return;

			firstFrame = false;

			if (paused) {
				ft.updateGoalie();
				ft.drawGoalie();
				ft.drawBall(ball);
				return;
			}

			ft.updateGoalie();
			updateBall();

			ft.drawGoalie();
			drawTrail();
			drawGhostBall();
			ft.drawBall(ball);
		};

		p.mousePressed = (): boolean => {
			if (paused) return false;
			if (ball.kicked) return false;
			const ballScreen = ft.project(ball.x, ball.y, ball.z);
			const d = Math.hypot(p.mouseX - ballScreen.x, p.mouseY - ballScreen.y);
			if (d > KICK_RADIUS) return false;

			kickBall();
			return false;
		};

		s.touchStarted = (): boolean => {
			p.mousePressed();
			return false;
		};

		function resetBall() {
			ball = {
				x: SPAWN_X,
				y: Math.random() * 2,
				z: SPAWN_Z(),
				vx: SPAWN_VX(),
				vy: SPAWN_VY(),
				vz: 0,
				radius: 0.11,
				kicked: false
			};
			scored = false;
			saved = false;
			outcome = null;
			completed = false;
			trail = [];
			ft.reset();
		}

		function kickBall() {
			ball.kicked = true;

			const ballScreen = ft.project(ball.x, ball.y, ball.z);
			const aim = ft.computeKickAim(
				ballScreen,
				p.mouseX,
				p.mouseY,
				KICK_RADIUS,
				KICK_VX_MAX,
				KICK_VY_MAX
			);
			ball.vx = aim.vx;
			ball.vy = aim.vy;
			ball.vz = KICK_VZ;

			const t = ft.goal.z / ball.vz;
			const predX = ball.vx * t;
			let predY = ball.y + ball.vy * t - 0.5 * ft.gravity * t * t;
			if (predY < ball.radius) predY = ball.radius;

			ft.goalieReact(predX, predY, GOALIE_DECISIONS, MAX_REACTION_DELAY_MS);
		}

		function updateBall() {
			const dt = p.deltaTime / 1000;
			const speedMult = ball.kicked ? 1 : PRE_KICK_SPEED_MULT;

			ball.vy -= ft.gravity * dt * speedMult;

			ball.x += ball.vx * dt * speedMult;
			ball.y += ball.vy * dt * speedMult;
			ball.z += ball.vz * dt * speedMult;

			if (!ball.kicked) {
				trail.push({ x: ball.x, y: ball.y, z: ball.z });
				if (trail.length > TRAIL_LENGTH) trail.shift();
			}

			if (ball.y < ball.radius) {
				ball.y = ball.radius;

				if (Math.abs(ball.vy) > 0.5) {
					ball.vy *= -0.55;
				} else {
					ball.vy = 0;
				}
			}

			if (ball.kicked) {
				if (ball.z >= ft.goal.z && ball.z <= ft.goal.z + 1 && !scored && !saved) {
					const inFrame =
						ball.x > -ft.goal.width / 2 && ball.x < ft.goal.width / 2 && ball.y <= ft.goal.height;

					if (inFrame && ft.goalieSaveCheck(ball.x, ball.y, ball.radius)) {
						ball.vx *= 0.5;
						ball.vz *= -0.4;
						ball.vy *= 0.8;
						saved = true;
						outcome = 'Saved!';
						outcomeTime = p.millis();
						emitResult('saved');
					} else if (inFrame) {
						scored = true;
						ft.netRipple.active = true;
						ft.netRipple.impactX = ball.x;
						ft.netRipple.impactY = ball.y;
						ft.netRipple.startTime = p.millis();
						outcome = 'Goal!';
						outcomeTime = p.millis();
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
					outcomeTime = p.millis();
					emitResult('miss');
				}

				if (ball.z > 30) {
					if (!outcome) {
						outcome = 'Missed!';
						outcomeTime = p.millis();
						emitResult('miss');
					}
				}
			} else {
				if (ball.x > RESET_X_THRESHOLD) {
					resetBall();
				}
			}

			if (outcome && !completed && p.millis() - outcomeTime >= 2000) {
				resetBall();
			}
		}

		function emitResult(result: Outcome) {
			if (completed) return;
			completed = true;
			onComplete(result);
		}

		function drawTrail() {
			if (ball.kicked) return;
			for (let i = 0; i < trail.length; i++) {
				const pt = trail[i];
				const proj = ft.project(pt.x, pt.y, pt.z);
				const alpha = p.map(i, 0, trail.length - 1, 15, 70);
				const size = ball.radius * 2 * proj.scale * p.map(i, 0, trail.length - 1, 0.5, 1);
				p.noStroke();
				p.fill(255, alpha);
				p.ellipse(proj.x, proj.y, size, size);
			}
		}

		function drawGhostBall() {
			if (ball.kicked || outcome) return;

			const ghostWorldX =
				(GHOST_SCREEN_X - p.width / 2) / (ft.camera.focalLength / (ball.z - ft.camera.z));
			const ghost = ft.project(ghostWorldX, ball.y, ball.z);
			const real = ft.project(ball.x, ball.y, ball.z);

			if (real.x > ghost.x) return;

			const ghostShadow = ft.project(ghostWorldX, 0, ball.z);
			p.noStroke();
			p.fill(0, 30);
			p.ellipse(
				ghostShadow.x,
				ghostShadow.y,
				ball.radius * 2 * ghostShadow.scale,
				ball.radius * ghostShadow.scale * 0.8
			);

			const dia = ball.radius * 2 * ghost.scale;
			p.noStroke();
			p.fill(255, 60);
			p.ellipse(ghost.x, ghost.y, dia, dia);

			p.noFill();
			p.stroke(255, 100);
			p.strokeWeight(1.5);
			p.ellipse(ghost.x, ghost.y, dia, dia);
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

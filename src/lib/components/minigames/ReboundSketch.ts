import type { Outcome } from '$lib/types/game';
import { createFooty } from './footy';
import type p5 from 'p5';

interface ReboundSketchOptions {
	onComplete: (outcome: Outcome) => void;
	showCrowd?: boolean;
}

const KICK_VX_MAX = 16;
const KICK_VY_MAX = 18;
const KICK_VZ = 18;
const KICK_RADIUS = 100;
const CPU_VZ = 25;
const CPU_GOALIE_DECISIONS = ['read'];
const REBOUND_SPEED_MULT = 0.15;
const SLOMO_START_Z = 6;
const TRAIL_LENGTH = 40;
const GOALIE_DOWN_DELAY_MS = 800;
const GOALIE_RECOVERY_MS = 600;
const GOAL_WIDTH = 7.32;
const GOAL_HEIGHT = 2.44;
const GOAL_Z = 11;
const START_Z = -3;

type Phase = 'cpu-shot' | 'rebound' | 'player-shot' | 'done';

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

export function createReboundSketch({ onComplete, showCrowd = true }: ReboundSketchOptions) {
	let resolveStart: (() => void) | null = null;
	let startRequested = false;

	const sketch = function (p: p5, width: number, height: number) {
		const ft = createFooty(p);
		const s = p as unknown as Record<string, unknown>;
		ft.camera.z = -2;

		let ball: Ball;
		let phase: Phase = 'cpu-shot';
		let scored = false;
		let saved = false;
		let outcome: string | null = null;
		let outcomeTime = 0;
		let completed = false;
		let trail: { x: number; y: number; z: number }[] = [];
		let paused = true;
		let firstFrame = true;
		let keeperSaveTime = 0;
		let keeperDiveX = 0;
		let slowRebound = false;

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
				ft.updateGoalie();
				ft.drawGoalie();
				ft.drawBall(ball);
				return;
			}

			ft.updateGoalie();
			updateKeeperRecovery();
			updateBall();

			ft.drawGoalie();
			if (slowRebound && !ball.kicked) {
				drawTrail();
			}
			ft.drawBall(ball);
		};

		p.mousePressed = (): boolean => {
			if (paused) return false;
			if (phase !== 'rebound') return false;
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
			const cpuStartX = p.random(-2.5, 2.5);
			const cpuStartY = p.random(0.5, 2.0);

			const side = p.random() < 0.5 ? -1 : 1;
			const cpuTargetX = side * (GOAL_WIDTH / 2 - GOAL_WIDTH / 4);
			const cpuTargetY = p.random(0.8, 1.8);

			const dz = GOAL_Z - START_Z;
			const t = dz / CPU_VZ;
			const cpuVx = (cpuTargetX - cpuStartX) / t;
			const cpuVy = (cpuTargetY - cpuStartY + 0.5 * ft.gravity * t * t) / t;

			ball = {
				x: cpuStartX,
				y: cpuStartY,
				z: START_Z,
				vx: cpuVx,
				vy: cpuVy,
				vz: CPU_VZ,
				radius: 0.11,
				kicked: false
			};
			phase = 'cpu-shot';
			scored = false;
			saved = false;
			outcome = null;
			completed = false;
			trail = [];
			keeperSaveTime = 0;
			slowRebound = false;
			ft.reset();

			ft.goalieReact(cpuTargetX, cpuTargetY, CPU_GOALIE_DECISIONS, 0);
		}

		function kickBall() {
			ball.kicked = true;
			saved = false;
			phase = 'player-shot';

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

			const predT = GOAL_Z / ball.vz;
			const predX = ball.vx * predT;
			let predY = ball.y + ball.vy * predT - 0.5 * ft.gravity * predT * predT;
			if (predY < ball.radius) predY = ball.radius;

			const diveScale = p.random(0.5, 1);
			ft.goalieReact(predX * diveScale, predY, ['read'], 400);
		}

		function updateKeeperRecovery() {
			if (phase !== 'rebound') return;
			if (!keeperSaveTime) return;

			const now = p.millis();
			const elapsed = now - keeperSaveTime;

			if (elapsed < GOALIE_DOWN_DELAY_MS) {
				ft.goalie.diving = true;
				return;
			}

			ft.goalie.diving = false;

			const recoverElapsed = elapsed - GOALIE_DOWN_DELAY_MS;
			const recT = Math.min(recoverElapsed / GOALIE_RECOVERY_MS, 1);

			ft.goalie.x = p.lerp(keeperDiveX, 0, recT);
			ft.goalie.y = p.lerp(ft.goalie.y, 0, recT);

			if (recT >= 1) {
				ft.goalie.x = 0;
				ft.goalie.y = 0;
			}
		}

		function updateBall() {
			const dt = p.deltaTime / 1000;

			if (phase === 'rebound' && !ball.kicked) {
				if (!slowRebound && ball.z <= SLOMO_START_Z) {
					slowRebound = true;
				}

				const mult = slowRebound ? REBOUND_SPEED_MULT : 1;
				ball.vy -= ft.gravity * dt * mult;
				ball.x += ball.vx * dt * mult;
				ball.y += ball.vy * dt * mult;
				ball.z += ball.vz * dt * mult;
			} else {
				ball.vy -= ft.gravity * dt;
				ball.x += ball.vx * dt;
				ball.y += ball.vy * dt;
				ball.z += ball.vz * dt;
			}

			if (phase === 'cpu-shot') {
				if (ball.z >= GOAL_Z && !saved) {
					const inFrame =
						ball.x > -GOAL_WIDTH / 2 && ball.x < GOAL_WIDTH / 2 && ball.y <= GOAL_HEIGHT;

					if (inFrame) {
						saved = true;
						keeperSaveTime = p.millis();
						keeperDiveX = ft.goalie.x;

						ball.vx = (ball.x < 0 ? 1 : -1) * p.random(3, 6);
						ball.vy = p.random(2, 5);
						ball.vz = -p.random(15, 22);
						ball.kicked = false;
						slowRebound = false;
						phase = 'rebound';
					} else {
						resetBall();
					}
				}
			}

			if (phase === 'rebound' && !ball.kicked) {
				if (slowRebound) {
					trail.push({ x: ball.x, y: ball.y, z: ball.z });
					if (trail.length > TRAIL_LENGTH) trail.shift();
				}

				if (ball.z < -10) {
					resetBall();
				}
			}

			if (ball.y < ball.radius) {
				ball.y = ball.radius;
				if (Math.abs(ball.vy) > 0.5) {
					ball.vy *= -0.55;
				} else {
					ball.vy = 0;
				}
			}

			if (phase === 'player-shot') {
				if (ball.z >= GOAL_Z && ball.z <= GOAL_Z + 1 && !scored && !saved) {
					const inFrame =
						ball.x > -GOAL_WIDTH / 2 && ball.x < GOAL_WIDTH / 2 && ball.y <= GOAL_HEIGHT;

					if (inFrame && ft.goalieSaveCheck(ball.x, ball.y, ball.radius)) {
						ball.vx *= 0.5;
						ball.vz *= -0.4;
						ball.vy *= 0.8;
						saved = true;
						outcome = 'Saved!';
						outcomeTime = p.millis();
						emitResult('saved');
						phase = 'done';
					} else if (inFrame) {
						scored = true;
						ft.netRipple.active = true;
						ft.netRipple.impactX = ball.x;
						ft.netRipple.impactY = ball.y;
						ft.netRipple.startTime = p.millis();
						outcome = 'Goal!';
						outcomeTime = p.millis();
						emitResult('goal');
						phase = 'done';
					}
				}

				if (!outcome && ball.z > GOAL_Z + 3) {
					outcome = 'Missed!';
					outcomeTime = p.millis();
					emitResult('miss');
					phase = 'done';
				}

				if (!outcome && ball.z > 30) {
					outcome = 'Missed!';
					outcomeTime = p.millis();
					emitResult('miss');
					phase = 'done';
				}
			}

			if (scored) {
				ball.z = Math.min(ball.z, GOAL_Z + 2);
				ball.x = p.constrain(ball.x, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
				ball.vx *= 0.9;
				ball.vz *= 0.92;
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

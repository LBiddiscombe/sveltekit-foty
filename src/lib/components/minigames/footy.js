// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export function createFooty(p) {
	const gravity = 30;
	const NET_COLS = 30;
	const NET_ROWS = 10;

	const camera = {
		focalLength: 550,
		height: 2,
		horizonY: 100,
		z: -3
	};

	const goal = {
		z: 11,
		width: 7.32,
		height: 2.44
	};

	const goalie = {
		x: 0,
		y: 0,
		vy: 0,
		targetX: 0,
		targetY: 0,
		height: 1.8,
		width: 0.8,
		diving: false,
		diveStartTime: 0,
		decision: null,
		z: 11
	};

	let goalieStandImg;
	let goalieDiveImg;
	let ballImg;
	let netRipple = { active: false, impactX: 0, impactY: 0, startTime: 0 };

	async function preload() {
		goalieStandImg = await p.loadImage('/minigames/goalie_stand.png');
		goalieDiveImg = await p.loadImage('/minigames/goalie_dive.png');
		ballImg = await p.loadImage('/minigames/ball.png');
	}

	function reset() {
		goalie.diving = false;
		goalie.x = 0;
		goalie.y = 0;
		goalie.vy = 0;
		goalie.decision = null;
		netRipple.active = false;
	}

	function project(x, y, z) {
		const dz = Math.max(z - camera.z, 0.1);
		const scale = camera.focalLength / dz;
		return {
			x: p.width / 2 + x * scale,
			y: camera.horizonY + (camera.height - y) * scale,
			scale
		};
	}

	function drawPitch() {
		const goalLineLeft = project(-20, 0, goal.z);
		const goalLineRight = project(20, 0, goal.z);
		p.stroke(255, 100);
		p.strokeWeight(2);
		p.line(goalLineLeft.x, goalLineLeft.y, goalLineRight.x, goalLineRight.y);

		const boxLeft = project(-5.5, 0, goal.z);
		const boxRight = project(5.5, 0, goal.z);
		const boxTop = project(-5.5, 0, goal.z - 5.5);
		const boxBottom = project(5.5, 0, goal.z - 5.5);
		p.stroke(255, 100);
		p.strokeWeight(2);
		p.noFill();
		p.line(boxLeft.x, boxLeft.y, boxTop.x, boxTop.y);
		p.line(boxRight.x, boxRight.y, boxBottom.x, boxBottom.y);
		p.line(boxTop.x, boxTop.y, boxBottom.x, boxBottom.y);

		const penaltySpot = project(0, 0, goal.z - 11);
		p.fill(255, 100);
		p.noStroke();
		p.ellipse(penaltySpot.x, penaltySpot.y, 20, 10);
	}

	function drawStadium(scored) {
		p.noStroke();

		const skyColors = [
			[110, 170, 225],
			[135, 190, 235],
			[155, 205, 245],
			[170, 218, 252],
			[180, 228, 255]
		];
		const bandH = Math.ceil((camera.horizonY + 10) / skyColors.length / 4) * 4;
		for (let i = 0; i < skyColors.length; i++) {
			const c = skyColors[i];
			p.fill(c[0], c[1], c[2]);
			p.rect(0, i * bandH, p.width, bandH + 1);
		}

		const rows = 7;
		for (let row = rows - 1; row >= 0; row--) {
			const zPos = goal.z + 3 + row * 1.5;

			const count = Math.max(1, 10 - row);
			for (let s = 0; s < count; s++) {
				const sx = p.map(s, 0, count - 1, -9.5, 9.5) + (row % 2) * 0.4;
				const midZ = zPos - 0.3;
				const bodyH = 1.5;

				const feet = project(sx, row / rows, midZ);
				const top = project(sx, row / rows + bodyH, midZ);
				const h = feet.y - top.y;
				if (h < 3) continue;

				const aspect = goalieStandImg.width / goalieStandImg.height;
				const w = h * aspect;

				const hue = (row * 47 + s * 31 + 7) % 360;
				const r = Math.min(255, Math.max(0, 128 + 127 * Math.sin(hue * 0.01745)));
				const g = Math.min(255, Math.max(0, 128 + 127 * Math.sin(hue * 0.01745 + 2.094)));
				const b = Math.min(255, Math.max(0, 128 + 127 * Math.sin(hue * 0.01745 + 4.189)));

				p.push();
				p.tint(r, g, b);

				const celebrating = scored && (row + s) % 2 === 0;
				const img = celebrating ? goalieDiveImg : goalieStandImg;

				let yy = feet.y;
				if (celebrating) {
					yy += Math.sin(p.millis() * 0.03 + row * 2.7 + s * 3.9) * h * 0.12;
				}

				p.image(img, feet.x - w / 2, yy - h, w, h);
				p.pop();
			}
		}

		const boardBase = project(0, 0, goal.z + 1.5);
		const boardH = 28;
		const boardTop = boardBase.y - boardH - 2;

		p.fill(100, 100, 100);
		p.rect(0, boardTop - 2, p.width, 2);

		const brands = ['COLA', 'JET', 'BANK', 'FOX', 'TEL', 'WATCH', 'GO', 'OIL'];
		const bw = p.width / brands.length;

		const palettes = [
			[200, 30, 30],
			[30, 80, 200],
			[200, 180, 20],
			[30, 160, 40],
			[160, 50, 140],
			[30, 150, 180],
			[200, 120, 20],
			[80, 80, 80]
		];

		for (let i = 0; i < brands.length; i++) {
			const x = Math.ceil(i * bw);
			const c = palettes[i];

			p.fill(c[0], c[1], c[2]);
			p.rect(x, boardTop, bw, boardH + 2);

			p.fill(225, 225, 225);
			p.rect(x + 2, boardTop + 2, bw - 4, boardH - 4);

			p.push();
			p.fill(0, 0, 0, 50);
			p.textAlign(p.CENTER, p.CENTER);
			p.textStyle(p.BOLD);
			p.textSize(7);
			p.text(brands[i], x + bw / 2 + 1, boardTop + boardH / 2 + 1);

			p.fill(c[0], c[1], c[2]);
			p.text(brands[i], x + bw / 2, boardTop + boardH / 2);
			p.pop();
		}

		p.noFill();
		p.stroke(200, 200, 200);
		p.strokeWeight(2);
		p.rect(0, boardTop, p.width, boardH + 2);
		p.noStroke();
	}

	function drawGoal() {
		const leftBottom = project(-goal.width / 2, 0, goal.z);
		const rightBottom = project(goal.width / 2, 0, goal.z);
		const leftTop = project(-goal.width / 2, goal.height, goal.z);
		const rightTop = project(goal.width / 2, goal.height, goal.z);

		p.stroke(255);
		p.strokeWeight(4);
		p.line(leftBottom.x, leftBottom.y, leftTop.x, leftTop.y);
		p.line(rightBottom.x, rightBottom.y, rightTop.x, rightTop.y);
		p.line(leftTop.x, leftTop.y, rightTop.x, rightTop.y);

		const netDepth = 2;
		const cols = NET_COLS;
		const rows = NET_ROWS;
		const sideDivs = 4;

		const rippling = netRipple.active;
		const rippleTime = rippling ? (p.millis() - netRipple.startTime) / 1000 : 0;
		const rippleAmp = rippling ? Math.max(0, 10 * (1 - rippleTime / 2.5)) : 0;

		let impactP = null;
		if (rippling) {
			impactP = project(netRipple.impactX, netRipple.impactY, goal.z + netDepth);
		}

		function proj(wx, wy, wz) {
			return project(wx, wy, wz);
		}

		const grid = [];
		for (let r = 0; r <= rows; r++) {
			grid[r] = [];
			for (let c = 0; c <= cols; c++) {
				const wx = p.map(c, 0, cols, -goal.width / 2, goal.width / 2);
				const wy = p.map(r, 0, rows, 0, goal.height);
				let pt = proj(wx, wy, goal.z + netDepth);

				if (rippling && rippleAmp > 0.5 && impactP) {
					const dx = pt.x - impactP.x;
					const dy = pt.y - impactP.y;
					const d = Math.sqrt(dx * dx + dy * dy);
					if (d > 1) {
						const wave = Math.sin(d * 0.05 - rippleTime * 10) * rippleAmp * Math.exp(-d * 0.06);
						pt.x += (dx / d) * wave;
						pt.y += (dy / d) * wave;
					}
				}

				grid[r][c] = pt;
			}
		}

		p.stroke(255, 120);
		p.strokeWeight(2);

		for (let c = 0; c <= cols; c++) {
			for (let r = 0; r < rows; r++) {
				p.line(grid[r][c].x, grid[r][c].y, grid[r + 1][c].x, grid[r + 1][c].y);
			}
		}

		for (let r = 0; r <= rows; r++) {
			for (let c = 0; c < cols; c++) {
				p.line(grid[r][c].x, grid[r][c].y, grid[r][c + 1].x, grid[r][c + 1].y);
			}
		}

		function drawSidePanel(getPoint, pRows) {
			const panelGrid = [];
			for (let i = 0; i <= pRows; i++) {
				panelGrid[i] = [];
				for (let d = 0; d <= sideDivs; d++) {
					panelGrid[i][d] = getPoint(i, d);
				}
			}

			for (let i = 0; i <= pRows; i++) {
				for (let d = 0; d < sideDivs; d++) {
					p.line(
						panelGrid[i][d].x,
						panelGrid[i][d].y,
						panelGrid[i][d + 1].x,
						panelGrid[i][d + 1].y
					);
				}
			}

			for (let d = 0; d <= sideDivs; d++) {
				for (let i = 0; i < pRows; i++) {
					p.line(
						panelGrid[i][d].x,
						panelGrid[i][d].y,
						panelGrid[i + 1][d].x,
						panelGrid[i + 1][d].y
					);
				}
			}
		}

		drawSidePanel((r, d) => {
			const y = p.map(r, 0, rows, 0, goal.height);
			if (d < sideDivs) {
				return proj(-goal.width / 2, y, p.lerp(goal.z, goal.z + netDepth, d / sideDivs));
			}
			return grid[r][0];
		}, rows);

		drawSidePanel((r, d) => {
			const y = p.map(r, 0, rows, 0, goal.height);
			if (d < sideDivs) {
				return proj(goal.width / 2, y, p.lerp(goal.z, goal.z + netDepth, d / sideDivs));
			}
			return grid[r][cols];
		}, rows);

		drawSidePanel((c, d) => {
			const x = p.map(c, 0, cols, -goal.width / 2, goal.width / 2);
			if (d < sideDivs) {
				return proj(x, goal.height, p.lerp(goal.z, goal.z + netDepth, d / sideDivs));
			}
			return grid[rows][c];
		}, cols);

		const bl = grid[0][0];
		const br = grid[0][cols];
		const tl = grid[rows][0];
		const tr = grid[rows][cols];

		p.stroke(255, 180);
		p.strokeWeight(2.5);

		p.line(leftTop.x, leftTop.y, tl.x, tl.y);
		p.line(rightTop.x, rightTop.y, tr.x, tr.y);
		p.line(tl.x, tl.y, tr.x, tr.y);
		p.line(leftBottom.x, leftBottom.y, bl.x, bl.y);
		p.line(rightBottom.x, rightBottom.y, br.x, br.y);
		p.line(bl.x, bl.y, tl.x, leftTop.y);
		p.line(bl.x, bl.y, br.x, br.y);
		p.line(br.x, br.y, tr.x, rightTop.y);
	}

	function drawBall(ball) {
		const shadow = project(ball.x, 0, ball.z);

		p.noStroke();
		p.fill(0, 50);

		p.ellipse(shadow.x, shadow.y, ball.radius * 2 * shadow.scale, ball.radius * shadow.scale * 0.8);

		const pt = project(ball.x, ball.y, ball.z);
		const dia = ball.radius * 2 * pt.scale;
		p.image(ballImg, pt.x - dia / 2, pt.y - dia / 2, dia, dia);
	}

	function updateGoalie() {
		if (!goalie.diving) return;

		const now = p.millis();
		if (now < goalie.diveStartTime) return;

		if (goalie.decision === 'freeze') return;

		const dt = p.deltaTime / 1000;
		const elapsed = now - goalie.diveStartTime;

		const t = Math.min(elapsed / 650, 1);
		goalie.x = p.lerp(0, goalie.targetX, t);

		goalie.vy -= gravity * dt;
		goalie.y += goalie.vy * dt;

		if (goalie.y < 0) {
			goalie.y = 0;
			goalie.vy = 0;
		}
	}

	function goalieCollisionBounds() {
		const now = p.millis();
		if (goalie.diving && Math.abs(goalie.targetX) >= 1.0 && now >= goalie.diveStartTime) {
			const dir = Math.sign(goalie.targetX) || 1;
			const diveT = Math.min(Math.max((now - goalie.diveStartTime) / 100, 0), 1);

			const standingLeft = goalie.x - goalie.width / 2;
			const standingRight = goalie.x + goalie.width / 2;

			const divingLeft = dir >= 0 ? goalie.x : goalie.x - goalie.height;
			const divingRight = dir >= 0 ? goalie.x + goalie.height : goalie.x;

			return {
				left: p.lerp(standingLeft, divingLeft, diveT),
				right: p.lerp(standingRight, divingRight, diveT),
				bottom: goalie.y,
				top: p.lerp(goalie.y + goalie.height, goalie.y + goalie.width, diveT)
			};
		}
		return {
			left: goalie.x - goalie.width / 2,
			right: goalie.x + goalie.width / 2,
			bottom: goalie.y,
			top: goalie.y + goalie.height
		};
	}

	function goalieSaveCheck(bx, by, ballRadius) {
		const b = goalieCollisionBounds();
		return (
			bx > b.left - ballRadius &&
			bx < b.right + ballRadius &&
			by > b.bottom - ballRadius &&
			by < b.top + ballRadius
		);
	}

	function goalieReact(predX, predY, decisions, maxDelayMs) {
		const decision = p.random(decisions);
		const delay = p.random(0, maxDelayMs);
		goalie.decision = decision;
		goalie.diving = true;
		goalie.diveStartTime = p.millis() + delay;

		if (decision === 'read') {
			goalie.targetX = p.constrain(predX, -goal.width / 2, goal.width / 2);
			goalie.targetY = p.constrain(predY, 0, goal.height);
			goalie.vy = Math.sqrt(2 * gravity * goalie.targetY);
		} else if (decision === 'randcorner') {
			const side = p.random() < 0.5 ? -1 : 1;
			goalie.targetX = (side * goal.width) / 2;
			goalie.targetY = p.random(0, goal.height);
			goalie.vy = Math.sqrt(2 * gravity * goalie.targetY);
		} else {
			goalie.targetX = 0;
			goalie.targetY = 0;
			goalie.vy = 0;
		}
	}

	function computeKickAim(ballScreen, mouseX, mouseY, radius, maxVx, maxVy) {
		const dx = mouseX - ballScreen.x;
		const dy = mouseY - ballScreen.y;
		const d = Math.hypot(dx, dy) || 1;
		return {
			vx: -(dx / d) * p.map(d, 0, radius, 0, maxVx, true),
			vy: (dy / d) * p.map(d, 0, radius, 0, maxVy, true)
		};
	}

	function drawKickRadius(ball, radius) {
		const pt = project(ball.x, ball.y, ball.z);
		p.noFill();
		p.stroke(255, 255, 0, 80);
		p.strokeWeight(1);
		p.circle(pt.x, pt.y, radius * 2);
	}

	function drawGoalie() {
		const diving = goalie.diving && p.millis() >= goalie.diveStartTime;
		const img = diving ? goalieDiveImg : goalieStandImg;

		const feet = project(goalie.x, goalie.y, goalie.z);
		const top = project(goalie.x, goalie.y + goalie.height, goalie.z);

		const sprH = feet.y - top.y;
		const sprW = sprH * (goalie.width / goalie.height);

		const cropRatio = goalie.width / goalie.height;
		const sx = (img.width - img.width * cropRatio) / 2;
		const sw = img.width * cropRatio;

		p.push();
		p.translate(feet.x, feet.y);
		if (diving) {
			const elapsed = p.millis() - goalie.diveStartTime;
			const rotT = elapsed >= 0 ? Math.min(elapsed / 100, 1) : 0;
			if (Math.abs(goalie.targetX) >= 1.0) {
				p.translate(0, -p.lerp(0, sprW / 2, rotT));
				p.rotate((Math.sign(goalie.targetX) * rotT * Math.PI) / 2);
			}
		}
		p.imageMode(p.CORNER);
		p.image(img, -sprW / 2, -sprH, sprW, sprH, sx, 0, sw, img.height);
		p.pop();
	}

	return {
		gravity,
		camera,
		goal,
		goalie,
		netRipple,
		preload,
		reset,
		project,
		drawPitch,
		drawStadium,
		drawGoal,
		drawBall,
		updateGoalie,
		goalieCollisionBounds,
		goalieSaveCheck,
		goalieReact,
		drawGoalie,
		drawKickRadius,
		computeKickAim
	};
}

// Teletype engine for the vidiprinter.
// Reveals one score line at a time, character by character,
// with a carriage-return pause between lines.

export interface TeletypeConfig {
	charSpeed: number;
	linePause: number;
}

export function createTeletype(lines: string[], config: TeletypeConfig) {
	let charIndex = $state(0);
	let currentLine = $state(0);
	let currentCharInLine = $state(0);
	let lineDone = $state(false);
	let done = $state(false);
	let speed = $state(config.charSpeed);

	const totalChars = lines.reduce((a, l) => a + l.length, 0);

	$effect(() => {
		if (done) return;
		if (currentLine >= lines.length) {
			done = true;
			return;
		}

		const line = currentLine;
		const text = lines[line];
		const s = speed;

		const timer = setInterval(() => {
			currentCharInLine++;
			charIndex++;

			if (currentCharInLine >= text.length) {
				lineDone = true;
				clearInterval(timer);
				setTimeout(() => {
					currentLine++;
					currentCharInLine = 0;
					lineDone = false;
				}, config.linePause);
			}
		}, s);

		return () => clearInterval(timer);
	});

	function textForLine(lineIdx: number): string {
		if (lineIdx < currentLine) return lines[lineIdx];
		if (lineIdx === currentLine) return lines[lineIdx].slice(0, currentCharInLine);
		return '';
	}

	return {
		get currentLine() {
			return currentLine;
		},
		get currentCharInLine() {
			return currentCharInLine;
		},
		get lineDone() {
			return lineDone;
		},
		get done() {
			return done;
		},
		get totalChars() {
			return totalChars;
		},
		get charIndex() {
			return charIndex;
		},
		set speed(v: number) {
			speed = v;
		},
		textForLine,
		reset() {
			charIndex = 0;
			currentLine = 0;
			currentCharInLine = 0;
			lineDone = false;
			done = false;
		}
	};
}

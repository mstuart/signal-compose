/**
Create an `AbortSignal` that aborts when ANY of the input signals abort.

@param {Iterable<AbortSignal>} signals - The signals to monitor.
@returns {AbortSignal} A signal that aborts when any input signal aborts.
*/
export function anySignal(signals) {
	const signalArray = [...signals];

	// Check if any are already aborted
	for (const signal of signalArray) {
		if (signal.aborted) {
			return AbortSignal.abort(signal.reason);
		}
	}

	const controller = new AbortController();

	const onAbort = function () {
		controller.abort(this.reason);
		cleanup();
	};

	const cleanup = () => {
		for (const signal of signalArray) {
			signal.removeEventListener('abort', onAbort);
		}
	};

	for (const signal of signalArray) {
		signal.addEventListener('abort', onAbort, {once: true});
	}

	// Clean up listeners when our signal aborts (in case aborted externally)
	controller.signal.addEventListener('abort', cleanup, {once: true});

	return controller.signal;
}

/**
Create an `AbortSignal` that aborts when ALL of the input signals have aborted.

The reason will be the reason from the last signal to abort.

@param {Iterable<AbortSignal>} signals - The signals to monitor.
@returns {AbortSignal} A signal that aborts when all input signals have aborted.
*/
export function allSignals(signals) {
	const signalArray = [...signals];

	// If all are already aborted, abort immediately
	if (signalArray.every(signal => signal.aborted)) {
		const lastReason = signalArray.at(-1)?.reason;
		return AbortSignal.abort(lastReason);
	}

	const controller = new AbortController();
	const abortedSet = new Set();

	// Pre-populate already-aborted signals
	for (const signal of signalArray) {
		if (signal.aborted) {
			abortedSet.add(signal);
		}
	}

	const onAbort = function () {
		abortedSet.add(this);

		if (abortedSet.size === signalArray.length) {
			controller.abort(this.reason);
			cleanup();
		}
	};

	const cleanup = () => {
		for (const signal of signalArray) {
			signal.removeEventListener('abort', onAbort);
		}
	};

	for (const signal of signalArray) {
		if (!signal.aborted) {
			signal.addEventListener('abort', onAbort, {once: true});
		}
	}

	controller.signal.addEventListener('abort', cleanup, {once: true});

	return controller.signal;
}

/**
Create an `AbortSignal` that aborts when either the given signal aborts or the timeout expires, whichever comes first.

@param {AbortSignal} signal - The signal to monitor.
@param {number} milliseconds - The timeout duration in milliseconds.
@returns {AbortSignal} A signal that aborts on signal or timeout.
*/
export function timeoutSignal(signal, milliseconds) {
	if (signal.aborted) {
		return AbortSignal.abort(signal.reason);
	}

	const controller = new AbortController();

	const timer = setTimeout(() => {
		controller.abort(new Error('Timeout'));
		cleanup();
	}, milliseconds);

	timer.unref?.();

	const onAbort = () => {
		clearTimeout(timer);
		controller.abort(signal.reason);
		cleanup();
	};

	const cleanup = () => {
		signal.removeEventListener('abort', onAbort);
	};

	signal.addEventListener('abort', onAbort, {once: true});

	controller.signal.addEventListener('abort', () => {
		clearTimeout(timer);
		cleanup();
	}, {once: true});

	return controller.signal;
}

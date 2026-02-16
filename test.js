import test from 'ava';
import {anySignal, allSignals, timeoutSignal} from './index.js';

const delay = ms => new Promise(resolve => {
	setTimeout(resolve, ms);
});

// anySignal tests

test('anySignal aborts when first signal aborts', t => {
	const controller1 = new AbortController();
	const controller2 = new AbortController();

	const signal = anySignal([controller1.signal, controller2.signal]);

	t.false(signal.aborted);

	controller1.abort(new Error('first'));

	t.true(signal.aborted);
	t.is(signal.reason.message, 'first');
});

test('anySignal aborts when second signal aborts', t => {
	const controller1 = new AbortController();
	const controller2 = new AbortController();

	const signal = anySignal([controller1.signal, controller2.signal]);

	controller2.abort(new Error('second'));

	t.true(signal.aborted);
	t.is(signal.reason.message, 'second');
});

test('anySignal with pre-aborted signal returns aborted signal', t => {
	const controller1 = new AbortController();
	controller1.abort(new Error('already'));

	const controller2 = new AbortController();

	const signal = anySignal([controller1.signal, controller2.signal]);

	t.true(signal.aborted);
	t.is(signal.reason.message, 'already');
});

test('anySignal works with single signal', t => {
	const controller = new AbortController();
	const signal = anySignal([controller.signal]);

	t.false(signal.aborted);

	controller.abort(new Error('solo'));

	t.true(signal.aborted);
});

test('anySignal works with three signals', t => {
	const controller1 = new AbortController();
	const controller2 = new AbortController();
	const controller3 = new AbortController();

	const signal = anySignal([controller1.signal, controller2.signal, controller3.signal]);

	t.false(signal.aborted);

	controller3.abort(new Error('third'));

	t.true(signal.aborted);
	t.is(signal.reason.message, 'third');
});

test('anySignal preserves the abort reason', t => {
	const controller1 = new AbortController();
	const controller2 = new AbortController();

	const signal = anySignal([controller1.signal, controller2.signal]);

	const reason = new Error('custom reason');
	controller1.abort(reason);

	t.is(signal.reason.message, 'custom reason');
});

// allSignals tests

test('allSignals does not abort when only one signal aborts', t => {
	const controller1 = new AbortController();
	const controller2 = new AbortController();

	const signal = allSignals([controller1.signal, controller2.signal]);

	controller1.abort(new Error('first'));

	t.false(signal.aborted);
});

test('allSignals aborts when all signals abort', t => {
	const controller1 = new AbortController();
	const controller2 = new AbortController();

	const signal = allSignals([controller1.signal, controller2.signal]);

	controller1.abort(new Error('first'));
	t.false(signal.aborted);

	controller2.abort(new Error('second'));
	t.true(signal.aborted);
});

test('allSignals reason is from the last signal to abort', t => {
	const controller1 = new AbortController();
	const controller2 = new AbortController();

	const signal = allSignals([controller1.signal, controller2.signal]);

	controller1.abort(new Error('first'));
	controller2.abort(new Error('last'));

	t.is(signal.reason.message, 'last');
});

test('allSignals with some pre-aborted signals', t => {
	const controller1 = new AbortController();
	controller1.abort(new Error('pre-aborted'));

	const controller2 = new AbortController();

	const signal = allSignals([controller1.signal, controller2.signal]);

	t.false(signal.aborted);

	controller2.abort(new Error('now all'));

	t.true(signal.aborted);
});

test('allSignals with all pre-aborted signals', t => {
	const controller1 = new AbortController();
	controller1.abort(new Error('first'));

	const controller2 = new AbortController();
	controller2.abort(new Error('second'));

	const signal = allSignals([controller1.signal, controller2.signal]);

	t.true(signal.aborted);
});

test('allSignals with three signals', t => {
	const controller1 = new AbortController();
	const controller2 = new AbortController();
	const controller3 = new AbortController();

	const signal = allSignals([controller1.signal, controller2.signal, controller3.signal]);

	controller1.abort();
	t.false(signal.aborted);

	controller2.abort();
	t.false(signal.aborted);

	controller3.abort(new Error('final'));
	t.true(signal.aborted);
});

test('allSignals with single signal', t => {
	const controller = new AbortController();
	const signal = allSignals([controller.signal]);

	t.false(signal.aborted);

	controller.abort(new Error('only'));
	t.true(signal.aborted);
});

// timeoutSignal tests

test('timeoutSignal aborts on timeout', async t => {
	const controller = new AbortController();
	const signal = timeoutSignal(controller.signal, 20);

	t.false(signal.aborted);

	await delay(50);

	t.true(signal.aborted);
	t.is(signal.reason.message, 'Timeout');
});

test('timeoutSignal aborts on signal before timeout', async t => {
	const controller = new AbortController();
	const signal = timeoutSignal(controller.signal, 5000);

	t.false(signal.aborted);

	controller.abort(new Error('manual'));

	t.true(signal.aborted);
	t.is(signal.reason.message, 'manual');
});

test('timeoutSignal with pre-aborted signal returns aborted signal', t => {
	const controller = new AbortController();
	controller.abort(new Error('already'));

	const signal = timeoutSignal(controller.signal, 5000);

	t.true(signal.aborted);
	t.is(signal.reason.message, 'already');
});

test('timeoutSignal returns an AbortSignal', t => {
	const controller = new AbortController();
	const signal = timeoutSignal(controller.signal, 1000);

	t.true(signal instanceof AbortSignal);
	controller.abort();
});

test('timeoutSignal preserves signal reason', t => {
	const controller = new AbortController();
	const signal = timeoutSignal(controller.signal, 5000);

	const reason = new Error('custom');
	controller.abort(reason);

	t.is(signal.reason.message, 'custom');
});

test('timeoutSignal timeout reason is Error("Timeout")', async t => {
	const controller = new AbortController();
	const signal = timeoutSignal(controller.signal, 10);

	await delay(30);

	t.true(signal.aborted);
	t.true(signal.reason instanceof Error);
	t.is(signal.reason.message, 'Timeout');
});

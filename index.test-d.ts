import {expectType, expectError} from 'tsd';
import {anySignal, allSignals, timeoutSignal} from './index.js';

const controller1 = new AbortController();
const controller2 = new AbortController();

// anySignal
expectType<AbortSignal>(anySignal([controller1.signal, controller2.signal]));

// allSignals
expectType<AbortSignal>(allSignals([controller1.signal, controller2.signal]));

// timeoutSignal
expectType<AbortSignal>(timeoutSignal(controller1.signal, 5000));

// Invalid usage
expectError(anySignal('not iterable'));
expectError(allSignals(123));
expectError(timeoutSignal('not a signal', 5000));
expectError(timeoutSignal(controller1.signal, 'not a number'));

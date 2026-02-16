import {expectType, expectError} from 'tsd';
import {anySignal, allSignals, timeoutSignal} from './index.js';

const controller1 = new AbortController();
const controller2 = new AbortController();

// AnySignal
expectType<AbortSignal>(anySignal([controller1.signal, controller2.signal]));

// AllSignals
expectType<AbortSignal>(allSignals([controller1.signal, controller2.signal]));

// TimeoutSignal
expectType<AbortSignal>(timeoutSignal(controller1.signal, 5000));

// Invalid usage
expectError(anySignal('not iterable'));
expectError(allSignals(123));
expectError(timeoutSignal('not a signal', 5000));
expectError(timeoutSignal(controller1.signal, 'not a number'));

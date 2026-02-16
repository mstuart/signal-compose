/**
Create an `AbortSignal` that aborts when ANY of the input signals abort.

If any input signal is already aborted, the returned signal is immediately aborted with that signal's reason.

@param signals - The signals to monitor.
@returns A signal that aborts when any input signal aborts.

@example
```
import {anySignal} from 'signal-compose';

const controller1 = new AbortController();
const controller2 = new AbortController();

const signal = anySignal([controller1.signal, controller2.signal]);

controller1.abort();
console.log(signal.aborted);
//=> true
```
*/
export function anySignal(signals: Iterable<AbortSignal>): AbortSignal;

/**
Create an `AbortSignal` that aborts when ALL of the input signals have aborted.

The reason will be the reason from the last signal to abort.

@param signals - The signals to monitor.
@returns A signal that aborts when all input signals have aborted.

@example
```
import {allSignals} from 'signal-compose';

const controller1 = new AbortController();
const controller2 = new AbortController();

const signal = allSignals([controller1.signal, controller2.signal]);

controller1.abort();
console.log(signal.aborted);
//=> false

controller2.abort();
console.log(signal.aborted);
//=> true
```
*/
export function allSignals(signals: Iterable<AbortSignal>): AbortSignal;

/**
Create an `AbortSignal` that aborts when either the given signal aborts or the timeout expires, whichever comes first.

@param signal - The signal to monitor.
@param milliseconds - The timeout duration in milliseconds.
@returns A signal that aborts on signal or timeout.

@example
```
import {timeoutSignal} from 'signal-compose';

const controller = new AbortController();

const signal = timeoutSignal(controller.signal, 5000);

// Signal will abort after 5 seconds, or when controller.abort() is called.
```
*/
export function timeoutSignal(signal: AbortSignal, milliseconds: number): AbortSignal;

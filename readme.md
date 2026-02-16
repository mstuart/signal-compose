# signal-compose

> Compose multiple AbortSignals with AND, OR, and timeout semantics

## Install

```sh
npm install signal-compose
```

## Usage

```js
import {anySignal, allSignals, timeoutSignal} from 'signal-compose';

const controller1 = new AbortController();
const controller2 = new AbortController();

// Abort when ANY signal aborts
const either = anySignal([controller1.signal, controller2.signal]);

// Abort when ALL signals have aborted
const both = allSignals([controller1.signal, controller2.signal]);

// Abort on signal OR timeout (5 seconds)
const withTimeout = timeoutSignal(controller1.signal, 5000);
```

## API

### anySignal(signals)

Returns an `AbortSignal` that aborts when ANY of the input signals abort. If any input signal is already aborted, the returned signal is immediately aborted.

#### signals

Type: `Iterable<AbortSignal>`

The signals to monitor.

### allSignals(signals)

Returns an `AbortSignal` that aborts when ALL of the input signals have aborted. The reason will be the reason from the last signal to abort.

#### signals

Type: `Iterable<AbortSignal>`

The signals to monitor.

### timeoutSignal(signal, milliseconds)

Returns an `AbortSignal` that aborts when either the given signal aborts or the timeout expires, whichever comes first.

#### signal

Type: `AbortSignal`

The signal to monitor.

#### milliseconds

Type: `number`

The timeout duration in milliseconds.

## Related

- [abort-race](https://github.com/mstuart/abort-race) - Race async operations with automatic AbortSignal cleanup

## License

MIT

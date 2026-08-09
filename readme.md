<div align="center">
  <img src="docs/assets/logo.svg" alt="signal-compose — Compose multiple AbortSignals with AND, OR, and timeout semantics" width="720">
</div>

<p align="center"><strong>Compose multiple AbortSignals with AND, OR, and timeout semantics</strong></p>

<p align="center">
  <a href="https://github.com/mstuart/signal-compose/actions/workflows/main.yml"><img src="https://github.com/mstuart/signal-compose/actions/workflows/main.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/signal-compose"><img src="https://img.shields.io/npm/v/signal-compose?label=npm" alt="npm"></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-339933.svg" alt="Node 20+">
  <a href="https://deepwiki.com/mstuart/signal-compose"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
  <a href="https://socket.dev/npm/package/signal-compose"><img src="https://socket.dev/api/badge/npm/package/signal-compose" alt="Socket"></a>
</p>

---
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

## PureMVC Multicore Async Command Utility - Developer Guide

This guide explains how the Async Command utility works and how to use it in a PureMVC Typescript Multicore app. You’ll learn the execution model and see practical, copy‑pasteable examples in Typescript.

### What Problem Does This Solve?
You often need to execute a series of commands where one or more steps perform asynchronous work (fetch data, wait for timers, write to storage, etc.). Orchestration using notifications alone couples commands together. `AsyncCommand` and `AsyncMacroCommand` let you compose a pipeline where each step can be synchronous or asynchronous, and the next step runs only after the current one completes.

---

### Key Types

- `IAsyncCommand` — interface extending PureMVC `ICommand` with `setOnComplete(cb)`.
- `AsyncCommand` — base class for a command that may finish later; call `commandComplete()` when done.
- `AsyncMacroCommand` — orchestrates a FIFO list of sub‑commands. Supports both sync (`SimpleCommand`) and async (`AsyncCommand`/`AsyncMacroCommand`) sub‑commands.

Imports (ESM):
```ts
import { AsyncCommand } from "./src/command/AsyncCommand.js";
import { AsyncMacroCommand } from "./src/command/AsyncMacroCommand.js";
// Or, if consuming from the published package:
// import { AsyncCommand, AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";

import {
  SimpleCommand,
  INotification,
  Facade,
  ICommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
```

Note: This repo uses ESM; local relative imports include the `.js` suffix.

---

### Execution Model and Lifecycle

1. You register a macro (or simple) command with the Controller (usually via your `Facade`).
2. A notification is sent. The Controller instantiates the mapped command and calls its `execute(notification)`.
3. For `AsyncMacroCommand`:
   - It stores the `notification` and calls `nextCommand()`.
   - It dequeues the next sub‑command factory, creates the command, and runs it.
   - If the sub‑command is async (`AsyncCommand` or `AsyncMacroCommand`), the macro waits until that sub‑command calls its completion callback.
   - When the queue is empty, the macro calls its own completion callback (if part of a parent macro) and clears references.
4. For `AsyncCommand`:
   - Do your work in `execute(notification)`.
   - When asynchronous work completes, call `this.commandComplete()`.

If you forget to call `commandComplete()` in an `AsyncCommand`, the pipeline will pause indefinitely at that step.

---

### Example 1 — A Minimal AsyncCommand using a Timer

```ts
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";

export class DelayCommand extends AsyncCommand {
  public execute(note: INotification): void {
    const ms = (note.body as { delayMs: number }).delayMs;

    setTimeout(() => {
      // Do something after the delay, then signal completion
      this.commandComplete();
    }, ms);
  }
}
```

---

### Example 2 — AsyncCommand with async/await

Use `try/finally` to ensure `commandComplete()` is always called.

```ts
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";

export class FetchUserCommand extends AsyncCommand {
  public async execute(note: INotification): Promise<void> {
    try {
      const { userId } = note.body as { userId: string };
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const user = await res.json();

      // Optionally send another notification with the result
      this.sendNotification("USER_FETCHED", { user });
    } catch (err) {
      this.sendNotification("USER_FETCH_FAILED", { error: String(err) });
    } finally {
      this.commandComplete();
    }
  }
}
```

---

### Example 3 — Composing an AsyncMacroCommand

Create a macro that runs several steps in order. Sub‑commands can be `SimpleCommand`, `AsyncCommand`, or even another `AsyncMacroCommand`.

```ts
import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { SimpleCommand, INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { DelayCommand } from "./DelayCommand.js";
import { FetchUserCommand } from "./FetchUserCommand.js";

class LogStartCommand extends SimpleCommand {
  public execute(note: INotification): void {
    console.log("Pipeline starting", note.body);
  }
}

class LogDoneCommand extends SimpleCommand {
  public execute(): void {
    console.log("Pipeline complete");
  }
}

export class LoadUserPipeline extends AsyncMacroCommand {
  protected initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new LogStartCommand());
    this.addSubCommand(() => new DelayCommand());
    this.addSubCommand(() => new FetchUserCommand());
    this.addSubCommand(() => new LogDoneCommand());
  }
}
```

When the macro executes, it will:
1) log start, 2) delay, 3) fetch the user, 4) log done — each in order, waiting where needed.

---

### Example 4 — Nested AsyncMacros and Mixed Sync/Async

```ts
import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { SimpleCommand } from "@puremvc/puremvc-typescript-multicore-framework";

class InitSyncCommand extends SimpleCommand { /* ... */ }
class LoadAssetsMacro extends AsyncMacroCommand { /* addSubCommand(() => new AsyncStep()) ... */ }
class WarmupServicesMacro extends AsyncMacroCommand { /* ... */ }

export class AppStartupMacro extends AsyncMacroCommand {
  protected initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new InitSyncCommand());
    this.addSubCommand(() => new LoadAssetsMacro());
    this.addSubCommand(() => new WarmupServicesMacro());
  }
}
```

`AppStartupMacro` will wait for each nested macro to complete before moving on.

---

### Integrating with PureMVC’s Controller/Facade

Map a notification to your macro (or command), then send the notification to trigger it.

```ts
import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { LoadUserPipeline } from "./LoadUserPipeline.js";

export const NOTE_LOAD_USER = "NOTE_LOAD_USER" as const;

export class AppFacade extends Facade {
  public static getInstance(key: string): AppFacade {
    if (!this.instanceMap[key]) this.instanceMap[key] = new AppFacade(key);
    return this.instanceMap[key] as AppFacade;
  }

  protected initializeController(): void {
    super.initializeController();
    this.controller.registerCommand(NOTE_LOAD_USER, LoadUserPipeline);
  }
}

// Somewhere in your view/mediator/proxy:
const facade = AppFacade.getInstance("CoreA");
facade.sendNotification(NOTE_LOAD_USER, { userId: "123", delayMs: 250 });
```

Notes:
- The same `INotification` (name, body, type) is passed to each sub‑command in the macro.
- A sub‑command may send additional notifications as needed, but the pipeline sequencing is independent of those notifications.

---

### Passing Data Between Steps

All sub‑commands receive the original notification. Include whatever state they need in the notification body:

```ts
facade.sendNotification("START_PIPELINE", {
  userId: "123",
  options: { warm: true },
});
```

If you must build state progressively, you can 
1. Have a sub‑command send a new notification with aggregated data
2. Write to a Proxy and read from it in later steps
3. Add properties to the object passed in the `body` of the original note.

---

### Error Handling Patterns

- Handle errors inside the sub‑command; send an error notification if appropriate.
- Always call `commandComplete()` in `AsyncCommand` even on error (use `finally`).
- For macros, consider terminal error policies: either continue to next step, or have a step send a specific notification that leads to aborting the flow (e.g., by not scheduling additional work).

---

### Example 5 — Multiple async operations in a single command

```ts
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";

export class LoadUserAndPostsCommand extends AsyncCommand {
  public async execute(note: INotification): Promise<void> {
    try {
      const { userId } = note.body as { userId: string };
      const [userRes, postsRes] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch(`/api/users/${userId}/posts`),
      ]);
      const [user, posts] = await Promise.all([userRes.json(), postsRes.json()]);
      this.sendNotification("USER_AND_POSTS_LOADED", { user, posts });
    } finally {
      this.commandComplete();
    }
  }
}
```

---

### Example 6 — Testing an AsyncMacroCommand with Jest

```ts
import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { LoadUserPipeline } from "../src/LoadUserPipeline.js";

const NOTE = "TEST_LOAD_USER";

class TestFacade extends Facade {
  protected initializeController(): void {
    super.initializeController();
    this.controller.registerCommand(NOTE, LoadUserPipeline);
  }
}

test("pipeline completes and emits USER_FETCHED", async () => {
  const facade = TestFacade.getInstance("TestCore");

  const events: string[] = [];
  facade.registerMediator({
    getMediatorName: () => "SpyMediator",
    listNotificationInterests: () => ["USER_FETCHED"],
    handleNotification: n => events.push(n.getName()),
    onRegister: () => {},
    onRemove: () => {},
  } as any);

  facade.sendNotification(NOTE, { userId: "1", delayMs: 0 });

  // Wait for async queue to flush — in real tests, prefer explicit promises
  await new Promise(r => setTimeout(r, 50));

  expect(events).toContain("USER_FETCHED");
});
```

Tips:
- Prefer exposing deterministic hooks (e.g., a Proxy state) and awaiting on explicit signals in tests.
- If you test a single `AsyncCommand`, you can instantiate it directly and call `setOnComplete` with a test callback before calling `execute`.

---

### Common Pitfalls

- Forgetting to call `commandComplete()` in an `AsyncCommand` → pipeline stalls.
- Throwing from `execute` without catching → still call `commandComplete()` in `finally`.
- Accidentally overriding `AsyncMacroCommand.execute` in your subclass → don’t; override `initializeAsyncMacroCommand()` and add sub‑commands there.
- Using relative imports without `.js` suffix in ESM builds → add the `.js` suffix for local files.

---

### API Summary (from this utility)

```ts
// Signatures (ambient declarations for reference)

// IAsyncCommand
declare interface IAsyncCommand extends ICommand {
  setOnComplete(value: () => void): void;
}

// AsyncCommand
declare class AsyncCommand extends SimpleCommand implements IAsyncCommand {
  public setOnComplete(value: () => void): void;
  protected commandComplete(): void; // call when your async work is done
}

// AsyncMacroCommand
declare class AsyncMacroCommand implements IAsyncCommand {
  protected initializeAsyncMacroCommand(): void; // override to add sub-commands
  protected addSubCommand(factory: () => ICommand): void; // FIFO
  public setOnComplete(value: () => void): void;
  public execute(note: INotification): void; // starts the pipeline
}
```

---

### FAQ

Q: Can a sub‑command send notifications while the macro is running?
A: Yes. Notifications are independent of sequencing. The macro only advances when an async sub‑command signals completion or when a sync sub‑command returns from `execute`.

Q: Can I pass different data to each sub‑command?
A: All sub‑commands receive the same `INotification`. If you need evolving state, use a Proxy or send additional notifications.

Q: Can I short‑circuit the pipeline?
A: The macro runs through its queue. A sub‑command may choose to send a notification that results in different application flow (e.g., not scheduling the next macro), but there’s no built‑in “cancel remaining steps” API. You can model cancellation by designing a sub‑command that clears or ignores follow‑up work.

---

### Conclusion

Use `AsyncCommand` for steps that complete later, and `AsyncMacroCommand` to compose them into deterministic pipelines. This utility keeps command‑to‑command coupling low, while preserving the PureMVC notification model and Controller mappings.

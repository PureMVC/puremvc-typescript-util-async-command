//
//  AsyncCommand.spec.ts
//  PureMVC TypeScript Multicore Async Command Utility
//
//  Copyright(c) 2024 Cliff Hall <cliff.hall@puremvc.org>
//  Your reuse is governed by the BSD-3-Clause License
//

import { Notification }  from '@puremvc/puremvc-typescript-multicore-framework'
import { AsyncCommandTestVO } from "./AsyncCommandTestVO";
import { AsyncCommandTestCommand } from "./AsyncCommandTestCommand";

/**
 * Test the PureMVC SimpleCommand class.
 *
 * @see AsyncCommandTestVO
 * @see AsyncCommandTestCommand
 */
describe("AsyncCommandTest", () => {

    /**
     * Tests the `execute` method of an `AsyncCommand`.
     *
     * This test creates a new `Notification`, adding a
     * `AsyncCommandTestVO` as the body.
     * It then creates a `AsyncCommandTestCommand` and invokes
     * its `execute` method, passing in the note.
     *
     * Success is determined by evaluating a property on the
     * object that was passed on the Notification body, which will
     * be modified by the AsyncCommand.
     */
    test("testAsyncCommandExecute", () => {
        // Create the VO
        const vo = new AsyncCommandTestVO(5);

        // Create the Notification (note)
        const notification = new Notification("AsyncCommandTestNote", vo);

        // Create the AsyncCommand
        const command = new AsyncCommandTestCommand();

        // Execute the AsyncCommand
        command.execute(notification);

        // test assertions
        expect(vo.result).toBe(10);

    });

});

//
//  AsyncMacroCommand.spec.ts
//  PureMVC TypeScript Multicore
//
//  Copyright(c) 2024 Cliff Hall <cliff@puremvc.org>
//  Your reuse is governed by the BSD-3-Clause License
//

import {INotification, Notification} from '@puremvc/puremvc-typescript-multicore-framework'
import { AsyncMacroCommand, AsyncCommand } from '../src';
import { AsyncCommandTestVO } from "./AsyncCommandTestVO";

/**
 * Test the PureMVC AsyncMacroCommand class.
 *
 * @see AsyncMacroCommand
 */
describe("AsyncMacroCommandTest", () => {

    test("testExecuteWithSubCommands", done => {
        class TestAsyncCommand1 extends AsyncCommand {
            override execute(note: INotification) {
                setTimeout(() => {
                    const vo:AsyncCommandTestVO = note.body;
                    vo.result = vo.input * 2;
                    this.commandComplete();
                }, 1000);
            }
        }

        class TestAsyncCommand2 extends AsyncCommand {
            override execute(note: INotification) {
                setTimeout(() => {
                    const vo:AsyncCommandTestVO = note.body;
                    vo.result = (vo.result as number) * 2;
                    this.commandComplete();
                }, 1000);
            }
        }

        class TestAsyncMacroCommand extends AsyncMacroCommand {
            protected override initializeAsyncMacroCommand(): void {
                this.addSubCommand(() => new TestAsyncCommand1());
                this.addSubCommand(() => new TestAsyncCommand2());
            }
        }

        const vo = new AsyncCommandTestVO(5);
        const asyncMacroCommand = new TestAsyncMacroCommand()
        const notification = new Notification("TestNotification", vo)
        asyncMacroCommand.execute(notification)
        setTimeout(() => {
            expect(vo.input).toEqual(5)
            expect(vo.result).toEqual(20)
            done()
        }, 3000);

    });

});

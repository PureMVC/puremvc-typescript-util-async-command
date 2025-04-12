//
//  AsyncMacroCommandTestSub2Command.spec.ts
//  PureMVC TypeScript Multicore
//
//  Copyright(c) 2024 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD-3-Clause License
//

import { INotification }  from '@puremvc/puremvc-typescript-multicore-framework'
import { AsyncMacroCommandTestVO } from './AsyncMacroCommandTestVO';
import { AsyncCommand } from '../src';


/**
 * A SimpleCommand subclass used by AsyncMacroCommandTestCommand.
 *
 * @see MacroCommandTest
 * @see AsyncMacroCommandTestCommand
 * @see AsyncMacroCommandTestVO
 *
 * @class AsyncMacroCommandTestSub2Command
 * @extends AsyncCommand
 */
export class AsyncMacroCommandTestSub2Command extends AsyncCommand {

    /**
     * Fabricate a result by multiplying the input by itself
     *
     * @param {Notification} notification event the `IEvent` carrying the `AsyncMacroCommandTestVO`
     */
    public override execute(notification: INotification) {
        const vo: AsyncMacroCommandTestVO = notification.body as AsyncMacroCommandTestVO;

        // Fabricate a result
        vo.result2 = vo.input * vo.input;
    }

}

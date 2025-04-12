//
//  AsyncCommandTestCommand.spec.ts
//  PureMVC TypeScript Multicore
//
//  Copyright(c) 2024 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD-3-Clause License
//

import { INotification }  from '@puremvc/puremvc-typescript-multicore-framework'
import { AsyncCommandTestVO } from "./AsyncCommandTestVO";
import { AsyncCommand } from "../src";

/**
 * A SimpleCommand subclass used by AsyncCommandTest.
 *
 * @class AsyncCommandTestCommand
 * @extends AsyncCommand
 */
export class AsyncCommandTestCommand extends AsyncCommand {

    /**
     * Fabricate a result by multiplying the input by 2
     *
     * @param {Notification} notification event the `INotification` carrying the `AsyncCommandTestVO`
     */
    execute(notification: INotification): void {
        const vo: AsyncCommandTestVO = notification.body as AsyncCommandTestVO;

        // Fabricate a result
        vo.result = vo.input * 2;
    }

}

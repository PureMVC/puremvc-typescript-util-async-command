//
//  AsyncMacroCommandTestCommand.spec.ts
//  PureMVC TypeScript Multicore
//
//  Copyright(c) 2024 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD-3-Clause License
//

import { AsyncMacroCommand } from '../src';
import { AsyncMacroCommandTestSub1Command } from "./AsyncMacroCommandTestSub1Command";
import { AsyncMacroCommandTestSub2Command } from "./AsyncMacroCommandTestSub2Command";

/**
 * A MacroCommand subclass used by MacroCommandTest.
 *
 * @see MacroCommandTest
 * @see AsyncMacroCommandTestSub1Command
 * @see AsyncMacroCommandTestSub2Command
 * @see MacroCommandTestVO
 *
 * @class AsyncMacroCommandTestCommand
 * @extends AsyncMacroCommand
 */
export class AsyncMacroCommandTestCommand extends AsyncMacroCommand {

    /**
     * Initialize the AsyncMacroCommandTestCommand by adding
     * its 2 SubCommands.
     */
    public override initializeAsyncMacroCommand() {
        this.addSubCommand(() => new AsyncMacroCommandTestSub1Command());
        this.addSubCommand(() => new AsyncMacroCommandTestSub2Command());
    }

}

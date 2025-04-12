//
//  AsyncMacroCommandTestVO.spec.ts
//  PureMVC TypeScript Multicore
//
//  Copyright(c) 2024 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD-3-Clause License
//

/**
 * A utility class used by MacroCommandTest.
 *
 * @see MacroCommandTest
 * @see MacroCommandTestCommand
 * @see MacroCommandTestSub1Command
 * @see MacroCommandTestSub2Command
 *
 * @class AsyncMacroCommandTestVO
 */
export class AsyncMacroCommandTestVO {

    public input: number;
    public result1: number = 0;
    public result2: number = 0;

    /**
     * Constructor.
     *
     * @param {number} input the number to be fed to the AsyncMacroCommandTestCommand
     */
    constructor(input: number) {
        this.input = input;
    }

}

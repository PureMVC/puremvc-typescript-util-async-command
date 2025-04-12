//
//  AsyncCommandTestVO.spec.ts
//  PureMVC TypeScript Multicore
//
//  Copyright(c) 2024 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD-3-Clause License
//

/**
 * A utility class used by SimpleCommandTest.
 *
 * @see SimpleCommandTest
 * @see SimpleCommandTestCommand
 *
 * @class AsyncCommandTestVO
 */
export class AsyncCommandTestVO {

    public input: number;
    public result: number;

    /**
     * Constructor.
     *
     * @param {number} input the number to be fed to the AsyncCommandTestCommand
     */
    public constructor(input: number) {
        this.input = input;
        this.result = 0;
    }

}

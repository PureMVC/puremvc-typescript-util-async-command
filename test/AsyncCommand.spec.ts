import { INotification, Notification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "../src";
class AsyncCommandTestVO {

    public input: number;
    public result: number;
    constructor(input: number) {
        this.input = input;
        this.result = 0;
    }

}
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

        class AsyncCommandTestCommand extends AsyncCommand {

            execute(notification: INotification): void {
                const vo: AsyncCommandTestVO = notification.body as AsyncCommandTestVO;
                vo.result = vo.input * vo.input;
            }

        }

        // Create the VO
        const vo = new AsyncCommandTestVO(5);

        // Create the Notification (note)
        const notification = new Notification("AsyncCommandTestNote", vo);

        // Create the AsyncCommand
        const command = new AsyncCommandTestCommand();

        // Execute the AsyncCommand
        command.execute(notification);

        // test assertions
        expect(vo.result).toBe(25);

    });

});

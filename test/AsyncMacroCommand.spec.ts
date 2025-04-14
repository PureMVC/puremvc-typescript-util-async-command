import { INotification, Notification } from '@puremvc/puremvc-typescript-multicore-framework'
import { AsyncMacroCommand, AsyncCommand } from '../src';
class AsyncCommandTestVO {

    public input: number;
    public result: number;
    constructor(input: number) {
        this.input = input;
        this.result = 0;
    }

}
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

    test("testSetOnComplete", done => {
        class TestAsyncCommand1 extends AsyncCommand {
            override execute(note: INotification) {
                setTimeout(() => {
                    const vo:AsyncCommandTestVO = note.body;
                    vo.result = vo.input * vo.input;
                    this.commandComplete();
                }, 1000);
            }
        }

        class TestAsyncCommand2 extends AsyncCommand {
            override execute(note: INotification) {
                setTimeout(() => {
                    const vo:AsyncCommandTestVO = note.body;
                    vo.result = vo.result * vo.input;
                    this.commandComplete();
                }, 1000);
            }
        }

        class TestAsyncMacroCommand extends AsyncMacroCommand {
            protected override initializeAsyncMacroCommand(): void {
                this.addSubCommand(() => new TestAsyncCommand1());
                this.addSubCommand(() => new TestAsyncCommand2());
            }
            execute(notification: INotification) {
                this.setOnComplete(() => {
                    const vo = notification.body as AsyncCommandTestVO;
                    vo.result = vo.result * vo.input
                })
                super.execute(notification);
            }
        }

        const vo = new AsyncCommandTestVO(5);
        const asyncMacroCommand = new TestAsyncMacroCommand()
        const notification = new Notification("TestNotification", vo)
        asyncMacroCommand.execute(notification)
        setTimeout(() => {
            expect(vo.input).toEqual(5)
            expect(vo.result).toEqual(625)
            done()
        }, 3000);

    });

});

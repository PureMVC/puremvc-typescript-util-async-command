import { IAsyncCommand } from "../interfaces/IAsyncCommand";
import { SimpleCommand } from "@puremvc/puremvc-typescript-multicore-framework";
/**
 * A base <code>IAsyncCommand</code> implementation.
 *
 * <P>
 * Your subclass should override the <code>execute</code>
 * method where your business logic will handle the <code>INotification</code>. </P>
 *
 * @see AsyncMacroCommand
 */
export declare class AsyncCommand extends SimpleCommand implements IAsyncCommand {
    /**
     * Registers the callback for a parent <code>AsyncMacroCommand</code>.
     *
     * @param value	The <code>AsyncMacroCommand</code> method to call on completion
     */
    setOnComplete(value: () => void): void;
    /**
     * Notify the parent <code>AsyncMacroCommand</code> that this command is complete.
     * <P>
     * Call this method from your subclass to signify that your asynchronous command
     * has finished.</P>
     */
    protected commandComplete(): void;
    private onComplete;
}

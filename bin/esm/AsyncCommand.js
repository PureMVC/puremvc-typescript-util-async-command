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
export class AsyncCommand extends SimpleCommand {
    constructor() {
        super(...arguments);
        this.onComplete = null;
    }
    /**
     * Registers the callback for a parent <code>AsyncMacroCommand</code>.
     *
     * @param value	The <code>AsyncMacroCommand</code> method to call on completion
     */
    setOnComplete(value) {
        this.onComplete = value;
    }
    /**
     * Notify the parent <code>AsyncMacroCommand</code> that this command is complete.
     * <P>
     * Call this method from your subclass to signify that your asynchronous command
     * has finished.</P>
     */
    commandComplete() {
        if (this.onComplete)
            this.onComplete();
    }
}

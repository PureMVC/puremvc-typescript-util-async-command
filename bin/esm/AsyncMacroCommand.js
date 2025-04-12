import { AsyncCommand } from "./AsyncCommand";
import { Notifier, } from "@puremvc/puremvc-typescript-multicore-framework";
/**
 * A base <code>ICommand</code> implementation that executes other
 * <code>ICommand</code>s asynchronously.
 *
 * <P>
 * An <code>AsyncMacroCommand</code> maintains a list of
 * <code>ICommand</code> Class references called <i>SubCommands</i>.</P>
 *
 * <P>
 * When <code>execute</code> is called, the <code>AsyncMacroCommand</code>
 * caches a reference to the <code>INotification</code> and calls
 * <code>nextCommand</code>.</P>
 *
 * <P>
 * If there are still <i>SubCommands</i>'s to be executed,
 * the <code>nextCommand</code> method instantiates and calls <code>execute</code>
 * on each of its <i>SubCommands</i> in turn. Each <i>SubCommand</i> will be passed
 * a reference to the original <code>INotification</code> that was passed to the
 * <code>AsyncMacroCommand</code>'s <code>execute</code> method. If the
 * <i>SubCommand</i> to execute is an <code>IAsyncCommand</code>, the
 * next <i>SubCommand</i> will not be executed until the previous
 * <code>IAsyncCommand</code> has called its <i>commandComplete</i> method.</P>
 *
 * <P>
 * Unlike <code>AsyncCommand</code> and <code>SimpleCommand</code>, your subclass
 * should not override <code>execute</code>, but instead, should
 * override the <code>initializeAsyncMacroCommand</code> method,
 * calling <code>addSubCommand</code> once for each <i>SubCommand</i>
 * to be executed.</P>
 *
 * @see AsyncCommand
 */
export class AsyncMacroCommand extends Notifier {
    /**
     * Constructor.
     *
     * <P>
     * You should not need to define a constructor,
     * instead, override the <code>initializeAsyncMacroCommand</code>
     * method.</P>
     *
     * <P>
     * If your subclass does define a constructor, be
     * sure to call <code>super()</code>.</P>
     */
    constructor() {
        super();
        this.note = null;
        this.onComplete = null;
        this.subCommands = new Array();
        this.note = null;
        this.onComplete = null;
        this.initializeAsyncMacroCommand();
    }
    /**
     * Initialize the <code>AsyncMacroCommand</code>.
     *
     * <P>
     * In your subclass, override this method to
     * initialize the <code>AsyncMacroCommand</code>'s <i>SubCommand</i>
     * list with <code>ICommand</code> class references.
     * </P>
     *
     * <listing>
     *		// Initialize MyMacroCommand
     *		override protected function initializeAsyncMacroCommand() : void
     *		{
     *			addSubCommand( () => new FirstCommand() );
     *			addSubCommand( () => SecondCommand() );
     *			addSubCommand( () => ThirdCommand() );
     *		}
     * </listing>
     *
     * <P>
     * Note that <i>SubCommand</i>s may be any <code>ICommand</code> implementor,
     * <code>AsyncMacroCommand</code>s, <code>AsyncCommand</code>s,
     * <code>MacroCommand</code>s or <code>SimpleCommands</code> are all acceptable.
     */
    initializeAsyncMacroCommand() { }
    /**
     * Add a <i>SubCommand</i>.
     * <P>
     * The <i>SubCommands</i> will be called in First In/First Out (FIFO)
     * order.</P>
     *
     * @param factory a factory that returns an instance that implements <code>ICommand</code>.
     */
    addSubCommand(factory) {
        this.subCommands.push(factory);
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
     * Starts execution of this <code>AsyncMacroCommand</code>'s <i>SubCommands</i>.
     *
     * <P>
     * The <i>SubCommands</i> will be called in First In/First Out (FIFO) order.
     * </P>
     *
     * @param notification the <code>INotification</code> object to be passsed to each <i>SubCommand</i>.
     */
    execute(notification) {
        this.note = notification;
        this.nextCommand();
    }
    /**
     * Execute this <code>AsyncMacroCommand</code>'s next <i>SubCommand</i>.
     *
     * <P>
     * If the next <i>SubCommand</i> is asynchronous, a callback is registered for
     * the command completion, else the next command is run.</P>
     */
    nextCommand() {
        if (this.subCommands.length > 0) {
            const factory = this.subCommands.shift();
            const commandInstance = factory();
            const isAsync = commandInstance instanceof AsyncMacroCommand ||
                commandInstance instanceof AsyncCommand;
            if (isAsync) {
                commandInstance.setOnComplete(this.nextCommand);
            }
            commandInstance.initializeNotifier(this.multitonKey);
            if (this.note)
                commandInstance.execute(this.note);
            if (!isAsync)
                this.nextCommand();
        }
        else {
            if (this.onComplete !== null)
                this.onComplete();
            this.note = null;
            this.onComplete = null;
        }
    }
}

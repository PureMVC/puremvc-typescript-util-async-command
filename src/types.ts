import { ICommand } from "@puremvc/puremvc-typescript-multicore-framework";

/**
 * Interface for an Asynchronous Command.
 */
export interface IAsyncCommand extends ICommand {
  /**
   * Registers the callback for a parent <code>AsyncMacroCommand</code>.
   *
   * @param value	The <code>AsyncMacroCommand</code> method to call on completion
   */
  setOnComplete(value: () => void): void;
}

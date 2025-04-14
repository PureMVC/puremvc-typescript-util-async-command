## [PureMVC](http://puremvc.github.com/) [Typescript](https://github.com/PureMVC/puremvc-typescript-multicore-framework/wiki) Utility: Async Command
The Async Command utility offers a solution to the problem of executing a series of commands each of which may need to complete one or more asynchronous operations before the next command is executed.

The problem can be handled without this utility, by having a `SimpleCommand` send a notification when a promise resolves, thereby triggering the next command.

But that leads to a tight coupling of one command to the next, if the first must know the notification to send in order to trigger the second.

With the `AsyncCommand` and `AsyncMacroCommand` you could dynamically create a pipeline of commands to be executed sequentially, each of which may have multiple async tasks to complete. None need know anything about the others.

## Status
Production - [Version 1.0.0](https://github.com/PureMVC/puremvc-typescript-util-async-command/blob/master/VERSION)

## Platforms / Technologies
* [Typescript](http://en.wikipedia.org/wiki/Typescript)
* [NPM Package](https://www.npmjs.com/package/@puremvc/puremvc-js-util-async-command)

## Ported Utility
* This is a direct port of the original [AS3 AsyncCommand utility](https://github.com/PureMVC/puremvc-as3-util-asynccommand)
* [Historical Discussion](http://forums.puremvc.org/index.php?topic=831.0)


## License
* PureMVC Utility for Typescript - AsyncCommand - Ported by Cliff Hall
* From PureMVC Utility for AS3 - AsyncCommand - Copyright © 2008 Duncan Hall (no relation)
* PureMVC - Copyright © 2007-2025 Futurescale, Inc.
* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
  * Neither the name of Futurescale, Inc., PureMVC.org, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

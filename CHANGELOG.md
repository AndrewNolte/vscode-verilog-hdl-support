# Changelog

## Unreleased
- Fix bug with lint results not showing correctly for multi-level directories when using verilator as linter.

## [24.11.0] - 2024-11-05
- Prevent file base names from being recognized as a hierarchical path.
- Improved completions:
  - improved context for completions- type info is on every entry now
  - improved filtering of completions
  - port/param completions show both now, as extension isn't able to get full edit buffer
- Remove included surfer, https://marketplace.visualstudio.com/items?itemName=surfer-project.surfer supports FST now and is more up to date

## [24.10.1] - 2024-10-24
- Add Terminal Links for hierarchical paths. Clicking on one does a best effort of following the path, meaning if it can't find one symbol in the path, it'll stop at the latest one. It'll open that symbol in the editor, hierachical view, and instances view.
- Add timeout to formatter
- typing 'module' in comments no longer autocloses (https://github.com/AndrewNolte/vscode-system-verilog/issues/12)
- remove instantiate module command- this is redundant because of the completion support

## [24.10.0] - 2024-10-02
- Switch to calendar versioning scheme (Y/M/PATCH)
- Project View
  - Hierarchy view- rename, and add toggles for viewing elaboration params as well as one for ports/regs
  - Instances View! View all instances in a project, by module. Note: this and the Hierarchy are CSTs, not an elaborated tree. Each generate scope will generate exactly one instance, not 0 or N in the case of generate loops.
  - `verilog.setInstanceByPath(_, str)`, among other commands. This allows for other extensions, namely waveform viewers, to open a path in the editor
- .sv_cache/files was moved to per-workspace storage via a vscode api. This means the extension will no longer make random caches when opening other workspaces
- Formatting backend change
  - formatDirs no longer registers a hook for on save- it instead registers a different pattern for the provider
  - Pros: avoids a glitch in some rare cases where the save loop would not resolve (triggering another edit/save)
  - Cons: You can't run "format document" on an random file- it has to be in formatDirs that config was provided

## [0.9.17] - 2024-08-26
- Slang lint
  - parse instance paths
  - improve ranges to include up to first ~ underline rather than ^
- Package completions: skip hover docs on large symbols. These would sometimes timeout and default to completions from the current file
- Inlay hints: skip empty portlists for wildcards
- GotoDefs: fix hover timeout issue
- Formatting: Use stdout instead of tempfile for verible formatter, avoiding tempfile issues that would sometimes come up

## [0.9.16] - 2024-08-12
- New feature: inlay hints for wildcard ports (.*) and general ports
- New linter: Xcelium
  - It's recommended to only enable this at the project level
  - Xcelium terminal link provider, since Xcelium's error msgs have a very odd line/col scheme
- New syntax higlighting- check in syntax now used by upstream and https://marketplace.visualstudio.com/items?itemName=eirikpre.systemverilog
  - fix some categorizations- builtins, preproc directives, macro calls
  - fix some regexes- implicit bindings, multiple module insts in one declaration
- Fixes:
  - improved accuracy on triggering package completions
  - fix infinite loop with macros that would sometimes prevent file symbol building

## [0.9.15] - 2024-06-24
- fix icarus parsing on windows
- absolute path globs- enables adding files outside the repo like pyuvm

## [0.9.14] - 2024-06-02
- formatting off by default, formatter must be specified
- file icons, with colors matching .cpp/.h colors
- expand-macros command + script config
- verilator lint resolves packages correctly now with zero-config
- don't show non-instance-holding scopes as a collapsed tree in project view (nit)
- projectEnabled for lint tools- only run lint tool if top is selected
- lint resolved symlinks if tool doesn't already do so

## [0.9.13] - 2024-05-28
- Fix bug where the tool paths weren't being found

## [0.9.12] - 2024-05-27
- Publish on OpenVSX
- minor project UI tweaks
- Remove path defaults in json schema, show them in CONFIG.md instead
- fix repeat files in project view

## [0.9.11] - 2024-05-20
- Remove HDL support, rename title, refine focus on systemverilog/verilog
- Fix icarus lint parser
- Fix windows and wsl code, removes need for "useWSL" config
- Fix project-level file paths for verilator lint
- Fix initial include file indexing, needed some retries

## [0.9.10] - 2024-05-14
- side panel to select top level
- lint whole project using top level context
- FST, VCD, GHW support from surfer (Pull request for FST support on theirs was not getting merged, so I merged it here)
- fix bug with no lint args being configured
- warn on incompatible extensions
- warn on formatDirs not being used
- warn on invalid linter path

## [0.9.9] - 2024-05-01
- Fix builtins
- Add space in args for macro autocomplete

## [0.9.8] - 2024-04-29
- Rewrite document symbol provider
  - Leverage parent pointers from ctags
  - Provide better icons, particularly for instances
- Revamp Code completions
  - Module inst triggers on #, in order to support the completion adding the semicolon at the end
  - Module completion parameter values now default to the default values
  - Hover/Completions for Builtins
  - Macro Completions
  - Package:: completions
  - filtered symbol completions on '[' ad ':'
  - Parameter/Port completions on '.' when in a Module Inst
  - Hierarchical reference completions (interface.x)

## [0.9.7] - 2024-04-28

- verlog on verible-ls (upstream fix)
- clear diagnostics on config change
- improved logging
- fix interface array ref hover/definition
- Improve Verilator package resolution
  - Verilator requires packages be specified beforehand, so this will iterate the verilator lint step, prepending packages that it complains about. More work should be done on this to produce a topo sort of the packages
- use execFile for ctags (no shell)
- Add index component
  - symlink index (.sv_cache/files)
  - in-memory file index, makes everything much much snappier

## [0.9.6] - 2024-04-19

- fix large hover size on some types
- fix unwanted nested hovers
- fix unneeded file linting on startup
- Lint messages follow width from Slang and Verilator
  - If lint width is small, it will underline the word at that position
- Support deeper package refs
- Format on save support
- Fix indenting of some hovers
- Large code refactors
  - Type safe config management library

## [0.9.5] - 2024-04-12
- Fix linting issue from 9.4

## [0.9.4] - 2024-04-11 - Initial Release
- remove BSV code
- module and interface autocomplete
- index include paths, macros
- nested hover (hover will search first hover for additional variables)
- code clean up
  - strict typing
  - better formatting presets
  - convert everything to async/await
  - linter refactor, consolodate repeated code

## Fork point

For previous work, refer to https://github.com/mshr-h/vscode-verilog-hdl-support/blob/main/CHANGELOG.md
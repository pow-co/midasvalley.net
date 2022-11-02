oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g midas-cli
$ midas-cli COMMAND
running command...
$ midas-cli (--version)
midas-cli/0.0.0 darwin-x64 node-v16.13.1
$ midas-cli --help [COMMAND]
USAGE
  $ midas-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`midas-cli domains list`](#midas-cli-domains-list)
* [`midas-cli domains watch`](#midas-cli-domains-watch)
* [`midas-cli hello PERSON`](#midas-cli-hello-person)
* [`midas-cli hello world`](#midas-cli-hello-world)
* [`midas-cli help [COMMAND]`](#midas-cli-help-command)
* [`midas-cli plugins`](#midas-cli-plugins)
* [`midas-cli plugins:install PLUGIN...`](#midas-cli-pluginsinstall-plugin)
* [`midas-cli plugins:inspect PLUGIN...`](#midas-cli-pluginsinspect-plugin)
* [`midas-cli plugins:install PLUGIN...`](#midas-cli-pluginsinstall-plugin-1)
* [`midas-cli plugins:link PLUGIN`](#midas-cli-pluginslink-plugin)
* [`midas-cli plugins:uninstall PLUGIN...`](#midas-cli-pluginsuninstall-plugin)
* [`midas-cli plugins:uninstall PLUGIN...`](#midas-cli-pluginsuninstall-plugin-1)
* [`midas-cli plugins:uninstall PLUGIN...`](#midas-cli-pluginsuninstall-plugin-2)
* [`midas-cli plugins update`](#midas-cli-plugins-update)

## `midas-cli domains list`

List Domains In MidasValley.Net Watch List

```
USAGE
  $ midas-cli domains list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List Domains In MidasValley.Net Watch List

EXAMPLES
  $ midas-cli domains list
```

## `midas-cli domains watch`

Add Domain To The MidasValley Watch List

```
USAGE
  $ midas-cli domains watch -d <value> [--json]

FLAGS
  -d, --domain=<value>  (required)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add Domain To The MidasValley Watch List

EXAMPLES
  $ midas-cli domains watch
```

## `midas-cli hello PERSON`

Say hello

```
USAGE
  $ midas-cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/midasvalley.net/midasvalley.net/blob/v0.0.0/dist/commands/hello/index.ts)_

## `midas-cli hello world`

Say hello world

```
USAGE
  $ midas-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ midas-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

## `midas-cli help [COMMAND]`

Display help for midas-cli.

```
USAGE
  $ midas-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for midas-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.16/src/commands/help.ts)_

## `midas-cli plugins`

List installed plugins.

```
USAGE
  $ midas-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ midas-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.4/src/commands/plugins/index.ts)_

## `midas-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ midas-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ midas-cli plugins add

EXAMPLES
  $ midas-cli plugins:install myplugin 

  $ midas-cli plugins:install https://github.com/someuser/someplugin

  $ midas-cli plugins:install someuser/someplugin
```

## `midas-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ midas-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ midas-cli plugins:inspect myplugin
```

## `midas-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ midas-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ midas-cli plugins add

EXAMPLES
  $ midas-cli plugins:install myplugin 

  $ midas-cli plugins:install https://github.com/someuser/someplugin

  $ midas-cli plugins:install someuser/someplugin
```

## `midas-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ midas-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ midas-cli plugins:link myplugin
```

## `midas-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ midas-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ midas-cli plugins unlink
  $ midas-cli plugins remove
```

## `midas-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ midas-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ midas-cli plugins unlink
  $ midas-cli plugins remove
```

## `midas-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ midas-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ midas-cli plugins unlink
  $ midas-cli plugins remove
```

## `midas-cli plugins update`

Update installed plugins.

```
USAGE
  $ midas-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->

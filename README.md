# SARIF to Slack action

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![Releases](https://img.shields.io/github/v/release/fabasoad/sarif-to-slack-action?include_prereleases)
![unit-tests](https://github.com/fabasoad/sarif-to-slack-action/actions/workflows/unit-tests.yml/badge.svg)
![security](https://github.com/fabasoad/sarif-to-slack-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/sarif-to-slack-action/actions/workflows/linting.yml/badge.svg)
[![codecov](https://codecov.io/gh/fabasoad/sarif-to-slack-action/graph/badge.svg?token=908QOYME6H)](https://codecov.io/gh/fabasoad/sarif-to-slack-action)

This GitHub action sends a notification to Slack based on the provided SARIF file.

## Contents

<!-- TOC -->
* [SARIF to Slack action](#sarif-to-slack-action)
  * [Contents](#contents)
  * [Inputs](#inputs)
  * [Outputs](#outputs)
  * [Sample](#sample)
  * [Contributions](#contributions)
<!-- TOC -->

## Inputs

```yaml
- uses: fabasoad/sarif-to-slack-action@v2
  with:
    # (Required) Target Slack webhook URL.
    slack-webhook: "${{ secrets.SLACK_WEBHOOK }}"
    # (Optional) Slack message username. Defaults to "SARIF results".
    username: "${{ github.repository }}"
    # (Optional) Slack message icon URL. Defaults to the default Slack icon.
    # Defaults to no icon.
    icon-url: "https://cdn-icons-png.flaticon.com/512/9070/9070006.png"
    # (Optional) Default color of the Slack message if specific color was not found.
    # It is a fallback option. Defaults to no color.
    color: "#ff0000"
    # (Optional) Color of the message when there are no findings in the provided
    # SARIF file(s). Defaults to no color.
    color-empty: "#d3d3d3"
    # (Optional) Color of the message when at least one finding has "Critical" severity.
    # Defaults to no color.
    color-severity-critical: "#ff0000"
    # (Optional) Color of the message when at least one finding has "High" severity.
    # Defaults to no color.
    color-severity-high: "#ff4500"
    # (Optional) Color of the message when at least one finding has "Medium" severity.
    # Defaults to no color.
    color-severity-medium: "#ffa500"
    # (Optional) Color of the message when at least one finding has "Low" severity.
    # Defaults to no color.
    color-severity-low: "#ffff00"
    # (Optional) Color of the message when at least one finding has "None" severity.
    # Defaults to no color.
    color-severity-none: "#808080"
    # (Optional) Color of the message when at least one finding has "Unknown" severity.
    # Defaults to no color.
    color-severity-unknown: "#800080"
    # (Optional) Color of the message when at least one finding has "Error" level.
    # Defaults to no color.
    color-level-error: "#ff00ff"
    # (Optional) Color of the message when at least one finding has "Warning" level.
    # Defaults to no color.
    color-level-warning: "#ffcc00"
    # (Optional) Color of the message when at least one finding has "Note" level.
    # Defaults to no color.
    color-level-note: "#00bfff"
    # (Optional) Color of the message when at least one finding has "None" level.
    # Defaults to no color.
    color-level-none: "#808080"
    # (Optional) Color of the message when at least one finding has "Unknown" level.
    # Defaults to no color.
    color-level-unknown: "#800080"
    # (Required) Path to the directory with SARIF files or to the SARIF file itself.
    # Separate Slack messages will be sent for each SARIF file found in the directory.
    sarif-path: "scanning-results.sarif"
    # (Optional) If provided SARIF path is a directory, whether to traverse provided
    # SARIF path recursively or not. Defaults to "false".
    sarif-path-recursive: "true"
    # (Optional) Extension for SARIF files. Possible values: sarif, json. Defaults
    # to "sarif".
    sarif-file-extension: "sarif"
    # (Optional) Log level of output. Possible options are "silly", "trace",
    # "debug", "info", "warning", "error", "fatal". This parameter is ignored if
    # CI pipeline is running in debug mode, e.g. ACTIONS_STEP_DEBUG is set to "true".
    # Defaults to "info".
    log-level: "trace"
    # (Optional) Specifies the custom log message template to format log outputs,
    # using the same template format as the tslog npm library. More details here:
    # https://github.com/fullstack-build/tslog?tab=readme-ov-file#pretty-templates-and-styles-color-settings
    # Defaults to "[{{logLevelName}}] [{{name}}] {{dateIsoStr}} ".
    log-template: "[{{dateIsoStr}}] level={{logLevelName}} "
    # (Optional) Whether logs should be colored or not. Defaults to "true".
    log-colored: "true"
    # (Optional) Slack message header. Defaults to $GITHUB_REPOSITORY.
    header: "Security scanning results"
    # (Optional) Whether to include header in the message. Defaults to "true".
    include-header: "true"
    # (Optional) Slack message footer. Defaults to "Generated by
    # @fabasoad/slack-to-sarif@<version>".
    footer: "This message was sent by GitHub Actions"
    # (Optional) Whether to include footer in the message. Defaults to "true".
    include-footer: "true"
    # (Optional) Who triggered the run. Defaults to $GITHUB_ACTOR.
    actor: "${{ github.actor }}"
    # (Optional) Whether to include actor in the message. Defaults to "true".
    include-actor: "true"
    # (Optional) Whether to include run in the message. Defaults to "true".
    include-run: "true"
    # (Optional) Slack message representation. Possible values: compact-group-by-run-per-level,
    # compact-group-by-run-per-severity, compact-group-by-tool-name-per-level,
    # compact-group-by-tool-name-per-severity, compact-group-by-sarif-per-level,
    # compact-group-by-sarif-per-severity, compact-total-per-level,
    # compact-total-per-severity. Defaults to "compact-group-by-tool-name-per-severity".
    representation: "compact-group-by-tool-name-per-severity"
    # (Optional) Condition on when Slack message should be sent. Possible values:
    # severity-critical, severity-high, severity-high-or-higher, severity-medium,
    # severity-medium-or-higher, severity-low, severity-low-or-higher, severity-none,
    # severity-none-or-higher, severity-unknown, severity-unknown-or-higher,
    # level-error, level-warning, level-warning-or-higher, level-note,
    # level-note-or-higher, level-none, level-none-or-higher, level-unknown,
    # level-unknown-or-higher, always, some, empty, never. Defaults to "always".
    send-if: "always"
```

## Outputs

None.

## Sample

<img alt="Sample" src="sample.png" width="450"/>

## Contributions

![Alt](https://repobeats.axiom.co/api/embed/106ae477572cf133c41ff42d3db94da42772e571.svg "Repobeats analytics image")

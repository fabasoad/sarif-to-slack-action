# SARIF to Slack action

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![Releases](https://img.shields.io/github/v/release/fabasoad/sarif-to-slack-action?include_prereleases)
![unit-tests](https://github.com/fabasoad/sarif-to-slack-action/actions/workflows/unit-tests.yml/badge.svg)
![security](https://github.com/fabasoad/sarif-to-slack-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/sarif-to-slack-action/actions/workflows/linting.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/84bb3beceb9503272bc9/maintainability)](https://codeclimate.com/github/fabasoad/sarif-to-slack-action/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/84bb3beceb9503272bc9/test_coverage)](https://codeclimate.com/github/fabasoad/sarif-to-slack-action/test_coverage)

This GitHub action sends notification to Slack based on SARIF file.

## Contents

<!-- TOC -->
* [SARIF to Slack action](#sarif-to-slack-action)
  * [Contents](#contents)
  * [Inputs](#inputs)
  * [Outputs](#outputs)
  * [Contributions](#contributions)
<!-- TOC -->

## Inputs

```yaml
- uses: fabasoad/sarif-to-slack-action@v0
  with:
    # (Required) Target Slack webhook URL.
    slack-webhook: "${{ secrets.SLACK_WEBHOOK }}"
    # (Required) Path to the SARIF file.
    sarif-path: "scanning-results.sarif"
    # (Optional) What color of the message should be. Defaults to "red".
    color: "yellow"
```

## Outputs

None.

## Contributions

TBD

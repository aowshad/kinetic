# CLAUDE.md

## Verifying animation timing

Before trusting ANY timing measurement in the browser, sanity-check the clock:
run setTimeout(200) and measure actual elapsed time. If it is more than ~1.5x
the requested delay, the environment is throttling and NO timing observation is
valid. Stop, front the tab, or use the manual ticker technique — do not collect
readings and report them as findings.

Never assert on textContent to verify a visual animation. Assert on computed
visual state: opacity, filter, clipPath, transform, visibility.

If a verification approach cannot cover some subset, say so explicitly in the
report. Never silently exclude and never downgrade "untestable here" to "fine".

export function assertOneOf(parameterName: string, value: string, allowedValues: string[]): void {
  if (!allowedValues.includes(value)) {
    throw new Error(
      `Invalid value "${value}" for parameter "${parameterName}". Allowed values are: ${allowedValues.join(', ')}.`
    );
  }
}

export function assertLogLevel(value: string): void {
  assertOneOf('log-level', value, [
    'silly',
    'trace',
    'debug',
    'info',
    'warning',
    'error',
    'fatal',
  ]);
}

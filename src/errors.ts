export class InvalidParameterError extends Error {
  constructor(name: string, reason: string) {
    super(`"${name}" parameter is invalid. ${reason}.`);
  }
}

export class InvalidEnumParameterError extends InvalidParameterError {
  constructor(name: string, possibleValues: string[]) {
    super(name, `Possible values: ${possibleValues.join(', ')}`);
  }
}

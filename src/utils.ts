/**
 * Parses a JSON string into a strongly typed value.
 *
 * This is a thin wrapper around {@link JSON.parse} that allows specifying
 * the expected return type using a generic type parameter.
 *
 * @param text The JSON string to parse.
 * @returns The parsed value typed as `T`.
 * @throws {SyntaxError} If the input string is not valid JSON.
 */
export function parseJSON<T>(text: string): T {
  return JSON.parse(text) as T;
}

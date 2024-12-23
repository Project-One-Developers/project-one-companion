/**
 * Returns the current Unix timestamp in seconds.
 */
export const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

/**
 * Converts an ISO 8601 datetime string to a Unix timestamp in seconds.
 *
 * @param isoDateTime - The ISO 8601 datetime string to convert.
 * @returns The Unix timestamp in seconds.
 */
export const isoToUnixTimestamp = (isoDateTime: string) =>
    Math.floor(new Date(isoDateTime).getTime() / 1000);

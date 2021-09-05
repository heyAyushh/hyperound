// @ts-expect-error dunno lol
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())
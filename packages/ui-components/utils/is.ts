export function isUndefined(obj: any): obj is undefined {
    return obj === undefined;
}

export function isFunction(obj: any): obj is (...args: any[])=>any {
    return typeof obj === 'function'
}

export function isNullOrUndefined(obj: any): boolean {
    return obj === null || obj === undefined;
  }
enum ResourceStatus {
    Pending,
    Fullfilled,
    Rejected
}

export default interface Resource<T> {
    read: () => T
}

export function resource<T>(item: T, delay?: number): Resource<T> {
    const promise = new Promise<T>((resolve, _) =>
        setTimeout(() => resolve(item), delay ?? 0));
    return suspender<T, string>(promise);
};

export function suspender<T, E>(promise: Promise<T>): Resource<T> {
    let status = ResourceStatus.Pending;
    let result: T;
    let error: E;
    const suspender = promise.then((r: T) => {
        status = ResourceStatus.Fullfilled;
        result = r;
    }).catch((e: any) => {
        console.info('suspender received error:', e);
        status = ResourceStatus.Rejected;
        error = e;
    });
    return {
        read: () => {
            console.debug('suspender.read, status:', status,
                          `(Pending: ${ResourceStatus.Pending})`,
                          'result:', result);
            switch (status) {
                case ResourceStatus.Pending:
                    throw suspender;
                case ResourceStatus.Rejected:
                    throw error;
                default:
                    return result;
            }
        }
    };
}

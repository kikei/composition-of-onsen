enum ResourceStatus {
    Pending,
    Fullfilled,
    Rejected
}

export default interface Resource<T> {
    read: () => T
}

export function suspender<T, E>(promise: Promise<T>): Resource<T> {
    let status = ResourceStatus.Pending;
    let result: T;
    let error: E;
    const suspender = promise.then((r: T) => {
        status = ResourceStatus.Fullfilled;
        result = r;
    }).catch((e: any) => {
        status = ResourceStatus.Rejected;
        error = e;
    });
    return {
        read: () => {
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

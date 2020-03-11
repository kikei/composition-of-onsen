// export enum ValueKind {
//     Number,
//     Text
// }
// 
// interface NumberValue {
//     kind: ValueKind.Number,
//     value: number
// }
// 
// interface TextValue {
//     kind: ValueKind.Text,
//     value: string
// }
// 
// export type OptionalNumber = NumberValue | TextValue;

export type OptionalNumber = number | string;

// export function optionalNumber(x: number | string | undefined): OptionalNumber {
//     if (typeof x === 'number') {
//         return {
//             kind: ValueKind.Number,
//             value: x
//         };
//     } else {
//         return {
//             kind: ValueKind.Text,
//             value: x ?? ''
//         }
//     }
// }

export function mapNumber<T>(v: OptionalNumber | undefined,
                             f: (v: number) => number | string)
                          : OptionalNumber | undefined {
    if (typeof v === 'number') {
        return f(v);
    } else {
        return v;
    }
}

// export function mapNumber<T>(v: OptionalNumber | undefined,
//                              f: (v: number) => number | string)
//                           : OptionalNumber | undefined {
//     switch (v?.kind) {
//         case ValueKind.Number:
//             const result = f(v.value);
//             return optionalNumber(result);
//         default:
//             return v;
//     }
// }

// export function mapNumberToText(v: OptionalNumber | undefined,
//                                 f: (v: number) => string)
//                           : string | undefined {
//     switch (v?.kind) {
//         case ValueKind.Number:
//             return f(v.value);
//         case ValueKind.Text:
//             return v.value;
//         default:
//             return undefined;
//     }
// }

export function mapNumberToText(v: OptionalNumber | undefined,
                                f: (v: number) => string)
                          : string | undefined {
    if (typeof v ==='number')
        return f(v);
    else 
        return v;
}

// export function mapNumberOr<T>(v: OptionalNumber | undefined,
//                                f: (v: number) => T, t: T): T {
//                                    if (typeof v === 'number')
//                                        return f(v);
//                                    else
//                                        return t;
//     switch (v?.kind) {
//         case ValueKind.Number:
//             return f(v.value);
//         default:
//             return t;
//     }
// }


export function mapNumberOr<T>(v: OptionalNumber | undefined,
                               f: (v: number) => T, t: T): T {
                                   if (typeof v === 'number')
                                       return f(v);
                                   else
                                       return t;
                               }

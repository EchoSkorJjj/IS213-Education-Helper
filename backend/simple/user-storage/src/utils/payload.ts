import * as GoogleAny from '../../pb/google/protobuf/any';

export const getPayload = (typeUrl: string, value: any): GoogleAny.google.protobuf.Any => {
    return new GoogleAny.google.protobuf.Any({
        type_url: typeUrl,
        value: Buffer.from(JSON.stringify(value))
    });
}
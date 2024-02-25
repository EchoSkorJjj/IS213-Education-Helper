import * as grpc from '@grpc/grpc-js';
import logger from '../logger/logger';

interface MetaData {
    [key: string]: grpc.MetadataValue;
}

export const getMetaData = (metaData: MetaData, metaDataValue: string): string => {
    const value_raw = metaData[metaDataValue];
    const value = Array.isArray(value_raw) ? value_raw[0] : value_raw;
    return typeof value === 'string' ? value : value?.toString();
}

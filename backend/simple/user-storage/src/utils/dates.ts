import * as GoogleTimestamp from "../../pb/google/protobuf/timestamp";

export const dateToGoogleTimeStamp = (date: Date): GoogleTimestamp.google.protobuf.Timestamp => {
  const seconds = Math.floor(date.getTime() / 1000);
  const nanos = (date.getTime() % 1000) * 1e6;

  const timestamp = new GoogleTimestamp.google.protobuf.Timestamp();
  timestamp.seconds = seconds;
  timestamp.nanos = nanos;
  return timestamp;
};
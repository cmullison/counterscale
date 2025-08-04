export type ColumnMappingToType<
    T extends (typeof ColumnMappings)[keyof typeof ColumnMappings],
> = T extends `blob${number}`
    ? string
    : T extends `double${number}`
      ? number
      : never;

/**
 * This maps logical column names to the actual column names in the data store.
 */

export const ColumnMappings = {
    /**
     * blobs
     */
    host: "blob1",
    userAgent: "blob2",
    path: "blob3",
    country: "blob4",
    referrer: "blob5",
    browserName: "blob6",
    deviceModel: "blob7",
    siteId: "blob8",
    browserVersion: "blob9",
    deviceType: "blob10",

    // Event tracking columns
    eventName: "blob11",
    eventProperties: "blob12",
    eventCategory: "blob13",
    eventTarget: "blob14",

    /**
     * doubles
     */

    // this record is a new visitor (every 24h)
    newVisitor: "double1",

    // this record is a new session (resets after 30m inactivity)
    newSession: "double2",

    // this record is the bounce value
    bounce: "double3",

    // Event tracking doubles
    eventValue: "double4",
} as const;

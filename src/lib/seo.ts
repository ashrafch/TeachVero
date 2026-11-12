/** Only an explicitly reviewed, public launch should opt into indexing. */
export const siteIndexable = process.env.SITE_INDEXABLE === "true";

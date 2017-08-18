/* utils/static.js */

const HAS_LEADING = /^\//;
const HAS_TRAILING = /\/$/;


/**
 * Strip leading
 */
export const lstrip = path => path.replace(HAS_LEADING, "");


/**
 * Strip trailing
 */
export const rstrip = path => path.replace(HAS_TRAILING, "");


export const STATIC_PREFIX = rstrip(
    __SERVER__ ? process.env.STATIC_URL : window.__static);


/**
 * Static url helper
 */
const staticPath = path => `${STATIC_PREFIX}/${path.replace(HAS_LEADING, "")}`;


export default staticPath;

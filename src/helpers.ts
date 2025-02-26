const validDirectives = [
    "default-src",
    "script-src",
    "style-src",
    "img-src",
    "connect-src",
    "font-src",
    "object-src",
    "media-src",
    "frame-src",
    "sandbox",
    "report-uri",
    "child-src",
    "form-action",
    "frame-ancestors",
    "plugin-types",
    "base-uri",
    "report-to",
    "worker-src",
    "manifest-src",
    "prefetch-src",
    "navigate-to",
    "require-trusted-types-for",
    "trusted-types",
    "upgrade-insecure-requests",
    "block-all-mixed-content",
];

const specialRules = [
    "none",
    "self",
    "unsafe-inline",
    "unsafe-eval",
    "strict-dynamic",
    "unsafe-hashes",
];

export const isValidDirective = (directive: string) =>
    validDirectives.includes(directive);

export const formatRule = (rule: string) =>
    specialRules.includes(rule) ? `'${rule}'` : rule;

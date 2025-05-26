import {ContentSecurityPolicy, Directive} from "./types";

export interface WarningOptions {
  overlyPermissive?: boolean;
  missingDirectives?: boolean;
  unsafeInline?: boolean;
  missingNonceOrHash?: boolean;
  dataUri?: boolean;
}

const DEFAULT_WARNINGS: Required<WarningOptions> = {
  overlyPermissive: true,
  missingDirectives: true,
  unsafeInline: true,
  missingNonceOrHash: true,
  dataUri: true,
};

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

export function warnOnCspIssues(
  csp: ContentSecurityPolicy,
  overrides: WarningOptions = {}
): void {
  const options = { ...DEFAULT_WARNINGS, ...overrides };

  // 1. Overly permissive: * in script-src, style-src, etc.
  if (options.overlyPermissive) {
    [Directive.SCRIPT_SRC, Directive.STYLE_SRC, Directive.IMG_SRC, Directive.CONNECT_SRC].forEach(directive => {
      const rules = csp[directive];
      if (Array.isArray(rules) && rules.includes("*")) {
        console.warn(`[CSPrefabricate] Overly permissive: '*' found in ${directive}`);
      }
    });
  }

  // 2. Missing important directives
  if (options.missingDirectives) {
    [Directive.OBJECT_SRC, Directive.BASE_URI, Directive.FORM_ACTION].forEach(directive => {
      if (!(directive in csp)) {
        console.warn(`[CSPrefabricate] Missing recommended directive: ${directive}`);
      }
    });
  }

  // 3. Unsafe inline
  if (options.unsafeInline) {
    [Directive.SCRIPT_SRC, Directive.STYLE_SRC].forEach(directive => {
      const rules = csp[directive];
      if (Array.isArray(rules) && rules.includes("'unsafe-inline'")) {
        console.warn(`[CSPrefabricate] 'unsafe-inline' found in ${directive}`);
      }
    });
  }

  // 4. Missing nonce or hash in script-src if 'unsafe-inline' is present
  if (options.missingNonceOrHash) {
    const rules = csp[Directive.SCRIPT_SRC];
    if (Array.isArray(rules) && rules.includes("'unsafe-inline'")) {
      const hasNonceOrHash = rules.some(
        (r: unknown) => typeof r === "string" && (r.startsWith("'nonce-") || r.startsWith("'sha"))
      );
      if (!hasNonceOrHash) {
        console.warn(`[CSPrefabricate] 'unsafe-inline' in script-src without nonce or hash`);
      }
    }
  }

  // 5. Permitting data: in img-src or media-src
  if (options.dataUri) {
    [Directive.IMG_SRC, Directive.MEDIA_SRC].forEach(directive => {
      const rules = csp[directive];
      if (Array.isArray(rules) && rules.includes("data:")) {
        console.warn(`[CSPrefabricate] 'data:' allowed in ${directive}`);
      }
    });
  }
}

export const isValidDirective = (directive: string) =>
    validDirectives.includes(directive);

export const formatRule = (rule: string) =>
    specialRules.includes(rule) ? `'${rule}'` : rule;

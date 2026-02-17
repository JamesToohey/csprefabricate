# csprefabricate

**Generate a valid CSP with TypeScript.**

Content Security Policies (CSPs) are cumbersome strings that are frustrating to work with:

- Fickle syntax
- Duplication when multiple TLDs are required
- Easy to allow insecure configuration

This project aims to make creating useful and secure CSPs a more pleasant experience.

Currently `csprefabricate`:

- Validates directive names
- Supports CSP Level 3 directives (`script-src-elem`, `script-src-attr`, `style-src-elem`, `style-src-attr`, `webrtc`)
- Supports CSP Level 3 keyword sources (`'wasm-unsafe-eval'`, `'inline-speculation-rules'`, `'unsafe-allow-redirects'`, `'trusted-types-eval'`, `'report-sample'`, `'report-sha256'`, `'report-sha384'`, `'report-sha512'`, `'unsafe-webtransport-hashes'`)
- Supports providing a list of TLDs for a given domain name
- Provides warnings for insecure or incomplete CSP configurations, with options to disable specific warnings
- Warns about deprecated directives (`plugin-types`, `report-uri`, `block-all-mixed-content`)

## Common CSP Issues

By default, `csprefabricate` will warn you about common CSP issues, such as:

- Overly permissive sources (e.g. using `*`)
- Missing recommended directives (i.e. `object-src`, `base-uri`, `form-action`)
- Use of `'unsafe-inline'` in `script-src`, even if nonces or hashes are present
- Missing nonces or hashes when using `'unsafe-inline'` in `script-src`
- Allowing `data:` in `img-src` or `media-src`
- Use of deprecated directives (`plugin-types`, `report-uri`, `block-all-mixed-content`)

You can control which warnings are shown by passing an optional `WarningOptions` object to the `create` function:

```typescript
import {
    create,
    Directive,
    ContentSecurityPolicy,
    WarningOptions,
} from "csprefabricate";

const csp: ContentSecurityPolicy = {
    [Directive.SCRIPT_SRC]: ["*"],
    [Directive.IMG_SRC]: ["data:"],
};

// Disable all warnings
const warningOptions: WarningOptions = {
    overlyPermissive: false,
    missingDirectives: false,
    unsafeInline: false,
    missingNonceOrHash: false,
    dataUri: false,
    deprecatedDirectives: false,
};

create(csp, warningOptions);
```

You can selectively enable or disable specific warnings as needed.

## Real World Examples

### Example 1: Basic Strict Policy

```typescript
import {create, Directive, ContentSecurityPolicy} from "csprefabricate";

const csp: ContentSecurityPolicy = {
    [Directive.DEFAULT_SRC]: ["'self'"],
    [Directive.SCRIPT_SRC]: ["'self'"],
    [Directive.STYLE_SRC]: ["'self'"],
    [Directive.IMG_SRC]: ["'self'"],
    [Directive.OBJECT_SRC]: ["'none'"],
    [Directive.BASE_URI]: ["'self'"],
    [Directive.FORM_ACTION]: ["'self'"],
};

const cspString = create(csp);
// "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';"
```

### Example 2: Allowing Google Analytics

```typescript
import {create, Directive, ContentSecurityPolicy} from "csprefabricate";

const csp: ContentSecurityPolicy = {
    [Directive.DEFAULT_SRC]: ["'self'"],
    [Directive.SCRIPT_SRC]: ["'self'", "*.googletagmanager.com"],
    [Directive.STYLE_SRC]: ["'self'"],
    [Directive.IMG_SRC]: [
        "'self'",
        "https://*.google-analytics.com",
        "https://*.googletagmanager.com",
    ],
    [Directive.OBJECT_SRC]: ["'none'"],
    [Directive.BASE_URI]: ["'self'"],
    [Directive.FORM_ACTION]: ["'self'"],
    [Directive.CONNECT_SRC]: [
        "'self'",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.googletagmanager.com",
    ],
};

const cspString = create(csp);
// "default-src 'self'; script-src 'self' *.googletagmanager.com; style-src 'self'; img-src 'self' https://*.google-analytics.com https://*.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;"
```

### Example 3: Using TLD Expansion for Multiple Domains

```typescript
import {create, Directive, ContentSecurityPolicy} from "csprefabricate";

const csp: ContentSecurityPolicy = {
    [Directive.IMG_SRC]: ["self", {"*.example": [".com", ".co.uk", ".net"]}],
};

const cspString = create(csp);
// "img-src 'self' *.example.com *.example.co.uk *.example.net;"
```

### Example 4: Using CSP Level 3 Directives and Keywords

CSP Level 3 introduced more granular control over scripts and styles, plus new keyword sources:

```typescript
import {create, Directive, ContentSecurityPolicy} from "csprefabricate";

const csp: ContentSecurityPolicy = {
    [Directive.DEFAULT_SRC]: ["'self'"],
    // Control <script> elements separately from inline event handlers
    [Directive.SCRIPT_SRC_ELEM]: ["'self'", "https://cdn.example.com"],
    [Directive.SCRIPT_SRC_ATTR]: ["'none'"],
    // Control <style> elements separately from inline styles
    [Directive.STYLE_SRC_ELEM]: ["'self'"],
    [Directive.STYLE_SRC_ATTR]: ["'unsafe-inline'"],
    // Allow WebAssembly compilation (but not eval)
    [Directive.SCRIPT_SRC]: ["'self'", "'wasm-unsafe-eval'"],
    // Control WebRTC connections
    [Directive.WEBRTC]: ["'allow'"],
    [Directive.OBJECT_SRC]: ["'none'"],
    [Directive.BASE_URI]: ["'self'"],
};

const cspString = create(csp);
// "default-src 'self'; script-src-elem 'self' https://cdn.example.com; script-src-attr 'none'; style-src-elem 'self'; style-src-attr 'unsafe-inline'; script-src 'self' 'wasm-unsafe-eval'; webrtc 'allow'; object-src 'none'; base-uri 'self';"
```

#### CSP Level 3 Keyword Sources

CSP Level 3 introduces several new keyword sources that are automatically wrapped in single quotes:

- **`'wasm-unsafe-eval'`** - Allows WebAssembly compilation without allowing JavaScript eval
- **`'inline-speculation-rules'`** - Allows inline speculation rules for prefetching
- **`'unsafe-allow-redirects'`** - Allows redirects in navigation (experimental)
- **`'trusted-types-eval'`** - Allows eval when combined with Trusted Types
- **`'report-sample'`** - Includes code samples in violation reports
- **`'report-sha256'`, `'report-sha384'`, `'report-sha512'`** - Generates hash-based reports for subresources
- **`'unsafe-webtransport-hashes'`** - Allows WebTransport connections with certificate hashes

## Deprecated Directives

Some CSP directives have been deprecated in favor of newer alternatives. `csprefabricate` will warn you when using these directives:

- **`plugin-types`** - Never widely supported, scheduled for removal
- **`report-uri`** - Use `report-to` instead
- **`block-all-mixed-content`** - Use `upgrade-insecure-requests` instead

These directives are still functional but may be removed from future CSP specifications. You can disable these warnings by setting `deprecatedDirectives: false` in your `WarningOptions`.

## Baseline Recommended CSPs

You can quickly generate a recommended Content Security Policy for common use cases using built-in baselines.

Available Baselines:

- BASELINE_STRICT_CSP
- GOOGLE_ANALYTICS_CSP
- GOOGLE_ANALYTICS_WITH_SIGNALS_CSP

### Google Analytics Baseline CSP

Allow Google Analytics and Tag Manager:

```typescript
import {create, Baseline} from "csprefabricate";

const cspString = create(Baseline.GOOGLE_ANALYTICS_CSP);
```

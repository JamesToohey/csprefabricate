# csprefabricate (Work in progress)

**Generate a valid CSP with JavaScript. Built with TypeScript.**

Content Security Policies (CSPs) are cumbersome strings that are frusting to work with:

- Fickle syntax
- Duplicattion when multiple TLDs are required
- Easy to allow insecure configuration

This project aims to make creating useful and secure CSPs a more pleasant experience.

Currently `csprefabricate`:

- Validates directive names
- Supports providing a list of TLDs for a given domain name
- Provides warnings for insecure or incomplete CSP configurations, with options to disable specific warnings

## Common CSP Issues

By default, `csprefabricate` will warn you about common CSP issues, such as:

- Overly permissive sources (e.g. using `*`)
- Missing recommended directives (i.e. `object-src`, `base-uri`, `form-action`)
- Use of `'unsafe-inline'` in `script-src` without nonces or hashes
- Allowing `data:` in `img-src` or `media-src`

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
    [Directive.DEFAULT_SRC]: ["self"],
    [Directive.SCRIPT_SRC]: ["self", "*.googletagmanager.com"],
    [Directive.IMG_SRC]: [
        "self",
        "*.google-analytics.com",
        "https://*.googletagmanager.com",
    ],
    [Directive.CONNECT_SRC]: [
        "self",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.googletagmanager.com",
    ],
};

const cspString = create(csp);
// "default-src 'self'; script-src 'self' *.googletagmanager.com; img-src 'self' *.google-analytics.com https://*.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;"
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

## Future

- Generate baseline recommended CSPs (for example, Google Analytics)
- Warnings for insecure configurations

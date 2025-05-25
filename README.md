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

## Real World Examples

### Example 1: Basic Strict Policy

```typescript
import {create, Directive, ContentSecurityPolicy} from "csprefabricate";

const csp: ContentSecurityPolicy = {
    [Directive.DEFAULT_SRC]: ["'self'"],
    [Directive.SCRIPT_SRC]: ["'self'"],
    [Directive.STYLE_SRC]: ["'self'"],
    [Directive.IMG_SRC]: ["'self'", "data:"],
    [Directive.OBJECT_SRC]: ["'none'"],
    [Directive.BASE_URI]: ["'self'"],
    [Directive.FORM_ACTION]: ["'self'"],
};

const cspString = create(csp);
// "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';"
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

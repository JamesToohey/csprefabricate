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

### Example 1: Basic Secure Policy

```typescript
import {create, Directive, ContentSecurityPolicy} from "csprefabricate";

const csp: ContentSecurityPolicy = {
    [Directive.DEFAULT_SRC]: ["self"],
    [Directive.SCRIPT_SRC]: ["self", "cdn.jsdelivr.net"],
    [Directive.STYLE_SRC]: ["self", "fonts.googleapis.com"],
    [Directive.FONT_SRC]: ["self", "fonts.gstatic.com"],
    [Directive.IMG_SRC]: ["self", "data:", "cdn.example.com"],
};

const cspString = create(csp);
// "default-src 'self'; script-src 'self' cdn.jsdelivr.net; style-src 'self' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: cdn.example.com; upgrade-insecure-requests;"
```

### Example 2: Allowing Google Analytics

```typescript
import {create, Directive, ContentSecurityPolicy} from "csprefabricate";

const csp: ContentSecurityPolicy = {
    [Directive.DEFAULT_SRC]: ["self"],
    [Directive.SCRIPT_SRC]: [
        "self",
        "www.googletagmanager.com",
        "www.google-analytics.com",
    ],
    [Directive.IMG_SRC]: ["self", "www.google-analytics.com"],
    [Directive.CONNECT_SRC]: ["self", "www.google-analytics.com"],
};

const cspString = create(csp);
// "default-src 'self'; script-src 'self' www.googletagmanager.com www.google-analytics.com; img-src 'self' www.google-analytics.com; connect-src 'self' www.google-analytics.com;"
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

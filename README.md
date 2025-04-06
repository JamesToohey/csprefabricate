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

```typescript
import {create} from "csprefabricate";

const input = {
    [Directive.DEFAULT_SRC]: ["self"],
    [Directive.IMG_SRC]: ["self", {"*.google": [".com", ".com.au"]}],
} satisfies ContentSecurityPolicy;

const output = create(csp);
// > "default-src 'self'; img-src 'self' *.google.com *.google.com.au;",
```

## Future

- Generate baseline recommended CSPs (for example, Google Analytics)
- Warnings for insecure configurations

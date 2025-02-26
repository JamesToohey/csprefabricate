# csprefabricate (Work in progress)

Returns a valid CSP string from an input object

For example:

```typescript
const input: ContentSecurityPolicy = {
    [Directive.DEFAULT_SRC]: ["self"],
    [Directive.IMG_SRC]: ["self", {"*.google": [".com", ".com.au"]}],
};
const output = createCsp(csp);
console.log(output);
//> "default-src 'self'; img-src 'self' *.google.com *.google.com.au;",
```

## Future

- Generate baseline recommended CSPs

## Test

```
❯ yarn test
```

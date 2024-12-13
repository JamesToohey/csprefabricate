# csprefabricate (Work in progress)

Generates a valid CSP string (currently in the form of a text file) from a YAML file.

Example format

```yaml
csp:
  default-src:
    - self
  img-src:
    - self
    - "*.google":
        - .com
        - .com.au
  invalid-directive:
    - will-be-filtered-out
```

## Future

- Distribute as CLI (currently in development)
- Generate baseline recommended CSPs

## Run

```
❯ yarn execute --inputPath="./help/test.yaml" --outputPath "./help/out.txt"
```

## Test

```
❯ yarn test
```

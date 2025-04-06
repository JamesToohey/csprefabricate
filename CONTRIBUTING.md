# Contributing

## Testing

```
yarn test
```

## Publishing

The `prepublish` script runs `yarn version check` which will error if there are changes.

> Note: Only perform releases from `main`. This ensures tests are passing (although tests are run as a part of `prepack`)

1. Run `yarn version check -i` and select the appropriate release type.
1. Run `yarn publish`

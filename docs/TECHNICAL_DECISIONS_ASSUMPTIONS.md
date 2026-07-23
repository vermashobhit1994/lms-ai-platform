# DECISIONS

## Why I choose cors node package instead of any other package for cors implementation?

1. It's standard middleware purpose-built for express middleware.
2. It's RFC/HTTP compliant i.e. correctly handle CORS headers and preflight
   requests and don't write it from scratch.
3. It's flexible as it supports **static origins**, **arrays**, **regex**,
   **dynamic origin callbacks**
4. It's lightweight
5. It's well documented

# ASSUMPTIONS

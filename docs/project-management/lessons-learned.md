## CI/CD Implementation

Implemented a CI/CD pipeline using GitHub Actions.

Key Learnings:

- Used OIDC instead of AWS access keys for secure authentication
- Configured IAM role with trust policy for GitHub
- Automated S3 deployment using `aws s3 sync`
- Used CloudFront invalidation to avoid stale frontend assets
- Learned importance of build-time environment variables

This significantly improved deployment speed and reliability.
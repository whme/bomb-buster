FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Install Supabase CLI directly from .deb package.
# This avoids the ghcr.io/devcontainers-extra/features/supabase-cli feature,
# which fails with GitHub API rate limits (nanolayer uses the REST API).
# Update version: https://github.com/supabase/cli/releases
ARG SUPABASE_VERSION=2.90.0
RUN curl -fsSL "https://github.com/supabase/cli/releases/download/v${SUPABASE_VERSION}/supabase_${SUPABASE_VERSION}_linux_amd64.deb" -o /tmp/supabase.deb \
    && dpkg -i /tmp/supabase.deb \
    && rm /tmp/supabase.deb

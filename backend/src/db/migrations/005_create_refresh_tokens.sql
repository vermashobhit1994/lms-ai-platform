-- Opaque refresh tokens are stored hashed so we can revoke/rotate sessions.
-- The raw token is only sent to the client once; DB never stores it in plaintext.

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Which user this session belongs to.
    -- ON DELETE CASCADE: if user is deleted, their sessions disappear.
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- SHA-256 hex (or similar) of the refresh token string.
    -- UNIQUE so the same token hash cannot be stored twice.
    token_hash TEXT NOT NULL UNIQUE,

    -- Absolute expiry; refresh must fail after this time.
    expires_at TIMESTAMPTZ NOT NULL,

    -- NULL = still valid; non-NULL = logged out / rotated / revoked.
    revoked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Optional audit / device hints (useful later for "active sessions").
    user_agent TEXT,
    ip_address INET
);

-- Speeds up "list/revoke all sessions for this user".
CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens (user_id);

-- Speeds up cleanup of expired rows (optional but useful).
CREATE INDEX refresh_tokens_expires_at_idx ON refresh_tokens (expires_at);

/**
 * Validates that all required environment variables are present before the
 * server starts. Exits with a clear error message if any are missing.
 */
const REQUIRED: Record<string, string> = {
  MONGODB_URI:    'MongoDB connection string',
};

const OPTIONAL: Record<string, string> = {
  PORT:               'HTTP port (default: 5000)',
  CLIENT_URL:         'Next.js client origin (default: http://localhost:3000)',
  CLICKHOUSE_URL:     'ClickHouse URL (default: http://localhost:8123)',
  CLICKHOUSE_USER:    'ClickHouse username (default: default)',
  CLICKHOUSE_PASSWORD:'ClickHouse password (default: empty)',
  CLICKHOUSE_DB:      'ClickHouse database (default: default)',
};

export function validateEnv(): void {
  const missing: string[] = [];

  for (const [key, description] of Object.entries(REQUIRED)) {
    if (!process.env[key]) {
      missing.push(`  ${key.padEnd(24)} — ${description}`);
    }
  }

  if (missing.length > 0) {
    console.error('\n❌  Missing required environment variables:\n');
    missing.forEach((m) => console.error(m));
    console.error('\nCreate a .env file in the server/ directory with the missing values.\n');
    process.exit(1);
  }

  // Warn about optional vars that are using defaults
  const usingDefaults = Object.keys(OPTIONAL).filter((k) => !process.env[k]);
  if (usingDefaults.length > 0) {
    console.warn(`[env] Using defaults for: ${usingDefaults.join(', ')}`);
  }
}

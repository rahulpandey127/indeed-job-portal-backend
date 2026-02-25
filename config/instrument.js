// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
Sentry.init({
  dsn: "https://5c27aa63a7afc06e710e2a44002c1f08@o4510906210516992.ingest.us.sentry.io/4510906215301120",
  integrations: [nodeProfilingIntegration(), Sentry.mongooseIntegration()],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

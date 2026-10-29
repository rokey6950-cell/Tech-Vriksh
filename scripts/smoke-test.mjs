/**
 * Smoke test for Perplexity Agent API integration.
 *
 * Verifies live connection to POST https://api.perplexity.ai/v1/agent.
 * Prints ONLY HTTP status and response shape; NEVER prints, logs, or exposes the API key.
 */

async function runSmokeTest() {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.log('[Smoke Test] Result: SKIPPED (PERPLEXITY_API_KEY is not set)');
    console.log('[Smoke Test] To test with a live request, generate an API key in the Perplexity Console:');
    console.log('             https://console.perplexity.ai');
    console.log('[Smoke Test] Then export it in your terminal:');
    console.log('             Windows:    $env:PERPLEXITY_API_KEY = "your_key"');
    console.log('             Mac/Linux:  export PERPLEXITY_API_KEY="your_key"');
    process.exit(0);
  }

  console.log('[Smoke Test] PERPLEXITY_API_KEY is detected in environment.');
  console.log('[Smoke Test] Sending minimal request to POST https://api.perplexity.ai/v1/agent ...');

  try {
    const startTime = Date.now();
    const response = await fetch('https://api.perplexity.ai/v1/agent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        effort: 'fast',
        input: 'Say hello in 3 words.',
      }),
    });

    const elapsed = Date.now() - startTime;
    const status = response.status;
    const statusText = response.statusText;

    console.log(`[Smoke Test] HTTP Status: ${status} ${statusText} (${elapsed}ms)`);

    if (status === 200) {
      const data = await response.json();
      console.log('[Smoke Test] Response Shape:');
      console.log(JSON.stringify({
        id: data.id,
        object: data.object,
        status: data.status,
        model: data.model,
        effort: data.effort,
        has_output: Array.isArray(data.output),
        output_items_count: Array.isArray(data.output) ? data.output.length : 0,
        usage: data.usage ? { total_tokens: data.usage.total_tokens } : undefined,
      }, null, 2));
      console.log('[Smoke Test] SUCCESS: Perplexity Agent API integration is working as expected.');
    } else if (status === 401) {
      console.error('[Smoke Test] FAILED (401 Unauthorized): Invalid or unauthorized PERPLEXITY_API_KEY.');
      console.error('             Check your key at https://console.perplexity.ai');
      process.exit(1);
    } else if (status === 429) {
      const retryAfter = response.headers.get('retry-after');
      console.error(`[Smoke Test] FAILED (429 Rate Limit): Rate limit reached. Retry-After: ${retryAfter || 'N/A'}`);
      process.exit(1);
    } else {
      const errText = await response.text();
      console.error(`[Smoke Test] FAILED (${status}): ${errText}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('[Smoke Test] Request network error:', err.message);
    process.exit(1);
  }
}

runSmokeTest();

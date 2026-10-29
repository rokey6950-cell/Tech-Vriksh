import { NextRequest, NextResponse } from 'next/server';
import { askAgent, AgentRequestOptions } from '@/lib/perplexity';

export const runtime = 'nodejs';

/**
 * Health check endpoint for Perplexity Agent API configuration
 */
export async function GET() {
  const isKeyConfigured = Boolean(process.env.PERPLEXITY_API_KEY && process.env.PERPLEXITY_API_KEY.trim().length > 0);
  return NextResponse.json({
    status: 'ok',
    configured: isKeyConfigured,
    message: isKeyConfigured
      ? 'Perplexity Agent API is configured and ready.'
      : 'PERPLEXITY_API_KEY is not set. Please set the environment variable in your terminal or .env.local file.',
  });
}

/**
 * POST handler to generate web-grounded responses via Perplexity Agent API
 */
export async function POST(req: NextRequest) {
  try {
    const isKeyConfigured = Boolean(process.env.PERPLEXITY_API_KEY && process.env.PERPLEXITY_API_KEY.trim().length > 0);
    if (!isKeyConfigured) {
      return NextResponse.json(
        {
          error: 'PERPLEXITY_API_KEY is not configured on the server.',
          hint: 'Please create an API key in the Perplexity Console (https://console.perplexity.ai) and export it as PERPLEXITY_API_KEY.',
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const input = body.input || body.query;
    if (!input || (typeof input === 'string' && input.trim() === '')) {
      return NextResponse.json({ error: "Missing required 'input' or 'query' field in request body." }, { status: 400 });
    }

    const options: AgentRequestOptions = {
      input,
      effort: body.effort,
      model: body.model,
      models: body.models,
      tools: body.tools,
      instructions: body.instructions || 'You are an intelligent, web-grounded AI assistant for Tech Vriksh, a premier technology community.',
      previousResponseId: body.previousResponseId || body.previous_response_id,
      responseFormat: body.responseFormat || body.response_format,
      maxOutputTokens: body.maxOutputTokens || body.max_output_tokens,
      maxSteps: body.maxSteps || body.max_steps,
      temperature: body.temperature,
    };

    const result = await askAgent(options);

    return NextResponse.json({
      success: true,
      id: result.id,
      answer: result.outputText,
      model: result.model,
      effort: result.effort,
      citations: result.citations,
      searchResults: result.searchResults,
      usage: result.usage,
      status: result.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    // Check for specific error status codes
    if (message.includes('401') || message.includes('Authentication Error')) {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    if (message.includes('429') || message.includes('Rate Limit')) {
      return NextResponse.json({ error: message }, { status: 429 });
    }
    if (message.includes('400') || message.includes('Bad Request')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import Perplexity from '@perplexity-ai/perplexity_ai';

/**
 * Validates presence of PERPLEXITY_API_KEY without logging or exposing the secret.
 */
export function getPerplexityApiKey(): string {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'PERPLEXITY_API_KEY environment variable is not configured. Please create an API key in the Perplexity API Console (https://console.perplexity.ai) and export PERPLEXITY_API_KEY in your environment or .env.local file.'
    );
  }
  return apiKey;
}

let clientInstance: Perplexity | null = null;

/**
 * Returns a configured singleton instance of the official Perplexity SDK client.
 */
export function getPerplexityClient(): Perplexity {
  if (!clientInstance) {
    const apiKey = getPerplexityApiKey();
    clientInstance = new Perplexity({
      apiKey,
      maxRetries: 2,
      timeout: 60 * 1000, // 60 seconds
    });
  }
  return clientInstance;
}

export type AgentEffortLevel = 'fast' | 'low' | 'medium' | 'high' | 'xhigh';

export interface CitationInfo {
  url?: string;
  title?: string;
  startIndex?: number;
  endIndex?: number;
}

export interface SearchResultItem {
  id: number;
  title: string;
  url: string;
  snippet?: string;
  date?: string;
  lastUpdated?: string;
}

export interface AgentRequestOptions {
  /**
   * User prompt or conversation messages array
   */
  input: string | Array<{ content: string; role: 'user' | 'assistant' }>;
  /**
   * Effort level for pre-configured research depth, model, and tool setup.
   * Options: 'fast' | 'low' | 'medium' | 'high' | 'xhigh'. Defaults to 'low'.
   */
  effort?: AgentEffortLevel | string;
  /**
   * Direct model specifier (e.g. 'openai/gpt-5.6-sol', 'anthropic/claude-3-5-sonnet-20241022')
   */
  model?: string;
  /**
   * Model fallback chain. Max 5 models.
   */
  models?: string[];
  /**
   * Built-in tools: web_search, fetch_url, finance_search, sandbox, etc.
   */
  tools?: Array<{ type: 'web_search' | 'fetch_url' | 'finance_search' | 'sandbox' | string; [key: string]: unknown }>;
  /**
   * System prompt / instructions for the agent
   */
  instructions?: string;
  /**
   * Multi-turn continuation: id of completed previous response
   */
  previousResponseId?: string;
  /**
   * JSON Schema or structured output specification
   */
  responseFormat?: Perplexity.Responses.ResponseCreateParams['response_format'];
  /**
   * Maximum tokens to generate
   */
  maxOutputTokens?: number;
  /**
   * Max research loop steps (1-100)
   */
  maxSteps?: number;
  /**
   * Temperature for generation (0 to 2)
   */
  temperature?: number;
}

export interface AgentResponseResult {
  id: string;
  outputText: string;
  model: string;
  effort?: string;
  citations: CitationInfo[];
  searchResults: SearchResultItem[];
  usage?: Perplexity.Responses.ResponsesUsage;
  status: string;
  rawOutput?: Perplexity.Responses.OutputItem[];
}

/**
 * Dispatches a web-grounded request to the Perplexity Agent API (POST /v1/agent).
 *
 * Utilizes the official Perplexity SDK `client.responses.create(...)` with:
 * - Convenience `output_text` for clean answer extraction
 * - Web search grounding (via preset/effort or tools: [{ type: "web_search" }])
 * - Citations from message annotations
 * - Source metadata from search_results
 * - Multi-turn conversation continuation via `previous_response_id`
 */
export async function askAgent(options: AgentRequestOptions): Promise<AgentResponseResult> {
  const client = getPerplexityClient();

  // Format input: string or array of input items
  const formattedInput = typeof options.input === 'string'
    ? options.input
    : options.input.map(item => ({
        content: [{ text: item.content, type: 'input_text' as const }],
        role: item.role,
        type: 'message' as const,
      }));

  // Build the non-streaming request payload according to Agent API specs
  const requestPayload: Perplexity.Responses.ResponseCreateParamsNonStreaming = {
    input: formattedInput,
    stream: false,
  };

  // Either configure effort level or direct model
  if (options.effort) {
    requestPayload.effort = options.effort;
  } else if (options.model) {
    requestPayload.model = options.model;
    // When using direct model without effort, include web_search tool by default if not provided
    requestPayload.tools = (options.tools as Perplexity.Responses.ResponseCreateParams['tools']) || [{ type: 'web_search' }];
  } else {
    // Default to 'low' effort for balanced speed and web-grounded research
    requestPayload.effort = 'low';
  }

  if (options.models && options.models.length > 0) {
    requestPayload.models = options.models;
  }

  if (options.tools && options.tools.length > 0) {
    requestPayload.tools = options.tools as Perplexity.Responses.ResponseCreateParams['tools'];
  }

  if (options.instructions) {
    requestPayload.instructions = options.instructions;
  }

  if (options.previousResponseId) {
    requestPayload.previous_response_id = options.previousResponseId;
  }

  if (options.responseFormat) {
    requestPayload.response_format = options.responseFormat;
  }

  if (typeof options.maxOutputTokens === 'number') {
    requestPayload.max_output_tokens = options.maxOutputTokens;
  }

  if (typeof options.maxSteps === 'number') {
    requestPayload.max_steps = options.maxSteps;
  }

  if (typeof options.temperature === 'number') {
    requestPayload.temperature = options.temperature;
  }

  try {
    const response = await client.responses.create(requestPayload);

    // Extract text from convenience property `output_text`
    const outputText = response.output_text || '';

    // Extract citations from message annotations and search results
    const citations: CitationInfo[] = [];
    const searchResults: SearchResultItem[] = [];

    if (Array.isArray(response.output)) {
      for (const item of response.output) {
        // Collect search results
        if (item.type === 'search_results' && Array.isArray(item.results)) {
          for (const res of item.results) {
            searchResults.push({
              id: res.id,
              title: res.title,
              url: res.url,
              snippet: res.snippet,
              date: res.date,
              lastUpdated: res.last_updated,
            });
          }
        }

        // Collect message text annotations
        if (item.type === 'message' && Array.isArray(item.content)) {
          for (const part of item.content) {
            if (part.type === 'output_text' && Array.isArray(part.annotations)) {
              for (const ann of part.annotations) {
                if (ann.url || ann.title) {
                  citations.push({
                    url: ann.url,
                    title: ann.title,
                    startIndex: ann.start_index,
                    endIndex: ann.end_index,
                  });
                }
              }
            }
          }
        }
      }
    }

    return {
      id: response.id,
      outputText,
      model: response.model,
      effort: response.effort,
      citations,
      searchResults,
      usage: response.usage,
      status: response.status,
      rawOutput: response.output,
    };
  } catch (error: unknown) {
    if (error instanceof Perplexity.APIError) {
      if (error.status === 401) {
        throw new Error('Perplexity API Authentication Error (401): The provided PERPLEXITY_API_KEY is invalid or unauthorized. Please verify your key at https://console.perplexity.ai.');
      }
      if (error.status === 429) {
        const retryAfter = error.headers?.get?.('retry-after') || 'shortly';
        throw new Error(`Perplexity API Rate Limit (429): Rate limit exceeded or model temporarily busy. Please retry after ${retryAfter}.`);
      }
      throw new Error(`Perplexity API Error (${error.status}): ${error.message}`);
    }
    throw error;
  }
}

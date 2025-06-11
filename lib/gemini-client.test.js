// lib/gemini-client.test.js

// Import the actual logger instance to spy on its methods
import { logger } from '../utils/Logger'; // Path to your logger.js
import { GeminiClient } from './gemini-client'; // Assuming GeminiClient class is exported for testing
                                          // If only the instance 'geminiClient' is exported, adjust import.
                                          // Let's assume you export the class: export class GeminiClient { ... }

// --- Mocks for External Dependencies ---
let mockGenerateContentFn; // This will be redefined in tests
const mockGetGenerativeModel = jest.fn(() => ({
  generateContent: (...args) => mockGenerateContentFn(...args),
}));

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
  // Mock HarmCategory and HarmBlockThreshold as they are imported by gemini-client
  HarmCategory: {
    HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
    HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT',
  },
  HarmBlockThreshold: {
    BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE',
  },
}));

// --- Mock Environment Variables ---
const MOCK_API_KEY_1 = 'TEST_KEY_001';
const MOCK_API_KEY_2 = 'TEST_KEY_002';
process.env.GEMINI_API_KEY = MOCK_API_KEY_1;
process.env.GEMINI_API_KEY_2 = MOCK_API_KEY_2;
// Add MOCK_API_KEY_3 if your client uses it
// process.env.GEMINI_API_KEY_3 = 'TEST_KEY_003';


// --- Test Suite ---
describe('GeminiClient with Logger Integration', () => {
  let geminiClientInstance;
  let loggerInfoSpy;
  let loggerWarnSpy;
  let loggerErrorSpy;

  // Constants from your GeminiClient (make sure these match or are accessible)
  // If these are not static on the class, you might need to hardcode them for the test
  // or instantiate the client once to read them. For this example, let's assume they are effectively constants.
  const MAX_RETRIES_PER_KEY = 2; 
  const OVERALL_MAX_ATTEMPTS = 5;


  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a new instance of GeminiClient for each test
    // This assumes you export the class `GeminiClient` from `gemini-client.js`
    geminiClientInstance = new GeminiClient(); 

    // Enable logger's debug mode to ensure logs are processed for spying and output
    logger.updateDebugMode(true); // This will also print "DEBUG MODE ENABLED"
                                 // Set to false if you don't want app context snapshot in test output

    // Spy on logger methods but allow original implementation to run (for console output)
    loggerInfoSpy = jest.spyOn(logger, 'info');
    loggerWarnSpy = jest.spyOn(logger, 'warn');
    loggerErrorSpy = jest.spyOn(logger, 'error');

    // Default mock for successful API call
    mockGenerateContentFn = jest.fn().mockResolvedValue({
      response: { text: () => 'Mocked AI response' },
    });
    // Ensure mockGetGenerativeModel uses the fresh mockGenerateContentFn
    mockGetGenerativeModel.mockReturnValue({ generateContent: (...args) => mockGenerateContentFn(...args) });


    // Use fake timers for controlling setTimeout for cooldowns
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers
    // Optionally restore original logger debug mode if it was changed
    // logger.updateDebugMode(false); // Or whatever its original state was
  });

  it('should log initialization message', () => {
    // Instantiation happens in beforeEach
    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining('Initialized with'), // Checks for partial string match
      // data for this log is undefined in gemini-client, so we don't check it or expect undefined
    );
    // The number of keys depends on how many TEST_KEY_... you set up
    expect(loggerInfoSpy).toHaveBeenCalledWith('GeminiClient', 'Initialized with 2 API keys.');
  });

  it('should log successful API call', async () => {
    const prompt = 'Test prompt for success';
    await geminiClientInstance.generateContent(prompt);

    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining('Attempt 1/'), // Check attempt number
      undefined // No specific data object expected here based on current client
    );
    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining(`API call succeeded with model ${geminiClientInstance.getModelConfig().model} using key ...${MOCK_API_KEY_1.slice(-4)}`),
      undefined
    );
    expect(GoogleGenerativeAI).toHaveBeenCalledWith(MOCK_API_KEY_1);
    expect(mockGenerateContentFn).toHaveBeenCalledWith(prompt);
  });

  it('should log rate limit warnings, retry on same key, then rotate and log success', async () => {
    const rateLimitError = new Error('Mocked Rate Limit: 429 Too Many Requests');
    rateLimitError.status = 429; // Simulate a 429 error

    mockGenerateContentFn = jest.fn()
      .mockRejectedValueOnce(rateLimitError) // Key 1, Attempt 1 on key (overall attempt 1)
      .mockRejectedValueOnce(rateLimitError) // Key 1, Attempt 2 on key (overall attempt 2) -> hits MAX_RETRIES_PER_KEY
      .mockResolvedValue({ response: { text: () => 'Success on key 2' } }); // Key 2, (overall attempt 3)

    const prompt = 'Test prompt for rate limit';
    await geminiClientInstance.generateContent(prompt);

    // Logs for Key 1 failures
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining(`Error with key ...${MOCK_API_KEY_1.slice(-4)} (Attempt 1)`),
      expect.objectContaining({ message: rateLimitError.message, status: 429 })
    );
    expect(loggerWarnSpy).toHaveBeenCalledWith( // Because _updateKeyStats logs warning for rate limit
        'GeminiClient',
        expect.stringContaining(`Key ending ...${MOCK_API_KEY_1.slice(-4)} marked as rate limited`),
        // undefined // No data object for this specific log
    );
     expect(loggerErrorSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining(`Error with key ...${MOCK_API_KEY_1.slice(-4)} (Attempt 2)`),
      expect.objectContaining({ message: rateLimitError.message, status: 429 })
    );
    expect(loggerWarnSpy).toHaveBeenCalledWith( // Called again for the second 429 on key 1
        'GeminiClient',
        expect.stringContaining(`Key ending ...${MOCK_API_KEY_1.slice(-4)} marked as rate limited`),
    );
    expect(loggerWarnSpy).toHaveBeenCalledWith(
        'GeminiClient',
        expect.stringContaining(`Max retries (${MAX_RETRIES_PER_KEY}) on key ...${MOCK_API_KEY_1.slice(-4)}. Trying next key.`),
        undefined
    );

    // Logs for Key 2 success
     expect(loggerInfoSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining('Attempt 3/'), // Attempt 3 overall
      undefined
    );
    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining(`API call succeeded with model ${geminiClientInstance.getModelConfig().model} using key ...${MOCK_API_KEY_2.slice(-4)}`),
      undefined
    );
    
    expect(GoogleGenerativeAI).toHaveBeenCalledWith(MOCK_API_KEY_1); // Key 1 was tried
    expect(GoogleGenerativeAI).toHaveBeenCalledWith(MOCK_API_KEY_2); // Key 2 was tried
    expect(mockGenerateContentFn).toHaveBeenCalledTimes(3);
  });

  it('should log all attempts failing if all keys are rate-limited', async () => {
    const rateLimitError = new Error('Mocked Persistent Rate Limit');
    rateLimitError.status = 429;
    mockGenerateContentFn = jest.fn().mockRejectedValue(rateLimitError);

    const prompt = 'Test for all keys failing';
    await expect(geminiClientInstance.generateContent(prompt)).rejects.toThrow(
      expect.objectContaining({ message: expect.stringContaining('All API keys are rate limited or attempts exhausted') })
    );

    // Check logs for multiple attempts and errors
    // Total error logs should be OVERALL_MAX_ATTEMPTS
    expect(loggerErrorSpy).toHaveBeenCalledTimes(OVERALL_MAX_ATTEMPTS); 
    // Each key gets MAX_RETRIES_PER_KEY attempts before forcing rotation
    // MOCK_API_KEY_1 attempts:
    expect(loggerErrorSpy).toHaveBeenCalledWith('GeminiClient', expect.stringContaining(`Error with key ...${MOCK_API_KEY_1.slice(-4)} (Attempt 1)`), expect.anything());
    expect(loggerErrorSpy).toHaveBeenCalledWith('GeminiClient', expect.stringContaining(`Error with key ...${MOCK_API_KEY_1.slice(-4)} (Attempt 2)`), expect.anything());
    // MOCK_API_KEY_2 attempts:
    expect(loggerErrorSpy).toHaveBeenCalledWith('GeminiClient', expect.stringContaining(`Error with key ...${MOCK_API_KEY_2.slice(-4)} (Attempt 3)`), expect.anything());
    expect(loggerErrorSpy).toHaveBeenCalledWith('GeminiClient', expect.stringContaining(`Error with key ...${MOCK_API_KEY_2.slice(-4)} (Attempt 4)`), expect.anything());
    // ...and so on up to OVERALL_MAX_ATTEMPTS
    
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining(`All ${OVERALL_MAX_ATTEMPTS} attempts failed. Last error:`),
      undefined
    );
  });

  it('should log invalid API key error and put key on long cooldown', async () => {
    const invalidKeyError = new Error('API key not valid. Please pass a valid API key.');
    invalidKeyError.status = 400; // As per Gemini's behavior for invalid keys

    mockGenerateContentFn = jest.fn()
      .mockRejectedValueOnce(invalidKeyError) // Key 1 fails (invalid)
      .mockResolvedValue({ response: { text: () => 'Success on key 2' } }); // Key 2 succeeds

    await geminiClientInstance.generateContent('Test invalid key');

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining(`Error with key ...${MOCK_API_KEY_1.slice(-4)} (Attempt 1)`),
      expect.objectContaining({ message: invalidKeyError.message, status: 400 })
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith( // from _updateKeyStats
        'GeminiClient',
        expect.stringContaining(`Key ending ...${MOCK_API_KEY_1.slice(-4)} reported as invalid. Cooldown for 24hrs.`),
        undefined
    );
    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'GeminiClient',
      expect.stringContaining(`API call succeeded with model ${geminiClientInstance.getModelConfig().model} using key ...${MOCK_API_KEY_2.slice(-4)}`),
      undefined
    );

    // Check that key 1 is on a long cooldown
    const key1Stats = geminiClientInstance.keyStats.get(MOCK_API_KEY_1);
    expect(key1Stats.rateLimitedUntil).toBeGreaterThan(Date.now() + 23 * 60 * 60 * 1000); // approx 24hr
  });

  it('should log model updates', () => {
    const newModel = 'gemini-1.5-pro';
    geminiClientInstance.updateModel(newModel);
    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'GeminiClient',
      `Gemini model updated to: ${newModel}`,
      undefined
    );

    geminiClientInstance.updateModel('invalid-model-name');
    expect(loggerWarnSpy).toHaveBeenCalledWith(
      'GeminiClient',
      `Attempted to update to invalid model: invalid-model-name. Keeping ${newModel}.`,
      undefined
    );
  });
});
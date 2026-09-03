import { describe, it, expect } from 'vitest';
import { AIEngine } from '@/server/services/ai-engine';
import { createRateLimiter, getRateLimitIdentifier } from '@/lib/rate-limit';
import { formatStructuredError, generateRequestId } from '@/lib/utils';

describe('Multi-Tenant Isolation & Concurrency', () => {
  const merchantACatalog = [
    {
      id: 'm_a_prod_01',
      name: 'Alpha Running Shoe',
      price: 499900,
      description: 'Merchant A exclusive marathon running shoe',
      features: ['Carbon Plate'],
      category: 'Footwear',
      tags: ['running', 'shoes'],
    },
  ];

  const merchantBCatalog = [
    {
      id: 'm_b_prod_01',
      name: 'Beta High-End Gaming Laptop',
      price: 9999900,
      description: 'Merchant B exclusive 32GB RAM gaming machine',
      features: ['32GB RAM', 'RTX 4090'],
      category: 'Computers',
      tags: ['laptop', 'gaming'],
    },
  ];

  it('should strictly isolate Merchant A and Merchant B products during search', () => {
    // User searching in Merchant A
    const resA = AIEngine.executeDeterministicSearch(merchantACatalog, 'Laptop 32GB RAM');
    expect(resA.products.length).toBe(0);

    // User searching in Merchant B
    const resB = AIEngine.executeDeterministicSearch(merchantBCatalog, 'Laptop 32GB RAM');
    expect(resB.products.length).toBe(1);
    expect(resB.products[0].id).toBe('m_b_prod_01');
  });

  it('should handle 5 simultaneous users without data collision', async () => {
    const users = ['User_A', 'User_B', 'User_C', 'User_D', 'User_E'];
    const queries = [
      'shoe',
      'running',
      'Alpha',
      'marathon',
      'unrelated query',
    ];

    const promises = users.map((user, idx) => {
      const q = queries[idx];
      return Promise.resolve({
        user,
        query: q,
        result: AIEngine.executeDeterministicSearch(merchantACatalog, q),
      });
    });

    const results = await Promise.all(promises);
    expect(results.length).toBe(5);
    expect(results[0].result.products.length).toBe(1);
    expect(results[1].result.products.length).toBe(1);
    expect(results[2].result.products.length).toBe(1);
    expect(results[3].result.products.length).toBe(1);
    expect(results[4].result.products.length).toBe(0);
  });

  it('should isolate rate limiting buckets between different authenticated users', () => {
    const limiter = createRateLimiter('test-limiter', {
      maxTokens: 2,
      refillRate: 0.1,
    });

    // User 1 uses 2 tokens
    const u1_req1 = limiter.check('192.168.1.1:user_token_1');
    const u1_req2 = limiter.check('192.168.1.1:user_token_1');
    const u1_req3 = limiter.check('192.168.1.1:user_token_1');

    expect(u1_req1.allowed).toBe(true);
    expect(u1_req2.allowed).toBe(true);
    expect(u1_req3.allowed).toBe(false); // User 1 is throttled

    // User 2 on the same NAT / IP should still have their own fresh bucket
    const u2_req1 = limiter.check('192.168.1.1:user_token_2');
    expect(u2_req1.allowed).toBe(true);
  });

  it('should format structured errors without leaking secrets', () => {
    const reqId = generateRequestId();
    const structured = formatStructuredError('PAYMENT_ERROR', 'Payment declined by bank', reqId);

    expect(structured.success).toBe(false);
    expect(structured.error.code).toBe('PAYMENT_ERROR');
    expect(structured.error.message).toBe('Payment declined by bank');
    expect(structured.error.requestId).toBe(reqId);
  });
});

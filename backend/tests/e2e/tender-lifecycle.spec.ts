
import { test, expect } from '@playwright/test';

/**
 * 🧪 E2E Test: Complete Tender Lifecycle
 * Tests the entire flow from tender creation to award
 */

test.describe('Tender Lifecycle - Critical Flow', () => {
  let buyerToken: string;
  let supplierToken: string;
  let tenderId: string;
  let offerId: string;

  test.beforeAll(async ({ request }) => {
    // Login as buyer
    const buyerLogin = await request.post('/api/auth/login', {
      data: {
        email: 'buyer@mynet.tn',
        password: 'buyer123'
      }
    });
    const buyerData = await buyerLogin.json();
    buyerToken = buyerData.accessToken;

    // Login as supplier
    const supplierLogin = await request.post('/api/auth/login', {
      data: {
        email: 'supplier@mynet.tn',
        password: 'supplier123'
      }
    });
    const supplierData = await supplierLogin.json();
    supplierToken = supplierData.accessToken;
  });

  test('1. Buyer creates and publishes tender', async ({ request }) => {
    // Create tender
    const createResponse = await request.post('/api/procurement/tenders', {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        title: 'E2E Test Tender - Playwright',
        description: 'Automated E2E test tender',
        category: 'Services',
        budget_min: 5000,
        budget_max: 10000,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        opening_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    });

    expect(createResponse.ok()).toBeTruthy();
    const tender = await createResponse.json();
    tenderId = tender.id;

    // Publish tender
    const publishResponse = await request.post(`/api/procurement/tenders/${tenderId}/publish`, {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      }
    });

    expect(publishResponse.ok()).toBeTruthy();
  });

  test('2. Supplier views tender and submits offer', async ({ request }) => {
    // View tender
    const viewResponse = await request.get(`/api/procurement/tenders/${tenderId}`, {
      headers: {
        'Authorization': `Bearer ${supplierToken}`
      }
    });

    expect(viewResponse.ok()).toBeTruthy();

    // Submit offer
    const offerResponse = await request.post('/api/procurement/offers', {
      headers: {
        'Authorization': `Bearer ${supplierToken}`
      },
      data: {
        tender_id: tenderId,
        total_amount: 7500,
        delivery_time: '30 days',
        technical_proposal: 'E2E test technical proposal',
        financial_proposal: 'Competitive pricing'
      }
    });

    expect(offerResponse.ok()).toBeTruthy();
    const offer = await offerResponse.json();
    offerId = offer.id;
  });

  test('3. Buyer evaluates and awards tender', async ({ request }) => {
    // Evaluate offer
    const evaluateResponse = await request.post(`/api/procurement/offers/${offerId}/evaluate`, {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        technical_score: 85,
        financial_score: 90,
        notes: 'Good proposal - E2E test'
      }
    });

    expect(evaluateResponse.ok()).toBeTruthy();

    // Award tender
    const awardResponse = await request.post('/api/procurement/tender-management/award', {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      data: {
        tender_id: tenderId,
        winning_offer_id: offerId
      }
    });

    expect(awardResponse.ok()).toBeTruthy();
  });

  test('4. Verify tender status is awarded', async ({ request }) => {
    const response = await request.get(`/api/procurement/tenders/${tenderId}`, {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      }
    });

    const tender = await response.json();
    expect(tender.status).toBe('awarded');
  });
});

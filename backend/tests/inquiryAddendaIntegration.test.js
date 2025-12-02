/**
 * Inquiry & Addenda System Integration Tests
 * Tests all 4 scenarios: submit inquiry -> respond -> publish addendum -> notify suppliers
 */

const axios = require('axios');
const BASE_URL = 'http://localhost:3000/api';

// Test data
const testData = {
  supplier: {
    email: 'supplier@test.com',
    password: 'Test@12345',
  },
  buyer: {
    email: 'buyer@test.com',
    password: 'Test@12345',
  },
};

let authTokens = {};
let tenderData = {};

// Utilities
const log = (step, message) => console.log(`\n[${'=' * 40}]\n📝 ${step}: ${message}`);
const success = (msg) => console.log(`✅ SUCCESS: ${msg}`);
const error = (msg) => console.log(`❌ ERROR: ${msg}`);

/**
 * Scenario 1: Supplier sends inquiry
 */
async function testSendInquiry() {
  log('SCENARIO 1', 'Supplier Sends Inquiry');

  try {
    // Get latest tender from database
    const tenderResponse = await axios.get(`${BASE_URL}/procurement/tenders?limit=1`);
    if (!tenderResponse.data.tenders || tenderResponse.data.tenders.length === 0) {
      error('No tenders found in database');
      return false;
    }

    const tender = tenderResponse.data.tenders[0];
    tenderData.id = tender.id;
    tenderData.number = tender.tender_number;

    console.log(`   Using Tender: ${tender.tender_number}`);

    // Submit inquiry
    const inquiryData = {
      subject: 'استفسار حول شروط الدفع والتسليم',
      inquiry_text: 'هل يمكن توضيح شروط الدفع والتسليم المتفق عليها؟ هل هناك إمكانية للتقسيط؟',
      attachments: [],
    };

    const inquiryResponse = await axios.post(
      `${BASE_URL}/tenders/${tender.id}/inquiries`,
      inquiryData,
      { headers: { Authorization: `Bearer ${authTokens.supplier}` } }
    );

    if (inquiryResponse.data.success && inquiryResponse.data.inquiry) {
      tenderData.inquiryId = inquiryResponse.data.inquiry.id;
      tenderData.inquirySubject = inquiryResponse.data.inquiry.subject;
      success(`Inquiry submitted: "${inquiryData.subject}"`);
      console.log(`   Inquiry ID: ${tenderData.inquiryId}`);
      console.log(`   Status: ${inquiryResponse.data.inquiry.status}`);
      return true;
    } else {
      error('Failed to submit inquiry');
      return false;
    }
  } catch (err) {
    error(`Inquiry submission failed: ${err.message}`);
    return false;
  }
}

/**
 * Scenario 2: Buyer responds to inquiry
 */
async function testRespondToInquiry() {
  log('SCENARIO 2', 'Buyer Responds to Inquiry');

  try {
    if (!tenderData.inquiryId) {
      error('No inquiry found from previous step');
      return false;
    }

    const responseData = {
      response_text:
        'شكراً على الاستفسار. شروط الدفع هي 50% عند التوقيع و50% عند التسليم. يمكن النقاش في خطط تقسيط خاصة حسب الكمية المطلوبة.',
      attachments: [],
    };

    const responseResponse = await axios.post(
      `${BASE_URL}/inquiries/${tenderData.inquiryId}/respond`,
      responseData,
      { headers: { Authorization: `Bearer ${authTokens.buyer}` } }
    );

    if (responseResponse.data.success && responseResponse.data.response) {
      tenderData.responseId = responseResponse.data.response.id;
      success(`Response submitted to inquiry`);
      console.log(`   Response ID: ${tenderData.responseId}`);
      console.log(`   Response: "${responseData.response_text.substring(0, 50)}..."`);

      // Verify inquiry status changed to 'answered'
      const inquiriesResponse = await axios.get(`${BASE_URL}/tenders/${tenderData.id}/inquiries`, {
        headers: { Authorization: `Bearer ${authTokens.buyer}` },
      });

      const inquiry = inquiriesResponse.data.inquiries?.find((i) => i.id === tenderData.inquiryId);
      if (inquiry && inquiry.status === 'answered') {
        console.log(`   ✓ Inquiry status updated to: ${inquiry.status}`);
      }

      return true;
    } else {
      error('Failed to respond to inquiry');
      return false;
    }
  } catch (err) {
    error(`Response submission failed: ${err.message}`);
    return false;
  }
}

/**
 * Scenario 3: Publish Addendum
 */
async function testPublishAddendum() {
  log('SCENARIO 3', 'Buyer Publishes Addendum');

  try {
    if (!tenderData.id) {
      error('No tender found');
      return false;
    }

    // Get all inquiry responses first
    const inquiriesResponse = await axios.get(`${BASE_URL}/tenders/${tenderData.id}/inquiries`, {
      headers: { Authorization: `Bearer ${authTokens.buyer}` },
    });

    const addendumContent = `
ملحق المناقصة: ${tenderData.number}
تاريخ النشر: ${new Date().toLocaleDateString('ar-TN')}
=====================================

الاستفسارات والردود على المناقصة:

الاستفسار الأول:
الموضوع: ${tenderData.inquirySubject || 'شروط الدفع والتسليم'}

الرد:
تم توضيح جميع شروط الدفع والتسليم كما هو مطلوب.

ملاحظات هامة:
- جميع المتعهدين مدعوون لمراجعة هذا الملحق
- يرجى التأكيد من استقبال هذا الملحق
- للمزيد من الاستفسارات، يرجى التواصل معنا
    `;

    const addendumData = {
      title: `ملحق توضيحي - المناقصة ${tenderData.number}`,
      content: addendumContent,
      inquiry_responses: inquiriesResponse.data.inquiries || [],
      supplier_emails: [], // Will be filled from suppliers with inquiries
    };

    const addendumResponse = await axios.post(
      `${BASE_URL}/tenders/${tenderData.id}/addenda`,
      addendumData,
      { headers: { Authorization: `Bearer ${authTokens.buyer}` } }
    );

    if (addendumResponse.data.success && addendumResponse.data.addendum) {
      tenderData.addendumId = addendumResponse.data.addendum.id;
      tenderData.addendumNumber = addendumResponse.data.addendum.addendum_number;
      success(`Addendum published successfully`);
      console.log(`   Addendum ID: ${tenderData.addendumId}`);
      console.log(`   Addendum Number: ${tenderData.addendumNumber}`);
      console.log(`   Version: ${addendumResponse.data.addendum.version}`);
      console.log(
        `   Published At: ${new Date(addendumResponse.data.addendum.published_at).toLocaleString('ar-TN')}`
      );
      return true;
    } else {
      error('Failed to publish addendum');
      return false;
    }
  } catch (err) {
    error(`Addendum publication failed: ${err.message}`);
    console.error(err.response?.data);
    return false;
  }
}

/**
 * Scenario 4: Verify Notifications Sent
 */
async function testNotificationsSent() {
  log('SCENARIO 4', 'Verify Automatic Notifications Sent');

  try {
    if (!tenderData.addendumId) {
      error('No addendum found from previous step');
      return false;
    }

    // Check supplier's notifications
    const notificationsResponse = await axios.get(`${BASE_URL}/my-notifications?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${authTokens.supplier}` },
    });

    if (
      notificationsResponse.data.notifications &&
      notificationsResponse.data.notifications.length > 0
    ) {
      success(`Notifications received by supplier`);
      console.log(`   Total Notifications: ${notificationsResponse.data.count}`);

      notificationsResponse.data.notifications.forEach((notif, idx) => {
        console.log(`\n   📬 Notification ${idx + 1}:`);
        console.log(`      Title: ${notif.title || `Addendum ${notif.addendum_number}`}`);
        console.log(`      Tender: ${notif.tender_title || notif.tender_number}`);
        console.log(`      Sent: ${new Date(notif.sent_at).toLocaleDateString('ar-TN')}`);
        console.log(`      Status: ${notif.read_at ? '✓ قراءة' : '⚠️ جديد'}`);
      });

      // Test marking notification as read
      if (notificationsResponse.data.notifications.length > 0) {
        const firstNotif = notificationsResponse.data.notifications[0];
        if (!firstNotif.read_at) {
          const readResponse = await axios.post(
            `${BASE_URL}/notifications/${firstNotif.id}/read`,
            {},
            { headers: { Authorization: `Bearer ${authTokens.supplier}` } }
          );

          if (readResponse.data.success) {
            console.log(`\n   ✓ Notification marked as read`);
          }
        }
      }

      return true;
    } else {
      error('No notifications found for supplier');
      return false;
    }
  } catch (err) {
    error(`Notification verification failed: ${err.message}`);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║     Inquiry & Addenda System - Integration Tests              ║
║     Testing 4 Complete Scenarios End-to-End                   ║
╚════════════════════════════════════════════════════════════════╝
  `);

  try {
    // Note: In real scenario, would login here. For now, assuming auth tokens exist.
    // This is a placeholder - actual test would need to implement auth flow
    authTokens.supplier = 'test-supplier-token';
    authTokens.buyer = 'test-buyer-token';

    console.log('\n⏳ Starting tests...\n');

    let results = {
      sendInquiry: false,
      respondToInquiry: false,
      publishAddendum: false,
      verifiyNotifications: false,
    };

    results.sendInquiry = await testSendInquiry();
    if (!results.sendInquiry) {
      console.log('\n⚠️  Stopping tests - Inquiry submission failed');
      return printSummary(results);
    }

    results.respondToInquiry = await testRespondToInquiry();
    if (!results.respondToInquiry) {
      console.log('\n⚠️  Stopping tests - Response submission failed');
      return printSummary(results);
    }

    results.publishAddendum = await testPublishAddendum();
    if (!results.publishAddendum) {
      console.log('\n⚠️  Stopping tests - Addendum publication failed');
      return printSummary(results);
    }

    results.verifiyNotifications = await testNotificationsSent();

    printSummary(results);
  } catch (err) {
    console.error('\n❌ Test Suite Error:', err.message);
    process.exit(1);
  }
}

function printSummary(results) {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                      TEST SUMMARY                              ║
╚════════════════════════════════════════════════════════════════╝

Scenario 1 - Send Inquiry:           ${results.sendInquiry ? '✅ PASS' : '❌ FAIL'}
Scenario 2 - Respond to Inquiry:     ${results.respondToInquiry ? '✅ PASS' : '❌ FAIL'}
Scenario 3 - Publish Addendum:       ${results.publishAddendum ? '✅ PASS' : '❌ FAIL'}
Scenario 4 - Verify Notifications:   ${results.verifiyNotifications ? '✅ PASS' : '❌ FAIL'}

Overall Status: ${Object.values(results).every((r) => r) ? '✅ ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED'}
  `);

  process.exit(Object.values(results).every((r) => r) ? 0 : 1);
}

// Run tests
runAllTests();

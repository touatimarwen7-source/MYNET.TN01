// ============ Draft Storage & Auto-save Helper ============

const DRAFT_STORAGE_KEY = 'mynet_draft_';
const DRAFT_TIMESTAMP_KEY = 'mynet_draft_timestamp_';
const DRAFT_EXPIRY_DAYS = 7;

/**
 * 💾 Auto-save draft to localStorage
 * @param {string} draftKey - Unique key for this draft (e.g., 'tender_draft_123')
 * @param {object} data - Form data to save
 */
export const autosaveDraft = (draftKey, data) => {
  try {
    if (!draftKey || !data) return;
    const storageKey = `${DRAFT_STORAGE_KEY}${draftKey}`;
    const timestampKey = `${DRAFT_TIMESTAMP_KEY}${draftKey}`;
    
    localStorage.setItem(storageKey, JSON.stringify(data));
    localStorage.setItem(timestampKey, new Date().toISOString());
  } catch (err) {
    // Silently fail - don't break user experience
  }
};

/**
 * 📥 Recover draft from localStorage
 * @param {string} draftKey - Unique key for this draft
 * @returns {object|null} Saved draft data or null if not found/expired
 */
export const recoverDraft = (draftKey) => {
  try {
    if (!draftKey) return null;
    const storageKey = `${DRAFT_STORAGE_KEY}${draftKey}`;
    const timestampKey = `${DRAFT_TIMESTAMP_KEY}${draftKey}`;
    
    const savedData = localStorage.getItem(storageKey);
    const savedTimestamp = localStorage.getItem(timestampKey);
    
    if (!savedData) return null;
    
    // Check if draft is expired
    if (savedTimestamp) {
      const savedDate = new Date(savedTimestamp);
      const expiryDate = new Date(savedDate.getTime() + DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      if (new Date() > expiryDate) {
        clearDraft(draftKey);
        return null;
      }
    }
    
    return JSON.parse(savedData);
  } catch (err) {
    // Silently fail - return null for expired/corrupted drafts
    return null;
  }
};

/**
 * 🗑️ Clear draft from localStorage
 * @param {string} draftKey - Unique key for this draft
 */
export const clearDraft = (draftKey) => {
  try {
    if (!draftKey) return;
    const storageKey = `${DRAFT_STORAGE_KEY}${draftKey}`;
    const timestampKey = `${DRAFT_TIMESTAMP_KEY}${draftKey}`;
    
    localStorage.removeItem(storageKey);
    localStorage.removeItem(timestampKey);
  } catch (err) {
    // Silently fail
  }
};

/**
 * ⏱️ Set up auto-save interval hook
 * @param {string} draftKey - Unique key for this draft
 * @param {object} data - Form data to auto-save
 * @param {number} intervalMs - Interval in milliseconds (default: 30s)
 */
export const useAutoSave = (draftKey, data, intervalMs = 30000) => {
  React.useEffect(() => {
    const timer = setInterval(() => {
      autosaveDraft(draftKey, data);
    }, intervalMs);
    
    return () => clearInterval(timer);
  }, [draftKey, data]);
};

/**
 * 📋 Get all available drafts metadata
 * @returns {array} Array of draft metadata {key, timestamp, size}
 */
export const getAllDrafts = () => {
  try {
    const drafts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(DRAFT_STORAGE_KEY)) {
        const draftKey = key.replace(DRAFT_STORAGE_KEY, '');
        const timestampKey = `${DRAFT_TIMESTAMP_KEY}${draftKey}`;
        const timestamp = localStorage.getItem(timestampKey);
        const data = localStorage.getItem(key);
        
        drafts.push({
          key: draftKey,
          timestamp: timestamp ? new Date(timestamp) : null,
          size: data ? data.length : 0
        });
      }
    }
    return drafts;
  } catch (err) {
    return [];
  }
};

export default {
  autosaveDraft,
  recoverDraft,
  clearDraft,
  useAutoSave,
  getAllDrafts
};

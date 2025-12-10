import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to manage the state and logic of the secure bid submission form.
 * @returns {Object} The state and handlers for the bid form.
 */
export const useBidForm = () => {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tender, setTender] = useState(null);
  const [bidData, setBidData] = useState({
    supplierReference: '',
    validityPeriod: 90,
    paymentTerms: 'Net 30',
    lineItemResponses: [],
    attachments: [],
  });
  const [loading, setLoading] = useState(true);
  import procurementAPI from '../api/procurementApi';
  import bidAPI from '../api/bidApi';
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch tender details on component mount
  useEffect(() => {
    const fetchTenderData = async () => {
      try {
        setLoading(true);
        const response = await procurementAPI.getTender(tenderId);
        setTender(response.data);

        // Initialize line item responses based on tender items
        const initialResponses = response.data.items.map((item) => ({
          tenderItemId: item.id,
          unitPrice: '',
          deliveryTime: '',
          // ... other response fields
        }));
        setBidData((prev) => ({ ...prev, lineItemResponses: initialResponses }));
      } catch (error) {
        setErrors({ general: "Erreur lors du chargement de l'appel d'offres." });
      } finally {
        setLoading(false);
      }
    };

    fetchTenderData();
  }, [tenderId]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setBidData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLineItemChange = useCallback((index, field, value) => {
    setBidData((prev) => {
      const updatedResponses = [...prev.lineItemResponses];
      updatedResponses[index][field] = value;
      return { ...prev, lineItemResponses: updatedResponses };
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // 1. Validate core bid data
    if (!bidData.validityPeriod || bidData.validityPeriod <= 0) {
      newErrors.validityPeriod = 'La période de validité doit être un nombre positif.';
    }
    if (!bidData.paymentTerms || bidData.paymentTerms.trim() === '') {
      newErrors.paymentTerms = 'Les conditions de paiement sont requises.';
    }

    // 2. Validate each line item response
    const lineItemErrors = [];
    bidData.lineItemResponses.forEach((item, index) => {
      const itemErrors = {};
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
        itemErrors.unitPrice = 'Le prix unitaire est requis et doit être positif.';
      }
      if (Object.keys(itemErrors).length > 0) {
        lineItemErrors[index] = itemErrors;
      }
    });

    if (lineItemErrors.length > 0) {
      newErrors.lineItemResponses = lineItemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      // --- 🔒 Client-Side Encryption Logic Starts Here ---
      // In a real-world scenario, you would use a library like `crypto-js` or the Web Crypto API.
      // 1. Isolate sensitive data (prices, specific terms).
      const sensitiveData = {
        lineItemResponses: bidData.lineItemResponses.map((item) => ({
          tenderItemId: item.tenderItemId,
          unitPrice: item.unitPrice, // This field is sensitive
        })),
        // Add any other sensitive fields here
      };

      // 2. Encrypt the sensitive data payload using the buyer's public key (fetched earlier).
      // const buyersPublicKey = '-----BEGIN PUBLIC KEY...';
      // const encryptedPayload = encryptWithPublicKey(JSON.stringify(sensitiveData), buyersPublicKey);

      // 3. Prepare FormData for submission, sending the encrypted part separately.
      const formData = new FormData();
      formData.append('tenderId', tenderId);
      // formData.append('encryptedPayload', encryptedPayload);
      formData.append(
        'nonSensitivePayload',
        JSON.stringify({
          supplierReference: bidData.supplierReference,
          paymentTerms: bidData.paymentTerms,
        })
      );
      // Append file attachments...
      await bidAPI.submitBid(formData);
      navigate(`/tenders/${tenderId}/submission-success`);
    } catch (error) {
      setErrors({ general: error.message || 'Une erreur est survenue lors de la soumission.' });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    tender,
    bidData,
    loading,
    submitting,
    errors,
    handleInputChange,
    handleLineItemChange,
    handleSubmit,
  };
};

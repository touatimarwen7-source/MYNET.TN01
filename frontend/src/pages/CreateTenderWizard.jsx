import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TenderFormLayout from '../components/TenderSteps/TenderFormLayout';
import TenderStepRenderer from '../components/TenderSteps/TenderStepRenderer';
import { procurementAPI } from '../api';
import {
  recoverDraft,
  clearDraft,
  autosaveDraft,
  AUTOSAVE_INTERVAL,
} from '../utils/draftStorageHelper';

const DRAFT_KEY = 'tender_draft';
const TOTAL_STEPS = 6; // Étapes de 0 à 6 (7 étapes au total)

const CreateTenderWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    consultation_number: '',
    title: '',
    description: '',
    category: '',
    is_public: true,
    publication_date: '',
    deadline: '',
    opening_date: '',
    budget_min: 0,
    budget_max: 0,
    currency: 'TND',
    awardLevel: 'lot',
    lots: [],
    requirements: [],
    evaluation_criteria: {
      price: 0,
      quality: 0,
      delivery: 0,
      experience: 0
    },
    specification_documents: [],
    contact_person: '',
    contact_email: '',
    contact_phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showExit, setShowExit] = useState(false);

  // تحميل المسودة عند بدء تشغيل المكون
  useEffect(() => {
    const savedDraft = recoverDraft(DRAFT_KEY); // ✅ استخدام الدالة الصحيحة
    if (savedDraft && Object.keys(savedDraft).length > 0) {
      if (window.confirm('تم العثور على مسودة غير مكتملة. هل تريد متابعتها؟')) {
        setFormData(savedDraft);
      } else {
        clearDraft(DRAFT_KEY);
      }
    }
  }, []);

  // **تطبيق الحفظ التلقائي**
  useEffect(() => {
    const timer = setInterval(() => {
      // لا تقم بالحفظ إذا كان النموذج فارغًا
      if (Object.keys(formData).length > 0) {
        autosaveDraft(DRAFT_KEY, formData); // ✅ استخدام الدالة الصحيحة
        console.log('Autosaved draft at', new Date().toLocaleTimeString());
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Gérer les champs imbriqués (ex: evaluation_criteria.price)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  }, []);

  const handleNext = () => {
    // يمكنك إضافة منطق التحقق من صحة الخطوة هنا
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Send data to backend
      const response = await procurementAPI.createTender(formData);

      // Clear draft after successful submission
      clearDraft(DRAFT_KEY);

      // Redirect to success page or dashboard
      navigate('/tenders', { 
        state: { 
          message: 'Appel d\'offres créé avec succès!',
          tenderId: response.data?.tender?.id
        } 
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Échec de la création de l\'appel d\'offres');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenderFormLayout
      currentStep={currentStep}
      error={error}
      loading={loading}
      handlePrevious={handlePrevious}
      handleNext={handleNext}
      handleSubmit={handleSubmit}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      showExit={showExit}
      setShowExit={setShowExit}
      formData={formData}
      totalCriteria={100} // قيمة وهمية حاليًا
      navigate={navigate}
    >
      <TenderStepRenderer
        currentStep={currentStep}
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        loading={loading}
        totalCriteria={
          Object.values(formData.evaluation_criteria || {}).reduce(
            (sum, val) => sum + (Number(val) || 0),
            0
          )
        }
      />
    </TenderFormLayout>
  );
};

export default CreateTenderWizard;

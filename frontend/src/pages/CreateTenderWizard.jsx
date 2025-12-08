import React, { useState, useEffect, useCallback, Suspense } from 'react';
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
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';

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

  // Error boundary check and component mount logging
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('✅ CreateTenderWizard mounted successfully');
    }
    
    // Validate initial state
    if (!formData) {
      console.error('❌ CreateTenderWizard: formData is undefined');
    }
    
    return () => {
      if (import.meta.env.DEV) {
        console.log('🔄 CreateTenderWizard unmounted');
      }
    };
  }, []);

  // Charger le brouillon au démarrage du composant
  useEffect(() => {
    const savedDraft = recoverDraft(DRAFT_KEY);
    if (savedDraft && Object.keys(savedDraft).length > 0) {
      if (window.confirm('Un brouillon incomplet a été trouvé. Voulez-vous le continuer ?')) {
        setFormData(savedDraft);
      } else {
        clearDraft(DRAFT_KEY);
      }
    }
  }, []);

  // Application de la sauvegarde automatique
  useEffect(() => {
    const timer = setInterval(() => {
      // Ne pas sauvegarder si le formulaire est vide
      if (Object.keys(formData).length > 0) {
        autosaveDraft(DRAFT_KEY, formData);
        console.log('Brouillon sauvegardé automatiquement à', new Date().toLocaleTimeString());
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [formData]);

  const handleChange = useCallback((e) => {
    if (!e || !e.target) {
      console.error('Invalid event object in handleChange');
      return;
    }

    const { name, value, type, checked } = e.target;

    if (!name) {
      console.error('Event target has no name attribute');
      return;
    }

    // Gérer les champs imbriqués (ex: evaluation_criteria.price)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
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
    // Validate current step before proceeding
    setError('');

    // Step 0: Basic info validation
    if (currentStep === 0) {
      if (!formData.title || formData.title.trim().length < 5) {
        setError('Le titre doit contenir au moins 5 caractères');
        return;
      }
      if (!formData.description || formData.description.trim().length < 20) {
        setError('La description doit contenir au moins 20 caractères');
        return;
      }
      if (!formData.category) {
        setError('Veuillez sélectionner une catégorie');
        return;
      }
    }

    // Step 1: Dates validation
    if (currentStep === 1) {
      if (formData.deadline && formData.publication_date) {
        const deadline = new Date(formData.deadline);
        const pubDate = new Date(formData.publication_date);
        if (deadline <= pubDate) {
          setError('La date limite doit être après la date de publication');
          return;
        }
      }
    }

    // Step 4: Evaluation criteria validation
    if (currentStep === 4) {
      const total = Object.values(formData.evaluation_criteria || {}).reduce(
        (sum, val) => sum + (Number(val) || 0),
        0
      );
      if (total !== 100 && total > 0) {
        setError('Le total des critères d\'évaluation doit être égal à 100%');
        return;
      }
    }

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
      if (!formData.title || formData.title.trim().length < 5) {
        throw new Error('Le titre doit contenir au moins 5 caractères');
      }

      if (!formData.description || formData.description.trim().length < 20) {
        throw new Error('La description doit contenir au moins 20 caractères');
      }

      if (!formData.category) {
        throw new Error('Veuillez sélectionner une catégorie');
      }

      // Map and clean data for backend
      const payload = {
        ...formData,
        // Ensure dates are ISO strings or null
        publication_date: formData.publication_date || null,
        deadline: formData.deadline || null,
        opening_date: formData.opening_date || null,
        queries_start_date: formData.queries_start_date || null,
        queries_end_date: formData.queries_end_date || null,

        // Ensure numeric fields
        budget_min: formData.budget_min ? Number(formData.budget_min) : 0,
        budget_max: formData.budget_max ? Number(formData.budget_max) : 0,
        quantity_required: formData.quantity_required ? Number(formData.quantity_required) : null,
        offer_validity_days: formData.offer_validity_days ? Number(formData.offer_validity_days) : 90,

        // Ensure arrays
        lots: Array.isArray(formData.lots) ? formData.lots : [],
        requirements: Array.isArray(formData.requirements) ? formData.requirements : [],
        mandatory_documents: Array.isArray(formData.mandatory_documents) ? formData.mandatory_documents : [],
        specification_documents: Array.isArray(formData.specification_documents) ? formData.specification_documents : [],
        attachments: Array.isArray(formData.attachments) ? formData.attachments : [],

        // Ensure evaluation_criteria is object
        evaluation_criteria: formData.evaluation_criteria || {
          price: 0,
          quality: 0,
          delivery: 0,
          experience: 0
        },

        // Set status as draft initially
        status: 'draft'
      };

      console.log('📤 Submitting tender:', payload);

      // Send data to backend
      const response = await procurementAPI.createTender(payload);

      console.log('✅ Tender created:', response);

      // Clear draft after successful submission
      clearDraft(DRAFT_KEY);

      // Extract tender ID from response
      const tenderId = response?.data?.tender?.id || response?.tender?.id;

      // Redirect to success page or dashboard
      navigate('/buyer/tenders', { 
        state: { 
          message: 'Appel d\'offres créé avec succès!',
          tenderId
        } 
      });
    } catch (err) {
      console.error('❌ Create tender error:', err);

      // Handle database not initialized error
      if (err.response?.status === 503 || err.response?.data?.error?.includes('does not exist')) {
        setError('⚠️ La base de données n\'est pas initialisée. Veuillez exécuter: node backend/scripts/initDb.js');
      } else {
        const errorMessage = err.response?.data?.error || 
                            err.response?.data?.message || 
                            err.message || 
                            'Échec de la création de l\'appel d\'offres';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <ErrorBoundary>
        <Suspense fallback={<Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>}>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom align="center">
                Créer un Nouvel Appel d'Offre
              </Typography>
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
                totalCriteria={
                  Object.values(formData.evaluation_criteria || {}).reduce(
                    (sum, val) => sum + (Number(val) || 0),
                    0
                  )
                }
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
            </Paper>
          </Container>
        </Suspense>
      </ErrorBoundary>
    );
  } catch (renderError) {
    console.error('CreateTenderWizard render error:', renderError);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Erreur de chargement du formulaire</h2>
        <p>{renderError.message}</p>
        <button onClick={() => navigate('/buyer/dashboard')}>
          Retour au tableau de bord
        </button>
      </div>
    );
  }
};

export default CreateTenderWizard;
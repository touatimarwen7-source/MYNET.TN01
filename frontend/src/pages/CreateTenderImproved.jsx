import { useState, useEffect } from 'react';
import axios from 'axios';
import { setPageTitle } from '../utils/pageTitle';

export default function CreateTenderImproved() {
  const [step, setStep] = useState(1);
  const [tenderData, setTenderData] = useState({
    title: '',
    categories: [],
    summary: '',
    budgetMax: 0,
    currency: 'TND',
    documents: [],
    submissionDeadline: '',
    decryptionDate: '',
    questionsStartDate: '',
    questionsEndDate: '',
    bidValidityDays: 90,
    alertSystem: '48',
    items: [],
    weights: { price: 40, compliance: 30, delivery: 20, sustainability: 10 },
    requiredDocuments: [],
    minEligibility: [],
    geographicLocation: '',
    awardType: 'full',
    allowNegotiation: false
  });

  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [documentFiles, setDocumentFiles] = useState([]);

  useEffect(() => {
    setPageTitle('Créer un Appel d\'Offres');
  }, []);

  // Auto-Save tous les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (tenderData.title || tenderData.summary) saveDraft();
    }, 30000);
    return () => clearInterval(interval);
  }, [tenderData]);

  const saveDraft = async () => {
    try {
      setAutoSaveStatus('Sauvegarde en cours...');
      await axios.post('http://localhost:5000/api/procurement/tender-draft', tenderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setAutoSaveStatus('Sauvegardé automatiquement');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    } catch (error) {
      setAutoSaveStatus('✗ Erreur lors de la sauvegarde');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTenderData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (category) => {
    setTenderData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleAddItem = () => {
    setTenderData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 0, unit: 'Unité', specifications: '', unitPrice: 0 }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...tenderData.items];
    newItems[index][field] = value;
    setTenderData(prev => ({ ...prev, items: newItems }));
  };

  const handleWeightChange = (field, value) => {
    setTenderData(prev => ({
      ...prev,
      weights: { ...prev.weights, [field]: parseFloat(value) }
    }));
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocumentFiles([...documentFiles, ...files]);
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!tenderData.title) newErrors.title = "Le titre est requis";
      if (tenderData.categories.length === 0) newErrors.categories = "Choisissez au moins une catégorie";
      if (!tenderData.summary) newErrors.summary = "Le résumé est requis";
    }

    if (step === 2) {
      if (!tenderData.submissionDeadline) newErrors.submissionDeadline = "La date d'expiration est requise";
      if (!tenderData.decryptionDate) newErrors.decryptionDate = "La date d'ouverture est requise";
      if (new Date(tenderData.decryptionDate) <= new Date(tenderData.submissionDeadline)) {
        newErrors.decryptionDate = "La date d'ouverture doit être après la date d'expiration";
      }
      if (!tenderData.questionsEndDate) newErrors.questionsEndDate = "La fin de la période de questions est requise";
    }

    if (step === 3) {
      if (tenderData.items.length === 0) newErrors.items = "Vous devez ajouter au moins un article";
    }

    if (step === 4) {
      if (!tenderData.geographicLocation) newErrors.geographicLocation = "Choisissez une localisation géographique";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      await axios.post('http://localhost:5000/api/procurement/tenders', tenderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert("Appel d'offres créé avec succès et alertes envoyées aux fournisseurs qualifiés");
      setTenderData({
        title: '', categories: [], summary: '', budgetMax: 0, currency: 'TND',
        documents: [], submissionDeadline: '', decryptionDate: '',
        questionsStartDate: '', questionsEndDate: '', bidValidityDays: 90,
        alertSystem: '48', items: [], weights: { price: 40, compliance: 30, delivery: 20, sustainability: 10 },
        requiredDocuments: [], minEligibility: [], geographicLocation: '',
        awardType: 'full', allowNegotiation: false
      });
      setStep(1);
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  const categories = ['Fournitures', 'Services', 'Construction', 'Conseil', 'Maintenance'];
  const units = ['Unité', 'kg', 'Tonne', 'Heure', 'Jour', 'Pièce'];

  return (
    <div className="create-tender-professional">
      <h1>📑 Créer un Appel d'Offres Professionnel</h1>

      {/* Barre de Progression */}
      <div className="progress-steps">
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className={`step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
            {s}. {['Données', 'Calendrier', 'Articles', 'Éligibilité', 'Révision'][s - 1]}
          </div>
        ))}
      </div>

      {autoSaveStatus && (
        <div className={`auto-save-status ${autoSaveStatus.includes('✓') ? 'success' : 'error'}`}>
          {autoSaveStatus}
        </div>
      )}

      {/* Étape 1: Données Basiques */}
      {step === 1 && (
        <div className="step-content">
          <h2>Étape 1: Données Basiques et Classification</h2>

          <div className="form-group">
            <label>Titre de l'Appel d'Offres *</label>
            <input
              type="text"
              name="title"
              value={tenderData.title}
              onChange={handleInputChange}
              placeholder="Exemple: Acquisition de serveurs cloud Enterprise"
              maxLength="200"
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Catégories d'Achat * (Choisissez une ou plusieurs)</label>
            <div className="checkbox-group">
              {categories.map(cat => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    checked={tenderData.categories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
            {errors.categories && <span className="error">{errors.categories}</span>}
          </div>

          <div className="form-group">
            <label>Résumé de l'Appel d'Offres *</label>
            <textarea
              name="summary"
              value={tenderData.summary}
              onChange={handleInputChange}
              placeholder="Description brève des exigences du projet et du périmètre"
              rows={4}
            />
            {errors.summary && <span className="error">{errors.summary}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Budget Estimé (Optionnel)</label>
              <input
                type="number"
                name="budgetMax"
                value={tenderData.budgetMax}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Devise</label>
              <select name="currency" value={tenderData.currency} onChange={handleInputChange}>
                <option value="TND">د.ت (Dinar Tunisien)</option>
                <option value="USD">$ (Dollar Américain)</option>
                <option value="EUR">€ (Euro)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Documents Généraux (Optionnel)</label>
            <input type="file" multiple onChange={handleDocumentUpload} />
            <p className="help-text">Formats supportés: PDF, DOCX, Excel</p>
            {documentFiles.length > 0 && (
              <ul className="file-list">
                {documentFiles.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Étape 2: Calendrier et Dates */}
      {step === 2 && (
        <div className="step-content">
          <h2>Étape 2: Calendrier et Dates Critiques</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Date d'Expiration (Dernière date de soumission) *</label>
              <input
                type="datetime-local"
                name="submissionDeadline"
                value={tenderData.submissionDeadline}
                onChange={handleInputChange}
              />
              {errors.submissionDeadline && <span className="error">{errors.submissionDeadline}</span>}
            </div>

            <div className="form-group">
              <label>Date d'Ouverture (Déchiffrement) *</label>
              <input
                type="datetime-local"
                name="decryptionDate"
                value={tenderData.decryptionDate}
                onChange={handleInputChange}
              />
              {errors.decryptionDate && <span className="error">{errors.decryptionDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Début de la Période de Questions *</label>
              <input
                type="datetime-local"
                name="questionsStartDate"
                value={tenderData.questionsStartDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Fin de la Période de Questions *</label>
              <input
                type="datetime-local"
                name="questionsEndDate"
                value={tenderData.questionsEndDate}
                onChange={handleInputChange}
              />
              {errors.questionsEndDate && <span className="error">{errors.questionsEndDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Validité de l'Offre (en jours)</label>
              <input
                type="number"
                name="bidValidityDays"
                value={tenderData.bidValidityDays}
                onChange={handleInputChange}
                min="30"
                max="365"
              />
            </div>

            <div className="form-group">
              <label>Système de Notifications</label>
              <select name="alertSystem" value={tenderData.alertSystem} onChange={handleInputChange}>
                <option value="24">Alerte 24 heures avant</option>
                <option value="48">Alerte 48 heures avant</option>
                <option value="72">Alerte 72 heures avant</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Étape 3: Articles et Spécifications */}
      {step === 3 && (
        <div className="step-content">
          <h2>Étape 3: Articles et Spécifications</h2>

          <button onClick={handleAddItem} className="btn-add-item">
            Ajouter un Article
          </button>

          {tenderData.items.map((item, idx) => (
            <div key={idx} className="item-section">
              <h4>Article {idx + 1}</h4>

              <div className="form-row">
                <div className="form-group">
                  <label>Nom/Description *</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    placeholder="Décrivez cet article"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantité</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Unité</label>
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                  >
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Prix Unitaire</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Spécifications Techniques</label>
                <textarea
                  value={item.specifications}
                  onChange={(e) => handleItemChange(idx, 'specifications', e.target.value)}
                  placeholder="Détails techniques et exigences spécifiques"
                  rows={3}
                />
              </div>
            </div>
          ))}

          {errors.items && <span className="error">{errors.items}</span>}
        </div>
      )}

      {/* Étape 4: Critères d'Éligibilité */}
      {step === 4 && (
        <div className="step-content">
          <h2>Étape 4: Critères d'Éligibilité et Pondération</h2>

          <div className="form-group">
            <label>Localisation Géographique *</label>
            <select name="geographicLocation" value={tenderData.geographicLocation} onChange={handleInputChange}>
              <option value="">-- Sélectionnez --</option>
              <option value="tunisia">Tunisie</option>
              <option value="maghreb">Maghreb</option>
              <option value="mena">MENA</option>
              <option value="international">International</option>
            </select>
            {errors.geographicLocation && <span className="error">{errors.geographicLocation}</span>}
          </div>

          <div className="form-section">
            <h3>Pondération des Critères d'Évaluation</h3>
            <p className="info">La somme doit égaler 100%</p>

            <div className="form-row">
              <div className="form-group">
                <label>Prix (%)</label>
                <input
                  type="number"
                  value={tenderData.weights.price}
                  onChange={(e) => handleWeightChange('price', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Conformité (%)</label>
                <input
                  type="number"
                  value={tenderData.weights.compliance}
                  onChange={(e) => handleWeightChange('compliance', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Délai Livraison (%)</label>
                <input
                  type="number"
                  value={tenderData.weights.delivery}
                  onChange={(e) => handleWeightChange('delivery', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Durabilité (%)</label>
                <input
                  type="number"
                  value={tenderData.weights.sustainability}
                  onChange={(e) => handleWeightChange('sustainability', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="allowNegotiation"
                checked={tenderData.allowNegotiation}
                onChange={handleInputChange}
              />
              Permettre la Négociation post-Évaluation
            </label>
          </div>
        </div>
      )}

      {/* Étape 5: Révision et Confirmation */}
      {step === 5 && (
        <div className="step-content">
          <h2>Étape 5: Révision et Confirmation</h2>

          <div className="review-section">
            <h3>Résumé de votre Appel d'Offres</h3>
            
            <div className="review-item">
              <strong>Titre:</strong> {tenderData.title}
            </div>

            <div className="review-item">
              <strong>Catégories:</strong> {tenderData.categories.join(', ')}
            </div>

            <div className="review-item">
              <strong>Budget:</strong> {tenderData.budgetMax || 'Non spécifié'} {tenderData.currency}
            </div>

            <div className="review-item">
              <strong>Articles:</strong> {tenderData.items.length}
            </div>

            <div className="review-item">
              <strong>Date Expiration:</strong> {new Date(tenderData.submissionDeadline).toLocaleString('fr-FR')}
            </div>

            <div className="review-item">
              <strong>Localisation:</strong> {tenderData.geographicLocation}
            </div>

            <p className="warning">
              ⚠️ Veuillez réviser tous les détails. Une fois publié, cet appel d'offres sera visible aux fournisseurs qualifiés.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="btn-secondary"
        >
          ← Précédent
        </button>

        {step < 5 ? (
          <button onClick={handleNextStep} className="btn-primary">
            Suivant →
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-success">
            Publier l'Appel d'Offres
          </button>
        )}
      </div>
    </div>
  );
}

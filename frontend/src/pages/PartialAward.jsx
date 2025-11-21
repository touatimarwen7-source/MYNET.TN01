import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { procurementAPI } from '../api';

export default function PartialAward() {
  const { tenderId } = useParams();
  const [tender, setTender] = useState(null);
  const [offers, setOffers] = useState([]);
  const [awards, setAwards] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenderData();
  }, [tenderId]);

  const fetchTenderData = async () => {
    try {
      const tenderRes = await procurementAPI.getTender(tenderId);
      setTender(tenderRes.data.tender);
      
      const offersRes = await procurementAPI.getOffers(tenderId);
      setOffers(offersRes.data.offers || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAwardQuantity = (offerId, quantity) => {
    setAwards(prev => ({
      ...prev,
      [offerId]: parseInt(quantity) || 0
    }));
  };

  const validateAwards = () => {
    const totalAwarded = Object.values(awards).reduce((sum, val) => sum + val, 0);
    if (tender && totalAwarded > tender.budget_max) {
      setError("Le montant total dépasse le budget autorisé");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmitAwards = async () => {
    if (!validateAwards()) return;

    try {
      const awardData = Object.entries(awards)
        .filter(([_, qty]) => qty > 0)
        .map(([offerId, quantity]) => ({
          offer_id: offerId,
          awarded_quantity: quantity
        }));

      await procurementAPI.submitAwards(tenderId, awardData);
      alert("Attribution soumise avec succès");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la soumission de l'attribution");
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (!tender) return <div className="alert alert-error">Appel d'offres non trouvé</div>;

  return (
    <div className="partial-award-container">
      <h2>Attribution Partielle - {tender.title}</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="award-table-wrapper">
        <table className="award-table">
          <thead>
            <tr>
              <th>Fournisseur</th>
              <th>Prix Proposé</th>
              <th>Délai de Livraison</th>
              <th>Quantité Allouée</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.id}>
                <td>{offer.supplier_name}</td>
                <td>{offer.total_amount} {offer.currency}</td>
                <td>{offer.delivery_time}</td>
                <td>
                  <input 
                    type="number" 
                    min="0"
                    value={awards[offer.id] || 0}
                    onChange={(e) => handleAwardQuantity(offer.id, e.target.value)}
                    className="quantity-input"
                  />
                </td>
                <td>
                  {((awards[offer.id] || 0) * (offer.total_amount || 0)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="award-summary">
        <p><strong>Montant Total Attribué:</strong> {Object.entries(awards).reduce((sum, [id, qty]) => {
          const offer = offers.find(o => o.id === parseInt(id));
          return sum + (qty * (offer?.total_amount || 0));
        }, 0).toFixed(2)}</p>
        <p><strong>Budget Disponible:</strong> {tender.budget_max} {tender.currency}</p>
      </div>

      <button className="btn btn-primary" onClick={handleSubmitAwards}>
        Confirmer l'Attribution
      </button>
    </div>
  );
}

import axiosInstance from '../services/axiosConfig';

export const procurementAPI = {
  getTenders: (filters) => axiosInstance.get('/procurement/tenders', { params: filters }),
  getTender: (id) => axiosInstance.get(`/procurement/tenders/${id}`),
  // Note: For buyers, the backend is expected to return 'offersCount' instead of 'offers' array
  // if the current date is before the tender's 'opening_date'.
  // After 'opening_date', the 'offers' array should be returned.
  createTender: (data) => axiosInstance.post('/procurement/tenders', data),
  updateTender: (id, data) => axiosInstance.put(`/procurement/tenders/${id}`, data),
  deleteTender: (id) => axiosInstance.delete(`/procurement/tenders/${id}`),
  publishTender: (id) => axiosInstance.post(`/procurement/tenders/${id}/publish`),
  closeTender: (id) => axiosInstance.post(`/procurement/tenders/${id}/close`),
  getMyTenders: (filters) => axiosInstance.get('/procurement/my-tenders', { params: filters }),

  // Direct supply request helpers
  getSuppliers: () => axiosInstance.get('/direct-supply/suppliers'),
  createSupplyRequest: (data) => axiosInstance.post('/direct-supply/create-request', data),

  getOffers: (tenderId) => axiosInstance.get(`/procurement/tenders/${tenderId}/offers`),
  getOffer: (offerId) => axiosInstance.get(`/procurement/offers/${offerId}`),
  getMyOffers: () => axiosInstance.get('/procurement/my-offers'),
  createOffer: (data) => axiosInstance.post('/procurement/offers', data),
  evaluateOffer: (id, data) => axiosInstance.post(`/procurement/offers/${id}/evaluate`, data),
  selectWinner: (id) => axiosInstance.post(`/procurement/offers/${id}/select-winner`),
  rejectOffer: (id) => axiosInstance.post(`/procurement/offers/${id}/reject`),
  requestClarification: (offerId, question) =>
    axiosInstance.post(`/procurement/offers/${offerId}/clarification`, { question }),
  getClarificationRequests: () => axiosInstance.get('/procurement/clarifications/received'),
  getClarificationRequest: (clarificationId) =>
    axiosInstance.get(`/procurement/clarifications/${clarificationId}`),
  respondToClarification: (clarificationId, response) =>
    axiosInstance.post(`/procurement/clarifications/${clarificationId}/respond`, { response }),

  // Supply Request endpoints
  getSupplyRequests: (filters) =>
    axiosInstance.get('/procurement/supply-requests', { params: filters }),
  getSupplyRequest: (id) => axiosInstance.get(`/procurement/supply-requests/${id}`),
  createSupplyRequest: (data) => axiosInstance.post('/procurement/supply-requests', data),
  updateSupplyRequest: (id, data) => axiosInstance.put(`/procurement/supply-requests/${id}`, data),
  getMySupplyRequests: () => axiosInstance.get('/procurement/my-supply-requests'),

  // Invoices et Purchase Orders gérés via workflow direct entre buyer et supplier
};

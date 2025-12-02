قimport React from 'react';
import { FaFileUpload, FaPaperPlane, FaInfoCircle, FaSpinner } from 'react-icons/fa';

const SubmitOfferPage = ({
  tender,
  offerData,
  setOfferData,
  handleFileChange,
  handleSubmit,
  loading,
  error,
}) => {
  if (!tender) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <p className="ml-4 text-lg">Chargement des détails de l'appel d'offres...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Soumettre une Offre</h1>
      <p className="text-lg text-gray-600 mb-6">Pour l'appel d'offres : <span className="font-semibold text-blue-600">{tender.title}</span></p>

      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md" role="alert">
        <div className="flex">
          <FaInfoCircle className="text-2xl mr-3" />
          <div>
            <p className="font-bold">Date limite de soumission : {new Date(tender.submissionDeadline).toLocaleString('fr-FR')}</p>
            <p>Veuillez vous assurer que tous les documents requis sont soumis avant cette date.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Montant de l'offre (TND)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={offerData.price}
            onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ex: 15000"
            required
          />
        </div>

        <div>
          <label htmlFor="technical-doc" className="block text-sm font-medium text-gray-700">
            Document Technique
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="technical-doc-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Téléchargez un fichier</span>
                  <input id="technical-doc-upload" name="technicalDocument" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1">ou glissez-déposez</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOCX, XLSX jusqu'à 10MB</p>
            </div>
          </div>
          {offerData.technicalDocument && <p className="mt-2 text-sm text-green-600">Fichier sélectionné : {offerData.technicalDocument.name}</p>}
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
            Commentaires (Optionnel)
          </label>
          <textarea
            id="comments"
            name="comments"
            rows="4"
            value={offerData.comments}
            onChange={(e) => setOfferData({ ...offerData, comments: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ajoutez des commentaires ou des clarifications concernant votre offre..."
          ></textarea>
        </div>

        <div className="text-right">
          <button type="submit" disabled={loading} className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
            {loading ? <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" /> : <FaPaperPlane className="-ml-1 mr-2 h-5 w-5" />}
            {loading ? 'Soumission en cours...' : 'Soumettre l\'Offre'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitOfferPage;
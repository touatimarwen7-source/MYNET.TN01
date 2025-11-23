const ResponseFormatter = require('../utils/responseFormatter');
const ErrorTrackingService = require('../services/ErrorTrackingService');

class ErrorHandler {
    static handle(err, req, res, next) {
        try {
            // Log error safely
            try {
                ErrorTrackingService.logError('REQUEST_ERROR', err, {
                    path: req.path,
                    method: req.method,
                    requestId: req.id
                });
            } catch (e) {
                // Silently handle logging failures
            }

            // Get error details
            const statusCode = err.statusCode || err.status || 500;
            const errorCode = err.code || 'INTERNAL_ERROR';
            const message = this._getSafeMessage(err, statusCode);

            // Unified response format
            const errorResponse = ResponseFormatter.error(message, errorCode, statusCode);
            res.status(statusCode).json(errorResponse);
        } catch (e) {
            // Fallback if all else fails
            res.status(500).json({
                error: 'Internal Server Error',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    static _getSafeMessage(err, statusCode) {
        // For production, limit error details
        if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
            return 'An error occurred processing your request';
        }
        return err.message || 'Unknown error';
    }

    static notFound(req, res) {
        const errorResponse = ResponseFormatter.error(
            'The requested resource was not found',
            'NOT_FOUND',
            404
        );
        res.status(404).json(errorResponse);
    }
}

module.exports = ErrorHandler;

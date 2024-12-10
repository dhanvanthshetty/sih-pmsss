
const express = require('express');
const { uploadDocuments, getDocuments ,  rejectDocument
,    deleteDocument,getSubmittedDocuments, getDocumentById, approveDocument } = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// POST route to upload multiple documents
router.post('/upload', authMiddleware, uploadDocuments);

// GET route to retrieve user's documents
router.get('/retrieve', authMiddleware, getDocuments);

// DELETE route to delete a document
router.delete('/delete', authMiddleware, deleteDocument);

router.get('/submitted', authMiddleware, getSubmittedDocuments);

// Route to get a specific document by ID
router.get('/:id', authMiddleware, getDocumentById);
router.post('/reject', authMiddleware, rejectDocument);


// Route to approve a document
router.post('/approve', authMiddleware, approveDocument);
module.exports = router;


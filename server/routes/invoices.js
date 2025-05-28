import express from 'express'
import {createInvoice, updateInvoice, deleteInvoice, getInvoice, getInvoicesByUser, getTotalCount, getInvoices } from '../controllers/invoices.js'

const router = express.Router()

router.get('/count', getTotalCount) //use to generate invoice serial number
router.get('/all', getInvoices) // Get all invoices
router.get('/:id', getInvoice)
router.get('/', getInvoicesByUser)
router.post('/', createInvoice)
router.patch('/:id', updateInvoice)
router.delete('/:id', deleteInvoice)

export default router
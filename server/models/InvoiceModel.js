import mongoose from 'mongoose'

const invoiceSchema = mongoose.Schema({
    creator: [String],
    client: {
        type: Object,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'Invoice'
    },
    status: {
        type: String,
        default: 'Unpaid'
    },
    total: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    vat: {
        type: Number,
        default: 0
    },
    rates: {
        type: String,
        default: '0'
    },
    items: [{
        type: Object,
        required: true
    }],
    currency: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentRecords: {
        type: [Object],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

export default Invoice
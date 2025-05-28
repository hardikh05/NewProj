// Copyright (c) 2022 Panshak Solomon

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import pdf from 'html-pdf'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { MongoClient, ServerApiVersion } from 'mongodb';
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ROUTES
import invoiceRoutes from './routes/invoices.js'
import clientRoutes from './routes/clients.js'
import userRoutes from './routes/userRoutes.js'
import profileRoutes from './routes/profile.js'

// TEMPLATES
import pdfTemplate from './documents/index.js'
import emailTemplate from './documents/email.js'

const app = express()

// MIDDLEWARE
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

// Debug middleware for profile routes
app.use('/profiles', (req, res, next) => {
  console.log('Profile Route:', req.method, req.url);
  next();
});

// ROUTE USAGE
app.use('/invoices', invoiceRoutes)
app.use('/clients', clientRoutes)
app.use('/users', userRoutes)
app.use('/profiles', profileRoutes)

// NODEMAILER SETUP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})


const pdfOptions = { format: 'A4' }

// ROUTE TO SEND PDF INVOICE
app.post('/send-pdf', (req, res) => {
  const { email, company } = req.body

    pdf.create(pdfTemplate(req.body), pdfOptions).toFile('invoice.pdf', (err) => {
    if (err) {
      console.error('❌ Error creating PDF:', err)
      return res.status(500).send(Promise.reject())
    }

    transporter.sendMail({
      from: `EchoInvoice <${process.env.SMTP_USER}>`,
      to: email,
      replyTo: company.email,
      subject: `Invoice from ${company.businessName || company.name}`,
      text: `Invoice from ${company.businessName || company.name}`,
      html: emailTemplate(req.body),
      attachments: [{
        filename: 'invoice.pdf',
        path: `${__dirname}/invoice.pdf`
      }]
    }, (err, info) => {
      if (err) {
        console.error('❌ Email sending failed:', err)
        return res.status(500).send(Promise.reject())
      }
      res.send(Promise.resolve())
    })
  })
})

// Create PDF
app.post('/create-pdf', (req, res) => {
  pdf.create(pdfTemplate(req.body), pdfOptions).toFile('invoice.pdf', (err) => {
    if (err) {
      console.error('❌ Error creating PDF:', err)
      return res.status(500).send(Promise.reject())
    }
    res.send(Promise.resolve())
  })
})

// Fetch PDF
app.get('/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/invoice.pdf`)
})

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 SERVER IS RUNNING')
})

// MongoDB Connection
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || process.env.DB_URL

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected via Mongoose')
  app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`))
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err)
  process.exit(1)
})

// Optional: to suppress deprecation warnings (not required in latest Mongoose versions)
mongoose.set('strictQuery', true)

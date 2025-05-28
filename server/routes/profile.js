import express from 'express'
import { getProfiles, createProfile, updateProfile, deleteProfile, getProfile, getProfilesByUser } from '../controllers/profile.js'

const router = express.Router()

// Get profile by user ID - this must come before /:id to prevent userId being treated as an id
router.get('/user/:userId', getProfilesByUser)

// Other routes
router.get('/:id', getProfile)
router.get('/', getProfiles)
router.post('/', createProfile)
router.patch('/:id', updateProfile)
router.delete('/:id', deleteProfile)

export default router
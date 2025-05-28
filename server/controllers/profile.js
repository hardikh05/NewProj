import express from 'express';
import mongoose from 'mongoose';

import ProfileModel from '../models/ProfileModel.js';

const router = express.Router();

export const getProfiles = async (req, res) => { 
  try {
      const allProfiles = await ProfileModel.find().sort({ createdAt: -1 });
              
      res.status(200).json(allProfiles);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
}

export const getProfile = async (req, res) => { 
  const { id } = req.params;

  try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(404).json({ message: 'Invalid profile ID' });
      }
      
      const profile = await ProfileModel.findById(id);
      
      if (!profile) {
          return res.status(404).json({ message: 'Profile not found' });
      }
      
      res.status(200).json(profile);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
}

export const createProfile = async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    businessName,
    contactAddress, 
    logo,
    website,
    userId,
   } = req.body;
  
  try {
    const existingUser = await ProfileModel.findOne({ email })

    if(existingUser) {
        return res.status(400).json({ message: "Profile with this email already exists" });
    }

    const newProfile = new ProfileModel({
        name,
        email,
        phoneNumber,
        businessName,
        contactAddress, 
        logo,
        website,
        userId,
        createdAt: new Date().toISOString()
    });

    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
      res.status(500).json({ message: 'Error creating profile', error: error.message });
  }
}

export const getProfilesByUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Clean up the userId - remove any 'function' text if present
        const cleanUserId = userId.toString().replace(/function.*\{.*\}/, '').trim();

        if (!cleanUserId) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const profile = await ProfileModel.findOne({ userId: cleanUserId });

        if (!profile) {
            return res.status(404).json({ 
                message: 'No profile found for this user',
                userId: cleanUserId 
            });
        }

        res.status(200).json({ data: profile });
    } catch (error) {    
        console.error('Error in getProfilesByUser:', error);
        res.status(500).json({ 
            message: 'Error fetching user profile', 
            error: error.message,
            userId: userId
        });
    }
}

export const getProfilesBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
      const name = new RegExp(searchQuery, "i");
      const email = new RegExp(searchQuery, "i");

      const profiles = await ProfileModel.find({ $or: [ { name }, { email } ] });

      res.json({ data: profiles });
  } catch (error) {    
      res.status(404).json({ message: error.message });
  }
}

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const profile = req.body;

  try {
      if(!mongoose.Types.ObjectId.isValid(_id)) {
          return res.status(404).json({ message: 'Invalid profile ID' });
      }

      const existingProfile = await ProfileModel.findById(_id);
      if (!existingProfile) {
          return res.status(404).json({ message: 'Profile not found' });
      }

      const updatedProfile = await ProfileModel.findByIdAndUpdate(
          _id, 
          { ...profile, _id, updatedAt: new Date().toISOString() },
          { new: true }
      );

      res.status(200).json(updatedProfile);
  } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
}

export const deleteProfile = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid profile ID' });
        }

        const profile = await ProfileModel.findById(id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        await ProfileModel.findByIdAndRemove(id);
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
}

// // Function call
// ProfileModel.insertMany([
//   { name: 'Gourav', age: 20},
//   { name: 'Kartik', age: 20},
//   { name: 'Niharika', age: 20}
// ]).then(function(){
//   console.log("Data inserted")  // Success
// }).catch(function(error){
//   console.log(error)      // Failure
// });
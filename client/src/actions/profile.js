import { FETCH_PROFILES, FETCH_PROFILES_BY_USER, CREATE_PROFILE, UPDATE_PROFILE, DELETE_PROFILE, FETCH_PROFILE_BY_USER, START_LOADING, END_LOADING, FETCH_PROFILE } from './constants';
import * as api from '../api/index.js';

export const getProfile = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchProfile(id);
    dispatch({ type: FETCH_PROFILE, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data?.message || error.message);
    dispatch({ type: END_LOADING });
  }
};

export const getProfiles = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchProfiles();
    dispatch({ type: FETCH_PROFILES, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Error fetching profiles:', error.response?.data?.message || error.message);
    dispatch({ type: END_LOADING });
  }
};

export const getProfilesByUser = (userId) => async (dispatch) => {
    if (!userId) {
        console.error('No user ID provided to getProfilesByUser');
        return;
    }

    try {
        dispatch({ type: START_LOADING });
        console.log('Fetching profile for user ID:', userId);
        const { data } = await api.fetchProfilesByUser(userId);
        
        if (data && data.data) {
            dispatch({ type: FETCH_PROFILE_BY_USER, payload: data.data });
        } else {
            console.error('No profile data received from server');
        }
        
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error('Error fetching user profile:', error.response?.data?.message || error.message);
        dispatch({ type: END_LOADING });
    }
};

export const getProfilesBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchProfilesBySearch(searchQuery);

    dispatch({ type: FETCH_PROFILES_BY_USER, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const createProfile = (profile, callback) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createProfile(profile);
    dispatch({ type: CREATE_PROFILE, payload: data });
    dispatch({ type: END_LOADING });
    if (callback) callback(null, data);
  } catch (error) {
    console.error('Error creating profile:', error.response?.data?.message || error.message);
    dispatch({ type: END_LOADING });
    if (callback) callback(error);
  }
};

export const updateProfile = (id, profile, callback) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.updateProfile(id, profile);
    dispatch({ type: UPDATE_PROFILE, payload: data });
    dispatch({ type: END_LOADING });
    if (callback) callback(null, data);
  } catch (error) {
    console.error('Error updating profile:', error.response?.data?.message || error.message);
    dispatch({ type: END_LOADING });
    if (callback) callback(error);
  }
};

export const deleteProfile = (id, callback) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    await api.deleteProfile(id);
    dispatch({ type: DELETE_PROFILE, payload: id });
    dispatch({ type: END_LOADING });
    if (callback) callback();
  } catch (error) {
    console.error('Error deleting profile:', error.response?.data?.message || error.message);
    dispatch({ type: END_LOADING });
    if (callback) callback(error);
  }
};

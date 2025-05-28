/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { useSnackbar } from 'react-simple-snackbar'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Avatar, Button, Paper, Grid, Container } from '@material-ui/core';
import Uploader from './Uploader';
import { getProfilesByUser, updateProfile } from '../../../actions/profile';
import useStyles from './styles';
import Input from './Input';
import ProfileDetail from './Profile';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const initialState = { 
    name: '', 
    email: '',
    phoneNumber: '',
    businessName: '',
    contactAddress: '', 
    logo: '',
    paymentDetails: '',
    userId: user?.result?._id || user?.result?.sub || user?.result?.googleId
  };

  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { profiles, isLoading } = useSelector((state) => state.profiles);
  const [switchEdit, setSwitchEdit] = useState(0);
  const [openSnackbar, closeSnackbar] = useSnackbar();

  // Get the current profile (first item in the array)
  const currentProfile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

  // Memoize the user ID to prevent unnecessary re-renders
  const userId = React.useMemo(() => {
    if (!user) return null;
    // Handle different auth scenarios (normal login, Google login)
    return user.result?._id || user.result?.sub || user.result?.googleId;
  }, [user]);

  useEffect(() => {
    if (switchEdit === 1 && currentProfile) {
      setForm({
        ...currentProfile,
        userId: userId // Ensure userId is always set
      });
    }
  }, [switchEdit, currentProfile, userId]);

  // Fetch profile only when userId changes
  useEffect(() => {
    if (userId) {
      console.log('Fetching profile for user ID:', userId);
      dispatch(getProfilesByUser(userId));
    }
  }, [userId, dispatch]);

  // Store profile details in localStorage only when profiles change
  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('profileDetail', JSON.stringify(currentProfile));
    }
  }, [currentProfile]);
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!currentProfile?._id) {
      openSnackbar('No profile found to update');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting form data:', form);
      await dispatch(updateProfile(currentProfile._id, form));
      openSnackbar('Profile updated successfully');
      setSwitchEdit(0);
      // Refresh profile data
      dispatch(getProfilesByUser(userId));
    } catch (error) {
      console.error('Error updating profile:', error);
      openSnackbar('Failed to update profile: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!userId) {
    return (
      <Container component="main" maxWidth="sm">
        <Paper className={classes.paper} elevation={0}>
          <p>Please log in to view your profile.</p>
        </Paper>
      </Container>
    );
  }

  return (
    <div>
      {switchEdit === 0 && (
        <Container component="main" maxWidth="sm">
          <Paper className={classes.paper} elevation={0}>
            <ProfileDetail profiles={currentProfile} />
            <Button 
              variant="outlined" 
              style={{margin: '30px', padding: '15px 30px'}} 
              onClick={() => setSwitchEdit(1)}
            >
              Edit Profile
            </Button>
          </Paper>
        </Container>
      )}

      {switchEdit === 1 && (
        <Container component="main" maxWidth="sm">
          <Paper className={classes.paper} elevation={1}>
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderBottom: 'solid 1px #dddddd',
              paddingBottom: '20px'
            }}>
              <Avatar 
                style={{
                  width: '100px', 
                  height: '100px',
                  backgroundColor: '#1976d2'
                }} 
                src={form?.logo || ''}
                alt={form?.businessName || "Business Logo"}
              >
                {form?.businessName?.charAt(0) || 'B'}
              </Avatar>
            </div>
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Uploader form={form} setForm={setForm} />
                <Input name="email" label="Email Address" handleChange={handleChange} type="email" half value={form?.email} />
                <Input name="phoneNumber" label="Phone Number" handleChange={handleChange} type="text" half value={form?.phoneNumber}/>
                <Input name="businessName" label="Business Name" handleChange={handleChange} type="text" value={form?.businessName}/>
                <Input name="contactAddress" label="Contact Address" handleChange={handleChange} type="text" value={form?.contactAddress} />
                <Input name="paymentDetails" label="Payment Details/Notes" handleChange={handleChange} type="text" multiline rows="4" value={form?.paymentDetails} />
              </Grid>
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary" 
                className={classes.submit}
                disabled={!form?.email || isLoading || isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Settings'}
              </Button>
            </form>
          </Paper>
        </Container>
      )}
    </div>
  );
};

export default Settings;

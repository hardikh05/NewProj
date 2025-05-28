import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import AccountBalanceWalletRoundedIcon from '@material-ui/icons/AccountBalanceWalletRounded';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 450,
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    backgroundColor: '#1976d2'
  },
}));

export default function ProfileDetail({ profiles: profile }) {
  const classes = useStyles();

  if (!profile) {
    return (
      <div className={classes.root}>
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderBottom: 'solid 1px #dddddd',
        paddingBottom: '20px'
      }}>
        <Avatar
          alt={profile.businessName || "Business Logo"}
          src={profile.logo || ''}
          className={classes.large}
        >
          {profile.businessName?.charAt(0) || 'B'}
        </Avatar>
      </div>
      <List className={classes.root}>
        <ListItem>
          <BusinessCenterIcon style={{marginRight: '20px', color: 'gray'}} />
          <ListItemText primary={profile.businessName || 'No business name'} secondary="" />
        </ListItem>

        <ListItem>
          <LocationOnIcon style={{marginRight: '20px', color: 'gray'}} />
          <ListItemText primary={profile.contactAddress || 'No address'} secondary="" />
        </ListItem>

        <ListItem>
          <PhoneInTalkIcon style={{marginRight: '20px', color: 'gray'}} />
          <ListItemText primary={profile.phoneNumber || 'No phone number'} secondary="" />
        </ListItem>

        <ListItem>
          <AlternateEmailIcon style={{marginRight: '20px', color: 'gray'}} />
          <ListItemText primary={profile.email || 'No email'} secondary="" />
        </ListItem>

        <ListItem>
          <AccountBalanceWalletRoundedIcon style={{marginRight: '20px', color: 'gray'}} />
          <ListItemText primary={profile.paymentDetails || 'No payment details'} secondary="" />
        </ListItem>
      </List>
    </>
  );
}

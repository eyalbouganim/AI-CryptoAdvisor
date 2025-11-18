import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  OutlinedInput,
  Chip,
} from '@mui/material';

// Options for onboarding selections
const assetOptions = ['Bitcoin', 'Ethereum', 'Altcoins', 'DeFi', 'NFTs'];
const investorTypeOptions = ['HODLer', 'Day Trader', 'NFT Collector'];
const contentPreferenceOptions = ['Market News', 'Charts', 'Social', 'Fun'];

// Onboarding component to collect user preferences
const Onboarding = () => {
  const [userPreferences, setUserPreferences] = useState({
    userPreferences: {
      assetsInterest: [],
      investorType: '',
      contentPreferences: [],
    },
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setUserPreferences((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        [name]: value,
      },
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication error. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/users/onboarding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userPreferences),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save preferences.');
      }

      // On success, navigate to the main dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome!
        </Typography>
        <Typography component="p" variant="h6" sx={{ mb: 3 }}>
          Let's personalize your experience.
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" component="p" sx={{ mb: 2 }}>
              Which assets are you interested in?
            </Typography>
            <FormControl fullWidth>
              <Select
                id="assetsInterest"
                name="assetsInterest"
                multiple
                value={userPreferences.userPreferences.assetsInterest}
                onChange={handleSelectChange}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.length === 0
                      ? <em style={{ color: 'grey' }}>Select one or more...</em>
                      : selected.map((value) => <Chip key={value} label={value} />)}
                  </Box>
                )}
                displayEmpty
              >
                {assetOptions.map((name) => (<MenuItem key={name} value={name}>{name}</MenuItem>))}
              </Select>
            </FormControl>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" component="p" sx={{ mb: 2 }}>
              What type of investor are you?
            </Typography>
            <FormControl fullWidth>
              <Select id="investorType" name="investorType" value={userPreferences.userPreferences.investorType} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled><em>Select one...</em></MenuItem>
                {investorTypeOptions.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
              </Select>
            </FormControl>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" component="p" sx={{ mb: 2 }}>
              What content do you prefer?
            </Typography>
            <FormControl fullWidth>
              <Select id="contentPreferences" name="contentPreferences" multiple value={userPreferences.userPreferences.contentPreferences} onChange={handleSelectChange} input={<OutlinedInput />} renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.length === 0
                      ? <em style={{ color: 'grey' }}>Select one or more...</em>
                      : selected.map((value) => <Chip key={value} label={value} />)}
                  </Box>
                )}
                displayEmpty
              >
                {contentPreferenceOptions.map((name) => (<MenuItem key={name} value={name}>{name}</MenuItem>))}
              </Select>
            </FormControl>
          </Paper>

          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>
            Finish Setup
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Onboarding;

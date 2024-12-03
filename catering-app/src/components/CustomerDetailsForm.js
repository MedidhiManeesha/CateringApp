
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Content from './Content';
import { Select, MenuItem, InputLabel } from '@mui/material';



const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(4),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

export default function CustomerDetailsForm({ setCustomerDetails }) {
  const [formData, setFormData] = useState({
    customerName: '',
    date: '',
    customerContact: '',
    menuType: '',
    noOfPacks: '',
    perHead: '',
    totalAmount: '',
    advance: '',
    balanceAmount: '',
    aadharNo: '',
  });

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTermsChange = (e) => {
    setIsTermsAccepted(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => value === '') || !isTermsAccepted) {
      alert('Please fill all fields and accept the terms and conditions.');
      return;
    }

    setCustomerDetails({ ...formData });
    navigate('/home');
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }} 
      spacing={4}
      justifyContent="center"
      alignItems="flex-start"
      sx={{ maxWidth: '100%', m: 4,  px: 2 ,overflowX: 'hidden',}}
    >
      {/* Customer Details Form */}
      <Card variant="standard">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Customer Details
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >
          <FormControl>
            <TextField
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl>
            <TextField
            label="Event Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              fullWidth
             
           
            />
            

          </FormControl>
          <FormControl>
            <TextField
              label="Customer Contact"
              name="customerContact"
              type="number"
              value={formData.customerContact}
              onChange={handleChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth required>
  <InputLabel id="menu-type-label">Menu Type</InputLabel>
  <Select
    labelId="menu-type-label"
    id="menuType"
    name="menuType"
    value={formData.menuType}
    onChange={handleChange}
  >
    <MenuItem value="Standard">Standard</MenuItem>
    <MenuItem value="Premium">Premium</MenuItem>
  </Select>
</FormControl>
         
          <FormControl>
            <TextField
              label="No. of Packs"
              name="noOfPacks"
              type="number"
              value={formData.noOfPacks}
              onChange={handleChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Per Head"
              name="perHead"
              type="number"
              value={formData.perHead}
              onChange={handleChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Total Amount"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={handleChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Advance"
              name="advance"
              type="number"
              value={formData.advance}
              onChange={handleChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Balance Amount"
              name="balanceAmount"
              type="number"
              value={formData.balanceAmount}
              onChange={handleChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Aadhar No"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isTermsAccepted}
                onChange={handleTermsChange}
                required
              />
            }
            label="I accept the terms and conditions"
          />
          <Button type="submit" fullWidth variant="contained">
            Submit
          </Button>
        </Box>
      </Card>

     
      <Content />
    </Stack>
  );
}

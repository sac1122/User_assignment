import * as React from 'react';
import { useEffect } from 'react';
import { TextField, Button, Box, Drawer, Typography, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios'; 
import { toast } from 'react-toastify';

const availableInterests = ["Comics", "Sports", "Music", "Movies", "Books"]; 

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobile: Yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  age: Yup.number().positive('Age must be a positive number').integer('Age must be an integer').required('Age is required'),
  interest: Yup.array().of(Yup.string()).min(1, 'At least one interest is required') 
});

export default function AddUserForm({ open, onClose, userData, handleList }) {
  const formik = useFormik({
    initialValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      mobile: userData?.mobile || '',
      age: userData?.age || '',
      interest: userData?.interest || [],
    },
    validationSchema,
    enableReinitialize: true, 
    onSubmit: async (values) => {
      try {
        if (userData) {
          // Update existing user
          await axios.put(`${process.env.NEXT_PUBLIC_API_HOST}/update-user`, { ...values, _id: userData?._id });
          handleList();
          toast.success('User updated successfully');
        } else {
          // Add new user
          await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/add-user`, values);
          handleList();
          toast.success('User added successfully');
        }
        onClose();
      } catch (error) {
        console.log('error', error);
        toast.error(error.response.data.message || "Error on submitting form.");
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (!userData) {
        formik.resetForm();
      } else {
        formik.setValues({
          name: userData.name || '',
          email: userData.email || '',
          mobile: userData.mobile || '',
          age: userData.age || '',
          interest: userData.interest || [],
        });
      }
    }
  }, [open, userData]); 

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box sx={{ width: 600, padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {userData ? 'Edit User' : 'Add New User'}
          </Typography>
          <IconButton onClick={onClose} sx={{ marginLeft: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <TextField
            name='name'
            label='Name'
            variant='outlined'
            fullWidth
            margin='normal'
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            name='email'
            label='Email'
            type='email'
            variant='outlined'
            fullWidth
            margin='normal'
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={userData? true : false}
          />
          <TextField
            name='mobile'
            label='Mobile'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={formik.values.mobile}
            onChange={formik.handleChange}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />
          <TextField
            name='age'
            label='Age'
            type='number'
            variant='outlined'
            fullWidth
            margin='normal'
            value={formik.values.age}
            onChange={formik.handleChange}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
          />
          <Autocomplete
            multiple
            freeSolo
            options={availableInterests}
            value={formik.values.interest}
            onChange={(event, newValue) => formik.setFieldValue('interest', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                name='interest'
                label='Interest'
                variant='outlined'
                margin='normal'
                error={formik.touched.interest && Boolean(formik.errors.interest)}
                helperText={formik.touched.interest && formik.errors.interest}
              />
            )}
            renderTags={(tags, getTagProps) =>
              tags.map((tag, index) => (
                <Chip
                  label={tag}
                  key={index}
                  {...getTagProps({ index })}
                  sx={{ margin: 0.5 }}
                />
              ))
            }
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              type='submit'
            >
              {userData ? 'Update User' : 'Add User'}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
}

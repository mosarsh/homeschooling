import React from 'react';
import Button from '@material-ui/core/Button';
import {
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box
    } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';

function StudentCreateView({ setOpenAddStudentDialog, open }) {

    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
    setOpenAddStudentDialog(false);
    };

    const createFormSchema = Yup.object().shape({
    email: Yup.string()
    .email('Adresse e-mail invalide')
    .required('Obligatoire')   
    });

  return (
    <Formik
      initialValues={{
          email:''
        }}
      validationSchema={createFormSchema}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // Do api call
          setStatus({ success: true });
          setSubmitting(false);
          setOpenAddStudentDialog(false);
          enqueueSnackbar('L\'invitation a été envoyée avec succès.', {
            variant: 'success'
          });
        } catch (err) {
          setErrors({ submit: err.message });
          setStatus({ success: false });
          setSubmitting(false);
          enqueueSnackbar('L\'invitation a été envoyée avec error.', {
            variant: 'error'
          });
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Invitez les élèves</DialogTitle>
            <form onSubmit={handleSubmit}>
            <DialogContent>
                <DialogContentText>
                Ajoutez une adresse e-mail ci-dessous pour inviter à la classe.
                </DialogContentText>
          
                <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    margin="dense"
                    label="Email Address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    variant="outlined"
                    autoFocus
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>
                    Annuler
                </Button>
                <Button
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                >
                    Invitez l'élève
                </Button>
            </DialogActions>
            </form>
        </Dialog>
    )}
    </Formik>
  );
}

StudentCreateView.propTypes = {
    setOpenAddStudentDialog: PropTypes.func,
    open: PropTypes.bool
  };

  export default StudentCreateView;
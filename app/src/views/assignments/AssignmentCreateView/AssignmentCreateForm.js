import React, {useState} from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import AddButton from '../../../utils/AddButton';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import QuillEditor from 'src/components/QuillEditor';
import Resources from '../../../utils/resources';
import { createAssignment } from '../../../actions/assignments/assignmentCreateActions';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 150
    }
  }
}));

const handleAddYoutube = () => {
    console.log('youtube')
}

const handleAddLink = () => {
    console.log('link')
}

const handleAddFile = () => {
    console.log('file')
}

const handleAuthFailed = (error) => {
  console.log(error);
}

function AssignmentCreateForm({ className, ...rest }) {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [resources, setResources] = useState([]);

  const handlePickerCallback = (data) => {
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      let docs = data[window.google.picker.Response.DOCUMENTS];
      docs.map(function(doc){
        setResources(resources => [...resources, {
          id: doc.id,
          mimeType: doc.mimeType,
          icon: doc.iconUrl,
          name: doc.name,
          url: doc.url,
          embedUrl: doc.embedUrl,
          serviceId: doc.serviceId
        }]);
      });
    }
  };

  const createFormSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Le titre est requis.'),
    description: Yup.string().max(5000),
    date: Yup.date().required('La date est requise.')      
  });

  const initialValues = {
    title: '',
    description: '',
    date: moment().format('YYYY-MM-DD'),
    resources:[]      
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createFormSchema}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // Do api call
          values.resources = resources;
          
          dispatch(createAssignment(values));
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Un devoir est créé', {
            variant: 'success'
          });
          history.push('/app/assignments');
        } catch (err) {
          setErrors({ submit: err.message });
          setStatus({ success: false });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              lg={8}
            >
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.title && errors.title)}
                    fullWidth
                    helperText={touched.title && errors.title}
                    label="Titre"
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.title}
                    variant="outlined"
                  />
                  <Box
                    mt={3}
                    mb={1}
                  >
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      La description
                    </Typography>
                  </Box>
                  <Paper variant="outlined">
                    <QuillEditor
                      className={classes.editor}
                      value={values.description}
                      onChange={(value) => setFieldValue('description', value)}
                    />
                  </Paper>
                  {(touched.description && errors.description) && (
                    <Box mt={2}>
                      <FormHelperText error>
                        {errors.description}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              lg={4}
            >
              <Card>
                <CardContent>
                <TextField
                    error={Boolean(touched.date && errors.date)}
                    fullWidth
                    helperText={touched.date && errors.date}
                    id="date"
                    label="Date des devoirs"
                    type="date"
                    value={values.date}
                    className={classes.textField}
                    InputLabelProps={{shrink: true}}
                    variant="outlined"
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                </CardContent>
              </Card>
            </Grid>
            <Resources resources = {resources}/>
          </Grid>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box
            mt={3}
            display="flex"
          >
            <AddButton 
                onEventYoutube={handleAddYoutube}
                onEventLink={handleAddLink}
                onEventFile={handleAddFile}
                onAuthFailed={handleAuthFailed}
                onPickerCallback={handlePickerCallback}
            />

            <Box ml={1} />
            <Button
              color="secondary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Créer un devoir
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

AssignmentCreateForm.propTypes = {
  className: PropTypes.string
};

export default AssignmentCreateForm;

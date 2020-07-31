import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import AssignmentCreateForm from './AssignmentCreateForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

function ProductCreateView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Créer de nouveaux devoirs"
    >
      <Container maxWidth="lg">
        <Header />
        <AssignmentCreateForm />
      </Container>
    </Page>
  );
}

export default ProductCreateView;

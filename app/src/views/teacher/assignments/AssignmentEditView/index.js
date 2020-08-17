import React, { useEffect, useCallback } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Header from './Header'
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import { getAssignment } from 'src/actions/teacher/assignments/assignmentActions';
import AssignmentEditForm from './AssignmentEditForm';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingTop: theme.spacing(3),
      paddingBottom: 100
    }
  }));

function AssignmentEditView(){
    const dispatch = useDispatch()
    const classes = useStyles();
    const isMountedRef = useIsMountedRef(); 

    const getData = useCallback(() => {
        if(isMountedRef.current) {
            dispatch(getAssignment());
        }      
    }, [isMountedRef]);

    useEffect(() => {getData()}, [getData]);

    const {assignment} = useSelector((state) => state.assignmentReducer.assignment);

    if (!assignment) {
        return null;
    }

    return( 
        <Page
            className={classes.root}
            title="Modifiier le devoir"
        >
        <Container maxWidth="lg">
            <Header />
            <AssignmentEditForm assignment = {assignment} />
        </Container>
        </Page>
    );
}

export default AssignmentEditView;
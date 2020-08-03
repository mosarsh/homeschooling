import React, {useEffect, useCallback} from 'react';
  import {useDispatch, useSelector} from 'react-redux';
  import {
    Box,
    Container,
    makeStyles
  } from '@material-ui/core';

  import Page from 'src/components/Page';
  import useIsMountedRef from 'src/hooks/useIsMountedRef';
  import Header from './Header';
  import Results from './Results';
  import {getStudents} from '../../../actions/students/studentListActions';
  import StudentCreateView from '../StudentCreateView';
  
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    }
  }));
  
  function StudentListView() {
    const [open, setOpenAddStudentDialog] = React.useState(false);
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const dispatch = useDispatch();
    const students = useSelector(state => state.studentListReducer.students);
  
    const getData = useCallback(() => {

        if (isMountedRef.current) {
            dispatch(getStudents());
        }

    }, [isMountedRef]);
  
    useEffect(() => {
        getData();
    }, [getData]);


  
    if (!students) {
      return null;
    }
  
    return (
      <Page
        className={classes.root}
        title="Les élèves"
      >
        <Container maxWidth={false}>
          <Header setOpenAddStudentDialog={setOpenAddStudentDialog} />
          {students && (
            <Box mt={3}>
              <Results students={students} />
            </Box>
          )}
        </Container>
        <StudentCreateView setOpenAddStudentDialog={setOpenAddStudentDialog} open={open} />
      </Page>
    );
  }
  
  export default StudentListView;
  
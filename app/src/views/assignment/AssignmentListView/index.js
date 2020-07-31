import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Page from 'src/components/Page';
import {Container, makeStyles, Box, useMediaQuery, useTheme} from '@material-ui/core'
import Header from './Header';
import Toolbar from './Toolbar';
import moment from 'moment';
import Results from './Results';
import { getAssignments } from '../../../actions/assignments/assignmentListActions';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function AssignmentListView() {
    const classes = useStyles();
    const [date, setDate] = useState(moment().toDate());
    //const theme = useTheme();
    //const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    //const [view, setView] = useState(mobileDevice ? 'listWeek' : 'dayGridMonth');
    const dispatch = useDispatch();
    const assignments = useSelector(state => state.assignmentListReducer.assignments);
    const isMountedRef = useIsMountedRef(); 

    const getData = useCallback(() => {
        if(isMountedRef.current) {
            dispatch(getAssignments());
        }      
    }, [isMountedRef]);

    useEffect(() => {getData()}, [getData]);

    const handleEventAddClick = () => {}

    const handleDateNext = () => {
        setDate(moment(date).add(1,'days'));
    }

    const handleDatePrev = () => {
        setDate(moment(date).add(-1,'days'));
    }

    const handleDateToday = () => {
        setDate(moment().toDate());
    }

    const handleViewChange = (newView) => {}

    return (
        <Page 
        className={classes.root} 
        title="Works"
        >
            <Container maxWidth={false}>
                <Header onEventAdd={handleEventAddClick} />
                <Toolbar
                    date={date}
                    onDateNext={handleDateNext}
                    onDatePrev={handleDatePrev}
                    onDateToday={handleDateToday}
                    onViewChange={handleViewChange}
                    //view={view}
            />
                <Box mt={3}>
                    <Results assignments={assignments} />
                </Box>
            </Container>
        </Page>
    );
}

export default AssignmentListView;
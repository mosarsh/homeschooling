import React, {useEffect, useCallback, useState} from 'react';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {useSelector, useDispatch} from 'react-redux';
import Page from 'src/components/Page';
import {
    makeStyles,
    Container,
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    Box
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { getAssignment } from 'src/actions/student/assignments/assignmentActions';
import MediaList from './MediaList';
import Toolbar from './Toolbar';
import moment from 'moment';

const usStyle = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    media: {
      //height: "550",
      //paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
    gridList: {
      width: 500,
      //maxHeight: 685,
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
    mediaList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    }
}));

function handleClickEvent() {
    console.log('clicked');
}

function AssignmentListView(){
    const classes = usStyle();
    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef(); 
    const [tile, setTile] = React.useState();
    const [date, setDate] = useState(moment().toDate());
    const assignments = useSelector(state => state.homeworkListReducer.assignments);

    const getData = useCallback(async() => {
        if(isMountedRef.current) {
            let data = await dispatch(getAssignment());
            setTile(data.payload.assignments[0]);
        }      
    }, [isMountedRef]);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleDateNext = () => {
        setDate(moment(date).add(1,'days'));
    }

    const handleDatePrev = () => {
        setDate(moment(date).add(-1,'days'));
    }

    const handleDateToday = () => {
        setDate(moment().toDate());
    }

    return (
        <Page
            className = {classes.root}
            title = 'Devoirs'
        >
            <Container maxWidth={false}>
                <Toolbar
                        date={date}
                        onDateNext={handleDateNext}
                        onDatePrev={handleDatePrev}
                        onDateToday={handleDateToday}
                />
                <Box mt={2}/>
                <Grid container spacing={1}>
                    <Grid item xs={10}>
                        <Card className={classes.root}>
                            <CardHeader

                                title={tile? tile.title:''}                              
                            />
                            <CardMedia
                                component="iframe"
                                className={classes.media}
                                title= {tile? tile.title : 'sadsad'}
                                src={tile? tile.url : ''}
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                frameBorder="0"
                                allowFullScreen
                                height='800'
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                {tile? tile.desc : ''}
                                </Typography>
                            </CardContent>
                            </Card>
                    </Grid>
                    <Grid 
                    item 
                    xs={2}>
                        <Box className={classes.mediaList}>                           
                            <MediaList 
                                assignments={assignments} 
                                setTile={setTile}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default AssignmentListView;
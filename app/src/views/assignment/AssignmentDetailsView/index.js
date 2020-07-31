import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
//import Header from './Header';

function Assignment(){

    const dispatch = useDispatch();
    useEffect(() => {
        //dispatch(getAssigment(assignmentId));
    }, [dispatch]);

    return(
        <div>assigment details page.</div>
    );
}

export default Assignment;
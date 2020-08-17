import React from 'react';
import {
    GridList,
    GridListTile,
    IconButton,
    makeStyles,
    GridListTileBar
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Media from './Media'; 

const useStyles = makeStyles(() => ({
    root: {
        //width: 500,
        //maxHeight: 685
    },
    tile: {
       border: '1px',
       borderColor: '#cccccc',
       cursor: 'pointer',
    }
  }));

function MediaList({assignments, setTile, className, ...rest}) {

    const classes = useStyles();

    return (
        <GridList 
            className={clsx(classes.root, className)} 
            cellHeight={120} 
            cols={1} 
            spacing={5}
            {...rest}
            >

            {assignments.map((tile) => (
                <Media
                    tile={tile}
                    setTile={setTile}
                />
            ))}
        </GridList>
    );
}

MediaList.propTypes = {
    assignments: PropTypes.array,
    setTile: PropTypes.func,
    className: PropTypes.string
}

export default MediaList;

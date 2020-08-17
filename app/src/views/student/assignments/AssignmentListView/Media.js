import React from 'react';
import {
    GridListTile,
    IconButton,
    makeStyles,
    GridListTileBar
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
    root: {},
    tile: {
       border: '2px',
       borderColor: 'rgba(0, 0, 0, 0.12);',
       cursor: 'pointer',
       borderStyle: 'solid',
       borderRadius: '4px',

       '&:hover': {
            borderColor: '#5850EC',
            
       },
       
       '&.selected': {
            borderColor: '#5850EC'
       }
    }
  }));

function Media({tile, setTile, className, ...rest}) {

    const classes = useStyles();

    return (
        <GridListTile 
            className={clsx(classes.root, className)}  
            key={tile.id} 
            cols={1} 
            onClick={() => setTile(tile)}
            classes={{tile:classes.tile}}
            {...rest}
            
            >
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
                actionPosition='left'
                actionIcon={
                    <IconButton aria-label={`info about ${tile.title}`}>
                        <InfoIcon />
                    </IconButton>
                }
                title={tile.title}
            />
        </GridListTile>
    );
}

MediaList.propTypes = {
    tile: PropTypes.object,
    setTile: PropTypes.func,
    className: PropTypes.string
}

export default Media;

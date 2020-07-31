import React, {useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import DescriptionIcon from '@material-ui/icons/Description';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import PropTypes from 'prop-types';
import GPpicker from './gpicker';
import {GOOGLE_CLIENT_ID, GOOGLE_DEVELOPER_KEY} from '../config';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {},
}))(MenuItem);

function AddButton({
    onEventYoutube,
    onEventLink,
    onEventFile,
    onPickerCallback,
    onAuthFailed
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>

      <Button
        variant="outlined"
        startIcon={<AttachFileIcon />}
        aria-controls="customized-menu"
        onClick={handleClick}
      >
        Ajouter
      </Button>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <GPpicker 
              clientId={GOOGLE_CLIENT_ID}
              developerKey={GOOGLE_DEVELOPER_KEY}
              scope={['https://www.googleapis.com/auth/drive']}
              onPickerCallback={onPickerCallback}
              onAuthFailed={onAuthFailed} 
              youtube={true}
              viewId={null}
              authImmediate={true}
              origin={window.location.origin}
              >
            <StyledMenuItem onClick={handleClose} >
              <ListItemIcon>
                <YouTubeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Youtube" />
            </StyledMenuItem>
          </GPpicker>
        <StyledMenuItem onClick={handleClose} >
          <ListItemIcon>
            <InsertLinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Site internet" />
        </StyledMenuItem>
        <GPpicker 
              clientId={GOOGLE_CLIENT_ID}
              developerKey={GOOGLE_DEVELOPER_KEY}
              scope={['https://www.googleapis.com/auth/drive']}
              onPickerCallback={onPickerCallback}
              onAuthFailed={onAuthFailed} 
              uploadView={true}
              authImmediate={true}
              origin={window.location.origin}
              multiselect={true}
              >
              <StyledMenuItem onClick={handleClose}>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Fichier" />
              </StyledMenuItem>
        </GPpicker>
      </StyledMenu>
    </div>
  );
};


AddButton.propTypes = {
    className: PropTypes.string,
    onEventYoutube: PropTypes.func,
    onEventLink: PropTypes.func,
    onEventFile: PropTypes.func,
    onPickerCallback: PropTypes.func,
    onAuthFailed: PropTypes.func
};
  
AddButton.defaultProps = {
    onEventYoutube: () => {},
    onEventLink: () => {},
    onEventFile: () => {},
    onPickerCallback: () => {},
    onAuthFailed: () => {}
};

export default AddButton;

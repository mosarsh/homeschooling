import React, {useEffect, useState, forwardRef} from 'react';
import loadScript from 'load-script';
import {GOOGLE_DRIVE_API} from '../config';
import PropTypes from 'prop-types';
import {Button} from '@material-ui/core';

const GPicker = forwardRef(({
    viewId,
    uploadView,
    youtube,
    navHidden,
    multiselect,
    children,
    clientId,
    scope,
    authImmediate,
    developerKey,
    onPickerCallback,
    onAuthFailed,
    ...rest
  }, ref) => {

    const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
    const [auth2, setAuth] = useState(false);
    const [gapiLoaded, setGapiLoaded] = useState(false);

    useEffect(() => {
        loadScript(GOOGLE_DRIVE_API, onApiLoad);
      },[]);

    function onApiLoad(){
        if(!!window.gapi){
            setGapiLoaded(true);
            window.gapi.load('auth', onAuth);
            window.gapi.load('picker',onPickerAPILoaded);
        }
    }

    function onAuth(){
        if(!!window.gapi.auth){
            setAuth(true);
        }   
    }

    function onPickerAPILoaded() {
        if(!!window.google.picker){
            setPickerApiLoaded(true);
        }   
    }

    function handOpenPicker() {
        if(!gapiLoaded || !pickerApiLoaded || !auth2) {
            return null;
        }
        const token = window.gapi.auth.getToken();
        const oauthToken = token && token.access_token;

        if(!oauthToken){
            doAuth(response => {
                if (response.access_token) {
                    createPicker(response.access_token);
                } else {
                  onAuthFailed(response);
                }
              })
        } else {
            createPicker(oauthToken);
        }
    }

    function doAuth(callback) {
        window.gapi.auth.authorize({
            client_id: clientId,
            scope: scope,
            immediate: authImmediate
          },
          callback
        );
      }

    function createPicker(oauthToken){
        let picker = new window.google.picker.PickerBuilder();

        if(!!viewId) {
            picker.addView(window.google.picker.ViewId.DOCS);
        }
        if(!!uploadView) {
            picker.addView(new window.google.picker.DocsUploadView());
        }
        if(!!origin){
            picker.setOrigin(origin);
        } 

        if(!!youtube) {
            picker.addView(new window.google.picker.VideoSearchView());
        }
        
        if (!!navHidden) {
            picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        }
      
        if (!!multiselect) {
        picker.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        }
       
        picker.setLocale('fr').
        setOAuthToken(oauthToken).
        setDeveloperKey(developerKey).
        setCallback(onPickerCallback);
        
        picker.build().setVisible(true);
    }

    return(
        children ? 
        <div 
        onClick={handOpenPicker}
        ref={ref}
        {...rest}
        >
            {children}
        </div>  : 
        <Button onClick={handOpenPicker}>This is GPicker</Button>
        );
});

GPicker.propTypes = {
    viewId: PropTypes.string,
    uploadView: PropTypes.bool,
    youtube: PropTypes.bool,
    navHidden: PropTypes.bool,
    multiselect: PropTypes.bool,
    children: PropTypes.node,
    clientId: PropTypes.string.isRequired,
    scope: PropTypes.array,
    authImmediate: PropTypes.bool,
    developerKey: PropTypes.string.isRequired,
    onPickerCallback: PropTypes.func,
    onAuthFailed: PropTypes.func
};
  
GPicker.defaultProps = {
    viewId: 'DOCS',
    uploadView: false,
    youtube: false,
    navHidden: false,
    multiselect: false,
    authImmediate: true,
    onPickerCallback: () => {},
    onAuthFailed: () => {}
};

export default GPicker;
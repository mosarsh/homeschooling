import AxiosMockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mockAxios = axios.create();

const instance = new AxiosMockAdapter(mockAxios, { delayResponse: 0 });

export default instance;

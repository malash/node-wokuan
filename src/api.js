import axios from 'axios';
import qs from 'qs';
import assert from 'assert';

export const API_URL = 'http://pipecenter.dingdingbao.com';

export const GET_ABILITY = Symbol('GET_ABILITY');
export const GET_STATUS = Symbol('GET_STATUS');
export const ADD_START = Symbol('ADD_START');
export const ADD_STOP = Symbol('ADD_STOP');

export const APIS = {
  [GET_ABILITY]: '/cgi/spdup/api/ability/get',
  [GET_STATUS]: '/cgi/spdup/api/staus/get',
  [ADD_START]: '/cgi/spdup/api/request/addstart',
  [ADD_STOP]: '/cgi/spdup/api/request/addstop',
};

const api = async ({
  method = 'post',
  action,
  query,
  data = {},
}) => {
  assert(action, 'argument action must be set');
  const res = await axios({
    method,
    url: `${API_URL}${APIS[action]}?${qs.stringify(query)}`,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { errCode, errMsg } = res.data;
  if (errCode !== 'SUC') {
    throw Error(`API fetch error: ${errMsg}`);
  }
  return res.data.data;
};
export default api;

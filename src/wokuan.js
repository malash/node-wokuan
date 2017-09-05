import uuidv4 from 'uuid/v4';
import api, {
  GET_ABILITY,
  GET_STATUS,
  ADD_START,
} from './api';

export default class Wokuan {
  __data = {
    distCode: 'UNICOM_BJ',
    devId: uuidv4(),
  };

  __getQuery() {
    const { distCode: curDist, devId } = this.__data;
    return {
      curDist,
      devId,
      chnlId: 'appstore',
      uid: '0',
      vid: '2.3.3',
      devType: 'ios',
      sign: '0b775a66eef6685ebe3cdd87bc82f4f9',
      osver: '11.0',
      token: '0',
    };
  }

  async init() {
    const { lanId, distCode } = await this.getAbility();
    this.__data = {
      ...this.__data,
      lanId,
      distCode,
    };
  }

  async getAbility() {
    const data = await api({
      action: GET_ABILITY,
      query: this.__getQuery(),
      data: {
        ip: 0, port: 0, from: 'client'
      },
    });
    return data;
  };

  async getStatus() {
    const data = await api({
      action: GET_STATUS,
      query: this.__getQuery(),
      data: {},
    });
    const { userSpeedupLength, status } = data;
    this.__data = {
      ...this.__data,
      speedLength: userSpeedupLength,
      status,
    };
    return data;
  };

  async addStart({
    lanId = this.__data.lanId,
    distCode = this.__data.distCode,
    speedLength = this.__data.speedLength,
  } = {}) {
    const data = await api({
      action: ADD_START,
      query: this.__getQuery(),
      data: { lanId, distCode, speedLength },
    });
    return data;
  };

};

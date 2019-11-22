import { createModel } from '@rematch/core';
import { message } from 'antd';
import cookies from 'js-cookie';
import intl from 'react-intl-universal';

import service from '#assets/config/service';

interface IState {
  spaces: string[];
  currentSpace: string;
  edgeTypes: string[];
  host: string;
  username: string;
  password: string;
}

export const nebula = createModel({
  state: {
    spaces: [],
    host: cookies.get('host'),
    username: cookies.get('username'),
    password: cookies.get('password'),
    currentSpace: '',
    edgeTypes: [],
  },
  reducers: {
    update: (state: IState, payload: any) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    async asyncConfigServer(payload: {
      host: string;
      username: string;
      password: string;
    }) {
      const { code, message: errorMessage } = (await service.connectDB(
        payload,
      )) as any;
      if (code === '0') {
        const { host, username, password } = payload;
        cookies.set('host', host);
        cookies.set('username', username);
        cookies.set('password', password);
        this.update({
          host,
          username,
          password,
        });
        message.success(intl.get('configServer.success'));
        return true;
      } else {
        message.error(`${intl.get('configServer.fail')}: ${errorMessage}`);
        return false;
      }
    },

    async asyncClearConfig() {
      cookies.remove('host');
      cookies.remove('username');
      cookies.remove('password');
      this.update({
        host: '',
        username: '',
        password: '',
      });
    },

    async asyncGetSpaces(payload: {
      host: string;
      username: string;
      password: string;
    }) {
      const { host, username, password } = payload;
      const { code, data } = (await service.execNGQL({
        host,
        username,
        password,
        gql: 'show spaces;',
      })) as any;
      if (code === '0') {
        this.update({
          spaces: data.tables.map(item => item.Name),
        });
      }
    },

    async asyncGetEdgeTypes(payload: {
      host: string;
      username: string;
      password: string;
      space: string;
    }) {
      const { host, username, password, space } = payload;
      const { code, data } = (await service.execNGQL({
        host,
        username,
        password,
        gql: `
          use ${space};
          show edges;
        `,
      })) as any;
      if (code === '0') {
        this.update({
          edgeTypes: data.tables.map(item => item.Name),
        });
      }
    },
  },
});
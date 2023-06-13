import { ThemeConfig, theme } from 'antd';
import { makeAutoObservable } from 'mobx';

type ThemeToken = Partial<ThemeConfig['token']>;
type ThemeComponents = ThemeConfig['components'];

const lightCommonVariables = {
  gray: '#d5ddeb',
  lightWhite: '#f8f8f8',
  containerWidth: '1180px',
  darkGray: '#8697b0',
  red: '#eb5757',
  blue: '#0091ff',
  lightGray: '#e9edef',
  lightBlue: '#f3f6f9',
  darkBlue: '#465b7a',
  lightBlack: '#172f52',
  headerBlack: '#2f3a4a',
};

const darkCommonVariables = {
  gray: '#2a2e37',
  lightWhite: '#1e1e1e',
  containerWidth: '1180px',
  darkGray: '#b9b9b9',
  red: '#eb5757',
  blue: '#0091ff',
  lightGray: '#24282b',
  lightBlue: '#2d2d2d',
  darkBlue: '#fff',
  lightBlack: '#e2e2e2',
  headerBlack: '#f5f5f5',
};

export class ThemeStore {
  mode = 'light' as 'light' | 'dark';

  #baseToken: ThemeToken = {
    controlHeight: 38,
    fontFamily: 'Robot-Regular, sans-serif',
  };

  #darkVariables = {
    common: darkCommonVariables,
    subInfoStyle: { color: '#bdbdbd' },
    tabWithGreyBgStyle: { backgroundColor: '#24282b' },
    schemaTableRowStyle: { boxShadow: '0px 2px 10px rgb(255 255 255 / 24%)' },
  };

  #lightVariables = {
    common: lightCommonVariables,
    subInfoStyle: { color: '#4f4f4f' },
    tabWithGreyBgStyle: { backgroundColor: '#e9edef' },
    schemaTableRowStyle: { boxShadow: '0px 2px 10px rgb(0 0 0 / 10%)' },
  };

  get variables() {
    return this.mode === 'light' ? this.#lightVariables : this.#darkVariables;
  }

  get algorithm() {
    return this.mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm;
  }

  get token(): ThemeToken {
    const lightToken = { colorPrimary: '#0091ff' } as ThemeToken;
    const darkToken = { colorBgContainer: '#24282b' } as ThemeToken;
    return {
      ...this.#baseToken,
      ...(this.mode === 'light' ? lightToken : darkToken),
    };
  }

  get components(): ThemeComponents {
    const lightComponents = {
      Menu: {
        colorItemBg: '#2f3a4a',
        // colorPrimary: '#2f80ed',
        margin: 20,
      },
      Input: {
        colorBgContainer: '#f8f8f8',
      },
      Layout: {
        colorBgHeader: '#2f3a4a',
      },
    } as ThemeComponents;
    const darkComponents = {
      Menu: {
        colorItemBg: '#2f3a4a',
        margin: 20,
      },
      Input: {
        colorBgContainer: '#555',
      },
      Layout: {
        colorBgHeader: '#2f3a4a',
        colorBgBody: 'rgba(0, 0, 0, 0.9)',
      },
    } as ThemeComponents;
    return this.mode === 'light' ? lightComponents : darkComponents;
  }

  constructor() {
    makeAutoObservable(this);
  }

  setMode = (mode: 'light' | 'dark') => (this.mode = mode);
}

const themeStore = new ThemeStore();

export default themeStore;

import { ThemeConfig, theme } from 'antd';
import { makeAutoObservable } from 'mobx';

type ThemeToken = Partial<ThemeConfig['token']>;
type ThemeComponents = ThemeConfig['components'];

export class ThemeStore {
  mode = 'light' as 'light' | 'dark';

  #baseToken: ThemeToken = {
    controlHeight: 38,
    fontFamily: 'Robot-Regular, sans-serif',
  };

  #darkVariables = {
    subInfoStyle: { color: '#bdbdbd' },
    tabWithGreyBgStyle: { backgroundColor: '#24282b' },
    schemaTableRowStyle: { boxShadow: '0px 2px 10px rgb(255 255 255 / 24%)' },
  };

  #lightVariables = {
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
        // colorItemBg: '#2f3a4a',
        // colorPrimary: '#2f80ed',
        margin: 20,
      },
      Input: {
        colorBgContainer: '#f8f8f8',
      },
    } as ThemeComponents;
    const darkComponents = {
      Menu: {
        margin: 20,
      },
      Input: {
        colorBgContainer: '#555',
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

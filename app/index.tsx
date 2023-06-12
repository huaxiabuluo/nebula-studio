import { Spin, message, ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { PropsWithChildren, Suspense, lazy, useEffect } from 'react';
import ReactDom from 'react-dom';
import { Route, BrowserRouter as Router, Switch, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Cookie from 'js-cookie';
import { trackPageView } from '@app/utils/stat';
import { I18nProvider, getI18n, useI18n } from '@vesoft-inc/i18n';
import { INTL_LOCALES } from '@app/config/constants';
import { useStore } from '@app/stores';
import AuthorizedRoute from './AuthorizedRoute';
import rootStore, { StoreProvider } from './stores';

import 'dayjs/locale/zh-cn';
import 'antd/dist/reset.css';
import './common.less';
import './app.less';

dayjs.extend(duration);
message.config({ maxCount: 1 });

const Login = lazy(() => import('@app/pages/Login'));
const MainPage = lazy(() => import('@app/pages/MainPage'));

const defaultLanguage = Cookie.get('lang') || document.documentElement.getAttribute('lang');
const { initI18n } = getI18n();
initI18n(defaultLanguage, INTL_LOCALES);
dayjs.locale(defaultLanguage === 'EN_US' ? 'en' : 'zh-cn');

const PageRoot = observer(() => {
  const {
    global: { version },
  } = useStore();
  useEffect(() => {
    trackPageView(`Studio/v${version}`);
  }, []);

  return (
    <StoreProvider value={rootStore}>
      <I18nProvider locales={INTL_LOCALES}>
        <Router>
          <App />
        </Router>
      </I18nProvider>
    </StoreProvider>
  );
});

const App = observer(() => {
  const history = useHistory();
  const { currentLocale } = useI18n();
  const {
    global,
    theme: { algorithm, token, components },
  } = useStore();

  global.history = history;

  useEffect(() => {
    dayjs.locale(currentLocale === 'EN_US' ? 'en' : 'zh-cn');
  }, [currentLocale]);

  return (
    <ConfigProvider
      locale={currentLocale === 'EN_US' ? enUS : zhCN}
      theme={{
        algorithm,
        token,
        components,
      }}
    >
      <Switch>
        <Suspense fallback={<Spin />}>
          <StyleWrapper>
            <Route path="/login" exact={true} component={Login} />
            <AuthorizedRoute component={MainPage} />
          </StyleWrapper>
        </Suspense>
      </Switch>
    </ConfigProvider>
  );
});

const StyleWrapper = observer((props: PropsWithChildren<{}>) => {
  const { token } = theme.useToken();
  return <div style={{ color: token.colorText }}>{props.children}</div>;
});

ReactDom.render(<PageRoot />, document.getElementById('studioApp'));

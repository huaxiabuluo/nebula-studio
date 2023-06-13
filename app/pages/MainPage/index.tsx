import { Suspense } from 'react';
import { Layout, Skeleton } from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom';
import { shouldAlwaysShowWelcome } from '@app/pages/Welcome';
import ErrorBoundary from '@app/components/ErrorBoundary';
import { MENU_LIST, RoutesList } from './routes';
import Header from './Header';
import styles from './index.module.less';

const { Content } = Layout;

const ContentLoading = () => (
  <div className={styles.contentLoading}>
    <Skeleton active paragraph={{ rows: 5 }} />
  </div>
);

const MainPage = () => {
  const redirectPath = shouldAlwaysShowWelcome() ? '/welcome' : '/console';
  return (
    <Layout className={styles.nebulaStudioLayout}>
      <Header menus={MENU_LIST} />
      <Content className={styles.content}>
        <ErrorBoundary>
          <Switch>
            {RoutesList.map((route) => (
              <Route
                path={route.path}
                render={() => (
                  <Suspense fallback={<ContentLoading />}>
                    <Route component={route.component} />
                  </Suspense>
                )}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Redirect from="/" to={{ pathname: redirectPath, search: location.search }} />
          </Switch>
        </ErrorBoundary>
      </Content>
    </Layout>
  );
};
export default MainPage;

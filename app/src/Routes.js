/* eslint-disable react/no-array-index-key */
import React, {
  lazy,
  Suspense,
  Fragment
} from 'react';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import TeacherLayout from 'src/layouts/TeacherLayout';
import StudentLayout from 'src/layouts/StudentLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import MainLayout from 'src/layouts/MainLayout';
import HomeView from 'src/views/sampleViews/pages/HomeView';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';

const routesConfig = [
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/home" />
  },
  {
    exact: true,
    path: '/app',
    component: () => <Redirect to="/app/teacher/dashboard" />
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/sampleViews/pages/Error404View'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    path: '/login-unprotected',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/register',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    exact: true,
    path: '/register-unprotected',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    path: '/app/teacher',
    guard: AuthGuard,
    layout: TeacherLayout,
    routes: [
      {
        exact: true,
        path: '/app/teacher',
        component: () => <Redirect to="/app/teacher/dashboard" />
      },
      {
        exact: true,
        path: '/app/teacher/dashboard',
        component: lazy(() => import('src/views/teacher/dashboard'))
      },
      {
        exact: true,
        path: '/app/teacher/assignments',
        component: lazy(() => import('src/views/teacher/assignments/AssignmentListView'))
      },
      {
        exact: true,
        path: '/app/teacher/assignments/create',
        component: lazy(() => import('src/views/teacher/assignments/AssignmentCreateView'))
      },
      {
        exact: true,
        path: '/app/teacher/assignments/:assignmentId',
        component: lazy(() => import('src/views/teacher/assignments/AssignmentDetailsView'))
      },
      {
        exact: true,
        path: '/app/teacher/assignments/:assignmentId/edit',
        component: lazy(() => import('src/views/teacher/assignments/AssignmentEditView'))
      },
      {
        exact: true,
        path: '/app/teacher/students',
        component: lazy(() => import('src/views/teacher/students/StudentListView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
  {
    path: '/app/student',
    guard: AuthGuard,
    layout: StudentLayout,
    routes: [
      {
        exact: true,
        path: '/app/student',
        component: () => <Redirect to="/app/student/assignments" />
      },
      {
        exact: true,
        path: '/app/student/assignments',
        component: lazy(() => import('src/views/student/assignments/AssignmentListView'))
      }
    ]
  },
  {
    path: '/docs',
    layout: DocsLayout,
    routes: [
      {
        exact: true,
        path: '/docs',
        component: () => <Redirect to="/docs/welcome" />
      },
      {
        exact: true,
        path: '/docs/welcome',
        component: lazy(() => import('src/views/sampleViews/docs/WelcomeView'))
      },
      {
        exact: true,
        path: '/docs/getting-started',
        component: lazy(() => import('src/views/sampleViews/docs/GettingStartedView'))
      },
      {
        exact: true,
        path: '/docs/environment-variables',
        component: lazy(() => import('src/views/sampleViews/docs/EnvironmentVariablesView'))
      },
      {
        exact: true,
        path: '/docs/deployment',
        component: lazy(() => import('src/views/sampleViews/docs/DeploymentView'))
      },
      {
        exact: true,
        path: '/docs/api-calls',
        component: lazy(() => import('src/views/sampleViews/docs/ApiCallsView'))
      },
      {
        exact: true,
        path: '/docs/analytics',
        component: lazy(() => import('src/views/sampleViews/docs/AnalyticsView'))
      },
      {
        exact: true,
        path: '/docs/authentication',
        component: lazy(() => import('src/views/sampleViews/docs/AuthenticationView'))
      },
      {
        exact: true,
        path: '/docs/routing',
        component: lazy(() => import('src/views/sampleViews/docs/RoutingView'))
      },
      {
        exact: true,
        path: '/docs/settings',
        component: lazy(() => import('src/views/sampleViews/docs/SettingsView'))
      },
      {
        exact: true,
        path: '/docs/state-management',
        component: lazy(() => import('src/views/sampleViews/docs/StateManagementView'))
      },
      {
        exact: true,
        path: '/docs/theming',
        component: lazy(() => import('src/views/sampleViews/docs/ThemingView'))
      },
      {
        exact: true,
        path: '/docs/support',
        component: lazy(() => import('src/views/sampleViews/docs/SupportView'))
      },
      {
        exact: true,
        path: '/docs/changelog',
        component: lazy(() => import('src/views/sampleViews/docs/ChangelogView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/home',
        component: HomeView
      },
      {
        exact: true,
        path: '/pricing',
        component: lazy(() => import('src/views/sampleViews/pages/PricingView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

const renderRoutes = (routes) => (routes ? (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
) : null);

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;

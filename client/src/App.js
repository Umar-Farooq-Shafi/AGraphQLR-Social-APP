import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Dimmer, Loader } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { AuthProvider } from './context/auth';

const Home = lazy(() => import('./Pages/Home'));
const Login = lazy(() => import('./Pages/Login'));
const Register = lazy(() => import('./Pages/Register'));
const MenuBar = lazy(() => import('./components/Menu'));
const Post = lazy(() => import('./Pages/Post'));
const AuthRoute = lazy(() => import('./utils/AuthRoute'));


function App() {
  return (
    <Suspense fallback={
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    }>
      <AuthProvider>
        <Router>
          <Container>
            <MenuBar />
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/register" component={Register} />
              <Route path="/posts/:id" component={Post} />
            </Switch>
          </Container>
        </Router>
      </AuthProvider>
    </Suspense>
  );
}

export default App;

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import Error from './components/Error';
import Main from './pages/Main';
import {Login, action as LoginAction } from './pages/Login';
import Chat, { loader as Chatloader } from './pages/Chat';
import Chats from './components/Chats';
import Register, {action as RegisterAction} from './components/Register';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout/>} errorElement={<Error/>}>
    <Route index element={<Main />} />
    <Route path='login' element={<Login/>} action={LoginAction}/>
    <Route path='register' element={<Register/>} action={RegisterAction}/>
    <Route path='chats' element={<Chats/>}>
      <Route path=':chatId' element={<Chat/>} loader={Chatloader}/>
    </Route>
    <Route path='*' element={<NotFound/>}/>
  </Route>
))

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;

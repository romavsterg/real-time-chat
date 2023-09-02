import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import Error from './components/Error';
import Main from './pages/Main';
import {Login, action as LoginAction } from './pages/Login';
import Chats, { loader as ChatsLoader } from './pages/Chats';
import Chat, { loader as ChatLoader }  from './components/Chat';
import Register, {action as RegisterAction, loader as authLoader} from './components/Register';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout/>} errorElement={<Error/>}>
    <Route index element={<Main />} />
    <Route path='login' element={<Login/>} action={LoginAction} loader={authLoader}/>
    <Route path='register' element={<Register/>} action={RegisterAction} loader={authLoader}/>
    <Route path='chats' element={<Chats/>} loader={ChatsLoader}>
      <Route path=':chatId' element={<Chat/>} loader={ChatLoader}/>
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

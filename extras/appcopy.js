
import './App.css';
import {BrowserRouter, Route, Routes,Navigate} from 'react-router-dom';
import Home from './Pages/Home/Home'
import Navigation from "./Components/Shared/Navigation/Navigation";
import Authenticate from './Pages/authenticate/Authenticate';
import Activate from './Pages/Activate/Activate';
import Rooms from './Pages/Rooms/Rooms';
import { useSelector } from 'react-redux';
// const isAuth = true;
// const user = {
//     activated : false,
// };
function App() {
  return (
      <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path='/' exact element={<GuestRoute ><Home/></GuestRoute>}></Route>
        <Route path='/authenticate' element={<GuestRoute ><Authenticate/></GuestRoute>}></Route>
        <Route path='/activate' element={<SemiProtected ><Activate/></SemiProtected>}></Route>
        <Route path='/rooms' element={<Protected ><Rooms/></Protected>}></Route>
      </Routes>
      </BrowserRouter>
  );
}


function GuestRoute({children}){
    const {isAuth} = useSelector((state)=>state.auth);
    if(isAuth){
      return <Navigate to='/rooms' replace/>
    }
    return children;
}
function SemiProtected({children}){
  const {isAuth,user} = useSelector((state)=>state.auth);
  console.log(isAuth);
  console.log(user.activated);
  if(!isAuth){
    return <Navigate to='/' replace/>
  }
  else if(isAuth && !user.activated)
  {
    return children;
  }
  else
  {
    return <Navigate to='/rooms' replace/>  
  }
}
function Protected({children}){
  const {isAuth,user} = useSelector((state)=>state.auth);
  if(!isAuth){
    return <Navigate to='/' replace/>
  }
  else if(isAuth && !user.activated)
  {
    return <Navigate to='/activate' replace/>
  }
  else
  {
    return children;
  }
}

// function App() {
//     return (
//         <BrowserRouter>
//             <Navigation />
//             <Routes>
//                 <GuestRoute path="/" exact>
//                     <Home />
//                 </GuestRoute>
//                 <GuestRoute path="/authenticate">
//                     <Authenticate />
//                 </GuestRoute>
//                 <SemiProtectedRoute path="/activate">
//                     <Activate />
//                 </SemiProtectedRoute>
//                 <ProtectedRoute path="/rooms">
//                     <Rooms />
//                 </ProtectedRoute>
//             </Routes>
//         </BrowserRouter>
//     );
// }

// const GuestRoute = ({ children, ...rest }) => {
//   const { isAuth } = useSelector((state) => state.auth);
//   return (
//       <Route.Fragment
//           {...rest}
//           render={({ location }) => {
//               return isAuth ? (
//                   <Navigate
//                       to={{
//                           pathname: '/rooms',
//                           state: { from: location },
//                       }}
//                   />
//               ) : (
//                   children
//               );
//           }}
//       ></Route.Fragment>
//   );
// };

// const SemiProtectedRoute = ({ children, ...rest }) => {
//   const { user, isAuth } = useSelector((state) => state.auth);
//   return (
//       <Route.Fragment
//           {...rest}
//           render={({ location }) => {
//               return !isAuth ? (
//                   <Navigate
//                       to={{
//                           pathname: '/',
//                           state: { from: location },
//                       }}
//                   />
//               ) : isAuth && !user.activated ? (
//                   children
//               ) : (
//                   <Navigate
//                       to={{
//                           pathname: '/rooms',
//                           state: { from: location },
//                       }}
//                   />
//               );
//           }}
//       ></Route.Fragment>
//   );
// };

// const ProtectedRoute = ({ children, ...rest }) => {
//   const { user, isAuth } = useSelector((state) => state.auth);
//   return (
//       <Route.Fragment
//           {...rest}
//           render={({ location }) => {
//               return !isAuth ? (
//                   <Navigate
//                       to={{
//                           pathname: '/',
//                           state: { from: location },
//                       }}
//                   />
//               ) : isAuth && !user.activated ? (
//                   <Navigate
//                       to={{
//                           pathname: '/activate',
//                           state: { from: location },
//                       }}
//                   />
//               ) : (
//                   children
//               );
//           }}
//       ></Route.Fragment>
//   );
// };

export default App;

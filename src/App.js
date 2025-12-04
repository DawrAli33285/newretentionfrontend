import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Uploadfile from './Uploadfile';
import Login from './login';
import Register from './register';
import ForgotPassword from './resetpassword';
import Dashboard from './superadmin/dashboard';
import UserManagement from './superadmin/usermanagement';
import FileManagement from './superadmin/filemanagement';
import AdminLayout from './superadmin/layout';
import SuperAdminLogin from './superadmin/login';
import SuperAdminRegister from './superadmin/register';
import SuperAdminReset from './superadmin/reset';
import FilesPage from './files';
import Sidebar from './components/sidebar';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import UserInvoiceManagement from './superadmin/invoicemanagement';


const stripePromise = loadStripe("pk_test_51OwuO4LcfLzcwwOYdssgGfUSfOgWT1LwO6ewi3CEPewY7WEL9ATqH6WJm3oAcLDA3IgUvVYLVEBMIEu0d8fUwhlw009JwzEYmV");


function App() {
  return (
    <Elements stripe={stripePromise}>
    <Router>
    <Routes>
      {/* Public routes */}
      <Route path='/' element={<Login />} />
      
      <Route path='/register' element={<Register />} />
      <Route path='/resetpassword' element={<ForgotPassword />} />
      
   
   <Route element={<Sidebar/>}>
   <Route path='/upload' element={<Uploadfile />} />
   <Route path='/files' element={<FilesPage/>}/>
   </Route>

      <Route path='/adminreset' element={<SuperAdminReset/>}/>
      <Route path='/adminregister' element={<SuperAdminRegister/>}/>
      <Route path='/adminlogin' element={<SuperAdminLogin/>}/>
      {/* Admin nested routes */}
      <Route path='/admin' element={<AdminLayout />}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='usermanagement' element={<UserManagement />} />
        <Route path='filemanagement' element={<FileManagement />} />
        <Route path='invoicemanagement' element={<UserInvoiceManagement/>}/>
     
      </Route>
    </Routes>
  </Router>
  </Elements>
  );
}

export default App;
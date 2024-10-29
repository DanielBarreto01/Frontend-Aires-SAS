import { Route, Routes,Navigate } from 'react-router-dom';
import Login from '../components/login/login'; 
import AdminDashboard from '../components/home/AdminDashboard';
import ListUsers from '../components/user/listUsers/ListUsers';
import RegisterUser from '../components/user/registerUser/RegisterUser';
import UserProfile from '../components/user/userProfile/UserProfile';
import UserProfileInfo from '../components/user/UserProfileInfo/UserProfileInfo';
import RessetPassword from '../components/user/resetPassword/PasswordForm';
import PasswordChange from '../components/user/passwordChange/passwordChange';


function AppRouter() {
    return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<RessetPassword />} />
          <Route path="/change-password" element={<PasswordChange />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="users" element={<ListUsers />} />
            <Route path="register" element={<RegisterUser />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="profile-info" element={<UserProfileInfo/>} />
          </Route>
    
      
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      );
    }
  
  export default AppRouter;


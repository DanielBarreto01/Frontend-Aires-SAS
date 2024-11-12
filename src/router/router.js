import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/login/login';
import AdminDashboard from '../components/home/AdminDashboard';
import ListUsers from '../components/user/listUsers/ListUsers';
import RegisterUser from '../components/user/registerUser/RegisterUser';
import UserProfile from '../components/user/userProfile/UserProfile';
import UserProfileInfo from '../components/user/UserProfileInfo/UserProfileInfo';
import RessetPassword from '../components/user/resetPassword/PasswordForm';
import PasswordChange from '../components/user/passwordChange/passwordChange';
import ListEquipments from '../components/equipments/listEquipments/ListEquipments';
import RegisterEquipment from '../components/equipments/registerEquipments/RegisterEquipment';
import UpdateEquipment from '../components/equipments/updateEquipments/UpdateEquipment';
import ListClients from '../components/clients/listClients/ListClients';

import CustomerSelection from '../components/clients/customerSelection/CustomerSelection';


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
        <Route path="profile-info" element={<UserProfileInfo />} />

        <Route path="equipments" element={<ListEquipments />}>
          <Route path="register" element={<RegisterEquipment />} />
          <Route path="update" element={<UpdateEquipment />} />
        </Route>

        <Route path="clients" element={<ListClients />}>
          <Route path="CustomerSelection" element={<CustomerSelection />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}


export default AppRouter;


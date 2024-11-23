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
import UpdateClient from '../components/clients/updateClient/UpdateClient';
import EquipmentClientSelectionList from '../components/clients/updateClient/equipmentClientSelectionList/EquipmentClientSelectionList';
import CustomerSelection from '../components/clients/customerSelection/CustomerSelection';
import RegisterClient from '../components/clients/registerClient/registerClient';
import ListRequestMaintenance from '../components/maintenanceRequest/listRequestMaintenance/ListRequestMaintenance';
import Welcome from '../components/home/Welcome';
import RegisterRequestMaintenance from '../components/maintenanceRequest/registerRequestMaintenance/RegisterRequestMaintenance';
import ListSelectEquipment from '../components/maintenanceRequest/listSelectEquipmentAndTechnician/ListSelectedEquipment';
import ListSelectedTechnician from '../components/maintenanceRequest/listSelectEquipmentAndTechnician/ListSelectedTechnician';

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
        <Route path="welcome" element={<Welcome />} />
        <Route path="equipments" element={<ListEquipments />}>
          <Route path="register" element={<RegisterEquipment />} />
          <Route path="update" element={<UpdateEquipment />} />
        </Route>

        <Route path="clients" element={<ListClients />}>
       
          <Route path="CustomerSelection" element={<CustomerSelection />}>
            <Route path="register" element={<RegisterClient />} />
          </Route>

          <Route path="update" element={<UpdateClient />}>
            <Route path="equipmentClientSelectionList" element={<EquipmentClientSelectionList />} />
          </Route>
        </Route>
        
        <Route path="requestMaintenance" element={<ListRequestMaintenance/>} >
          <Route path="clients" element={<ListClients />}>
            <Route path="registerRequestMaintenance" element={<RegisterRequestMaintenance />} >
              <Route path="listSelectEquipment" element={<ListSelectEquipment />} />
              <Route path="listSelectedTechnician" element={<ListSelectedTechnician />} />
              <Route path="showClient" element={<UpdateClient />}/>
            </Route>
          </Route>
        </Route>
 
      </Route>
      {localStorage.getItem('authToken')?  
        <Route index element={<Navigate to="/admin/welcome" />}/>:
        <Route index element={<Navigate to="/login" />} /> 
      }

      <Route path="*" element={<h2>404 Not Found</h2>} />
     
    </Routes>
  );
}


export default AppRouter;


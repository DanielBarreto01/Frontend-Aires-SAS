import { Route, Routes,Navigate } from 'react-router-dom';
import Login from '../components/login/login'; 
import AdminDashboard from '../components/home/AdminDashboard';
import ListUsers from '../components/listUsers/ListUsers';
import RegisterUser from '../components/registerUser/RegisterUser';


function AppRouter() {
    return (
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/users" element={<ListUsers />} />
                <Route path="/register" element={<RegisterUser />} />
                <Route path="*" element={<Navigate to="/register" />} />
               
                
            </Routes>
    );
}

export default AppRouter;

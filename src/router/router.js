import { Route, Routes,Navigate } from 'react-router-dom';
import Login from '../components/login/login'; 
import AdminDashboard from '../components/home/AdminDashboard';
import ListUsers from '../components/listUsers/ListUsers';


function AppRouter() {
    return (
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/users" element={<ListUsers />} />
                <Route path="*" element={<Navigate to="/login" />} />
                
            </Routes>
    );
}

export default AppRouter;

import { Route, Routes,Navigate } from 'react-router-dom';
import Login from '../components/login/login'; 
import AdminDashboard from '../components/home/AdminDashboard';


function AppRouter() {
    return (
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
    );
}

export default AppRouter;
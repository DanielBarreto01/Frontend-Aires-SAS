import { Route, BrowserRouter as Router, Routes,Navigate } from 'react-router-dom';
import Login from '../components/login/login'; 
import AdminDashboard from '../components/home/AdminDashboard';


function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
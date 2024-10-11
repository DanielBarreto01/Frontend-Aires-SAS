import { Route, BrowserRouter as Router, Routes,Navigate } from 'react-router-dom';
import Login from '../components/login/login'; 
//import 'bootstrap/dist/css/bootstrap.min.css';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
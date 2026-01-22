import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleApiError } from '../utils/helpers';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        // Tampilkan pesan sukses dari register jika ada
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Hapus state agar pesan tidak muncul lagi saat refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/');
        } catch (error) {
            setError(handleApiError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        alert(`Login dengan ${provider} belum tersedia`);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <h1>Style <span className="gradient-text">Hub</span></h1>
                    </Link>
                    <p className="auth-subtitle">Masuk ke akun Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-modern">
                    {successMessage && (
                        <div className="alert alert-success">
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <div className="form-group-modern">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control-modern"
                            placeholder="nama@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-modern">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="form-control-modern"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-footer">
                        <Link to="/forgot-password" className="forgot-link">
                            Lupa password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary-gradient btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>

                    <div className="divider">
                        <span>atau masuk dengan</span>
                    </div>


                    <div className="auth-link">
                        Belum punya akun? <Link to="/register" className="link-primary">Daftar sekarang</Link>
                    </div>
                </form>

                <Link to="/" className="back-home">
                    ← Kembali ke Home
                </Link>
            </div>
        </div>
    );
};

export default Login;
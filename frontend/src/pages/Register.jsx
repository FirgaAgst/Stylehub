import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleApiError } from '../utils/helpers';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: ''
    });

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

        if (formData.password !== formData.password_confirmation) {
            setError('Password tidak cocok');
            return;
        }

        setLoading(true);

        try {
            await register(formData);
            // Redirect ke login dengan pesan sukses
            navigate('/login', { 
                state: { 
                    message: 'Registrasi berhasil! Silakan login dengan akun Anda.' 
                }
            });
        } catch (error) {
            setError(handleApiError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        alert(`Daftar dengan ${provider} belum tersedia`);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <h1>Style <span className="gradient-text">Hub</span></h1>
                    </Link>
                    <p className="auth-subtitle">Buat akun baru</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-modern">
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <div className="form-group-modern">
                        <label htmlFor="name">Nama Lengkap</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control-modern"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        <label htmlFor="phone">Nomor Telepon</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-control-modern"
                            placeholder="08123456789"
                            value={formData.phone}
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

                    <div className="form-group-modern">
                        <label htmlFor="password_confirmation">Konfirmasi Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="password_confirmation"
                                name="password_confirmation"
                                className="form-control-modern"
                                placeholder="••••••••"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary-gradient btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>

                    <div className="auth-link">
                        Sudah punya akun? <Link to="/login" className="link-primary">Masuk sekarang</Link>
                    </div>
                </form>

                <Link to="/" className="back-home">
                    ← Kembali ke Home
                </Link>
            </div>
        </div>
    );
};

export default Register;
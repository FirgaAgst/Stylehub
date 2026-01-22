import React from 'react';
import '../styles/global.css';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
    const sizeClass = {
        small: 'spinner-small',
        medium: 'spinner-medium',
        large: 'spinner-large'
    }[size];

    const spinner = (
        <div className={`spinner ${sizeClass}`}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="loading-overlay">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
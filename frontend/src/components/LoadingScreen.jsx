import React from 'react';
import { Loader2 } from 'lucide-react';
import '../styles/loadingscreen.css';

const LoadingScreen = ({ message = "Fetching the best for you..." }) => {
    return (
        <div className="loading-overlay">
            <div className="loader-content">
                <div className="loader-orbit">
                    <div className="loader-inner-circle">
                        <Loader2 className="loader-spinner" size={48} />
                    </div>
                    <div className="orbit-dot dot-1"></div>
                    <div className="orbit-dot dot-2"></div>
                    <div className="orbit-dot dot-3"></div>
                </div>
                <div className="loader-text-wrap">
                    <h2 className="loader-title">MediEcom</h2>
                    <p className="loader-subtitle">{message}</p>
                </div>
                <div className="loader-progress-bar">
                    <div className="progress-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;

import React from 'react';
import '../styles/skeletons.css';

export const CategorySkeleton = () => (
    <div className="skeleton-cat-card">
        <div className="skeleton-img-circle pulse"></div>
        <div className="skeleton-text pulse"></div>
    </div>
);

export const ProductCardSkeleton = () => (
    <div className="skeleton-product-card">
        <div className="skeleton-product-img pulse"></div>
        <div className="skeleton-product-info">
            <div className="skeleton-line pulse" style={{ width: '80%' }}></div>
            <div className="skeleton-line pulse" style={{ width: '40%' }}></div>
            <div className="skeleton-line-thick pulse" style={{ width: '30%' }}></div>
        </div>
    </div>
);

const Skeletons = {
    Category: CategorySkeleton,
    Product: ProductCardSkeleton
};

export default Skeletons;

import React, { useEffect, useState } from 'react';
import productService from '../services/productService';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await productService.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading categories...</div>;
    }

    return (
        <div className="category-filter">
            <h3>Kategori</h3>
            <ul className="category-list">
                <li 
                    className={!selectedCategory ? 'active' : ''}
                    onClick={() => onCategoryChange(null)}
                >
                    Semua Produk
                </li>
                {categories.map(category => (
                    <li 
                        key={category.id}
                        className={selectedCategory === category.slug ? 'active' : ''}
                        onClick={() => onCategoryChange(category.slug)}
                    >
                        {category.name} ({category.product_count})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryFilter;
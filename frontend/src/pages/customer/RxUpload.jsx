import React, { useState } from 'react';
import { Upload, FileText, Search, ArrowRight, AlertCircle, Check, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import '../../styles/rxupload.css';
import BuyerNavbar from '../../components/BuyerNavbar';

const RxUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [extractedMeds, setExtractedMeds] = useState(null);
    const [alternatives, setAlternatives] = useState({});
    const [loadingAlternatives, setLoadingAlternatives] = useState({});

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setExtractedMeds(null);
            setAlternatives({});
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('rx_image', file);

        try {
            // Call Laravel Backend Proxy
            const response = await api.post('/medical-inventory/analyze-rx', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Expecting response.data to be the array of medicines
            // If response structure is { data: [...] }, adjust accordingly.
            // Our Controller returns response()->json($mockResponse), so it is directly the array (or object if wrapped).
            // Axios returns data in response.data.
            const data = response.data;
            setExtractedMeds(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Error analyzing prescription:", error);
            alert("Failed to analyze prescription. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const fetchAlternatives = async (genericName, index) => {
        setLoadingAlternatives(prev => ({ ...prev, [index]: true }));
        try {
            const response = await api.get(`/medical-inventory/alternatives?generic_name=${encodeURIComponent(genericName)}`);
            setAlternatives(prev => ({
                ...prev,
                [index]: response.data
            }));
        } catch (error) {
            console.error("Error fetching alternatives", error);
        } finally {
            setLoadingAlternatives(prev => ({ ...prev, [index]: false }));
        }
    };

    const addToCart = (product) => {
        if (product.stock <= 0) {
            alert('Sorry, this item is out of stock! Let\'s continue shopping for other items.');
            return;
        }

        // eslint-disable-next-line no-console
        console.log('Adding to cart:', product);
        const savedCart = localStorage.getItem('mediEcom_cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];

        cart.push(product);
        localStorage.setItem('mediEcom_cart', JSON.stringify(cart));
        // alert(`${product.product_name || product.name} added to cart!`);
    };

    const handleOrderNow = async (medName) => {
        try {
            const response = await api.get(`/medical-inventory?q=${encodeURIComponent(medName)}`);
            const items = response.data.data ? response.data.data : (Array.isArray(response.data) ? response.data : []);

            if (items.length > 0) {
                const item = items[0];
                const cartItem = {
                    id: item.id,
                    name: item.product_name,
                    image: item.image ? `http://127.0.0.1:8000/storage/${item.image}` : ('https://via.placeholder.com/200x200?text=' + encodeURIComponent(item.product_name)),
                    price: parseFloat(item.price),
                    originalPrice: item.mrp ? parseFloat(item.mrp) : null,
                    stock: item.stock,
                };
                addToCart(cartItem);
            } else {
                alert(`"${medName}" not found in inventory. Please check alternatives.`);
            }
        } catch (error) {
            console.error("Error ordering item:", error);
            alert("Failed to order item. Please try again.");
        }
    };

    return (
        <div className="rx-page">
            <BuyerNavbar />

            <div className="rx-container">
                <div className="rx-header">
                    <h1>Upload Prescription</h1>
                    <p>Upload your prescription to automatically find medicines and their safe alternatives.</p>
                </div>

                <div className="rx-content-grid">
                    {/* Upload Section */}
                    <div className="rx-card upload-section">
                        <div className={`dropzone ${file ? 'has-file' : ''}`}>
                            <input type="file" id="rx-file" accept="image/*" onChange={handleFileChange} />
                            <label htmlFor="rx-file">
                                {preview ? (
                                    <img src={preview} alt="Rx Preview" className="rx-preview" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <Upload className="icon-lg" />
                                        <span>Click to Upload Rx Image</span>
                                        <small>Supported: JPG, PNG, WEBP</small>
                                    </div>
                                )}
                            </label>
                        </div>

                        {file && (
                            <button
                                className="btn-primary full-width mt-4"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? <><Loader2 className="spin" /> Processing...</> : 'Analyze Prescription'}
                            </button>
                        )}
                    </div>

                    {/* Results Section */}
                    {extractedMeds && (
                        <div className="rx-results">
                            <h2>Extracted Medicines</h2>
                            <div className="med-list">
                                {extractedMeds.map((med, idx) => (
                                    <div key={idx} className="med-item-card">
                                        <div className="med-info">
                                            <div className="med-icon">
                                                <FileText />
                                            </div>
                                            <div>
                                                <h3>{med.name}</h3>
                                                <span className="badge-generic">{med.generic}</span>
                                                <span className="badge-dosage">{med.dosage}</span>
                                            </div>
                                        </div>

                                        <div className="med-actions">
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleOrderNow(med.name)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Order Now
                                            </button>
                                            <button
                                                className="btn-outline"
                                                onClick={() => fetchAlternatives(med.generic, idx)}
                                                disabled={loadingAlternatives[idx]}
                                            >
                                                {loadingAlternatives[idx] ? <Loader2 className="spin" /> : 'Find Alternatives'}
                                            </button>
                                        </div>

                                        {/* Alternatives Dropdown/List */}
                                        {alternatives[idx] && (
                                            <div className="alternatives-list fade-in">
                                                <h4>Available Alternatives for {med.generic}:</h4>
                                                {alternatives[idx].length > 0 ? (
                                                    <div className="alt-grid">
                                                        {alternatives[idx].map(alt => (
                                                            <div key={alt.id} className="alt-card">
                                                                <div className="alt-img">
                                                                    <img
                                                                        src={alt.image ? `http://127.0.0.1:8000/storage/${alt.image}` : 'https://via.placeholder.com/100'}
                                                                        alt={alt.product_name}
                                                                    />
                                                                </div>
                                                                <div className="alt-details">
                                                                    <h5>{alt.product_name}</h5>
                                                                    <p className="price">Rs. {alt.price}</p>
                                                                    <button className="btn-sm" onClick={() => {
                                                                        addToCart({
                                                                            id: alt.id,
                                                                            name: alt.product_name,
                                                                            image: alt.image ? `http://127.0.0.1:8000/storage/${alt.image}` : ('https://via.placeholder.com/200x200?text=' + encodeURIComponent(alt.product_name)),
                                                                            price: parseFloat(alt.price),
                                                                            originalPrice: alt.mrp ? parseFloat(alt.mrp) : null,
                                                                            stock: alt.stock,
                                                                        });
                                                                    }}>
                                                                        Add to Cart
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="no-alt">No alternatives found in inventory.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RxUpload;

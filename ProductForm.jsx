import React, { useState } from 'react';
// Importe o CSS do exemplo anterior ou use Tailwind/Styled Components
import './ProductForm.css'; 

const ProductForm = () => {
    const [formData, setFormData] = useState({
        name: '', category: '', sku: '', price: '', stock: '', description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Atualiza campos de texto
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Processa a imagem selecionada
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("A imagem é muito grande! Limite de 5MB.");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Envia os dados para o Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Usamos FormData para enviar arquivos (imagens) junto com os textos
        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('sku', formData.sku);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        if (imageFile) data.append('image', imageFile);

        try {
            // Substitua pela URL real da sua API
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                alert('Produto cadastrado com sucesso!');
                // Limpa o formulário
                setFormData({ name: '', category: '', sku: '', price: '', stock: '', description: '' });
                setImageFile(null);
                setImagePreview(null);
            } else {
                alert('Erro ao cadastrar produto.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1>Cadastrar Novo Produto</h1>
                <p>Preencha as informações abaixo.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Nome do Produto *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Categoria *</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Selecione...</option>
                            <option value="roupas">Roupas</option>
                            <option value="eletronicos">Eletrônicos</option>
                            <option value="casa">Casa e Decoração</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Preço (R$) *</label>
                        <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} required />
                    </div>

                    <div className="form-group full-width">
                        <label>Imagem do Produto</label>
                        <div className="image-upload-area">
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            <span>📷 Clique para enviar</span>
                        </div>
                        {imagePreview && <img src={imagePreview} alt="Preview" id="imagePreview" />}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Salvando...' : 'Cadastrar Produto'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
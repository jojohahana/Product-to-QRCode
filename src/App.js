import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({ name: '', price: '', description: '' });
  const [editIndex, setEditIndex] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    // Fetch initial product list if needed
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleAddProduct = () => {
    if (editIndex !== null) {
      const updatedProducts = products.map((p, index) => (index === editIndex ? product : p));
      setProducts(updatedProducts);
      setEditIndex(null);
    } else {
      setProducts([...products, product]);
    }
    setProduct({ name: '', price: '', description: '' });
  };

  const handleEditProduct = (index) => {
    setProduct(products[index]);
    setEditIndex(index);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handlePrintProduct = (index) => {
    const productToPrint = products[index];
    const printWindow = window.open('', '', 'width=600,height=400');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(`<p>Name: ${productToPrint.name}</p>`);
    printWindow.document.write(`<p>Price: ${productToPrint.price}</p>`);
    printWindow.document.write(`<p>Description: ${productToPrint.description}</p>`);
    const qrCodeData = JSON.stringify(productToPrint);
    printWindow.document.write('<div id="qrcode"></div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.onload = () => {
      const qrCodeContainer = printWindow.document.getElementById('qrcode');
      const qrCodeElement = document.createElement('canvas');
      QRCode.toCanvas(qrCodeElement, qrCodeData, function (error) {
        if (error) console.error(error);
        qrCodeContainer.appendChild(qrCodeElement);
        printWindow.print();
        printWindow.close();
      });
    };
  };

  return (
    <div className="App">
      <h1>Product CRUD with QR Code</h1>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="price"
        placeholder="Product Price"
        value={product.price}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Product Description"
        value={product.description}
        onChange={handleInputChange}
      />
      <button onClick={handleAddProduct}>
        {editIndex !== null ? 'Update Product' : 'Add Product'}
      </button>
      <div>
        <h2>Product List</h2>
        <ul>
          {products.map((p, index) => (
            <li key={index}>
              <p>{`Name: ${p.name}, Price: ${p.price}, Description: ${p.description}`}</p>
              <button onClick={() => handleEditProduct(index)}>Edit</button>
              <button onClick={() => handleDeleteProduct(index)}>Delete</button>
              <button onClick={() => handlePrintProduct(index)}>Print</button>
              <QRCode value={JSON.stringify(p)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditModal from './component/EditModal';

const App = () => {
  const [update, setupdate] = useState(0)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [itemCount, setItemCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  useEffect(() => {
    fetchItemCount();
    fetchUpdateCount();
    fetchItems();
  }, []);

  const fetchItemCount = () => {
    axios.get('https://dataneuron2.onrender.com/api/count')
      .then(response => {
        setItemCount(response.data.itemCount);
      })
      .catch(error => {
        console.error('Error fetching item count:', error);
      });
  };

  const fetchUpdateCount = () => {
    axios.get('https://dataneuron2.onrender.com/api/update/count')
      .then(response => {
        setUpdateCount(response.data.updateCount);
      })
      .catch(error => {
        console.error('Error fetching update count:', error);
      });
  };


  const fetchItems = () => {
    axios.get('https://dataneuron2.onrender.com/api/items')
      .then(response => {
        setItems(response.data.data);
        setupdate(+response.data.update)
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  };

  const handleAddItem = () => {
    axios.post('https://dataneuron2.onrender.com/api/add', { name, description })
      .then(response => {
        console.log('Item added successfully');
        setName('');
        setDescription('');
        fetchItemCount();
        fetchItems();
        alert("Task Added")
      })
      .catch(error => {
        console.error('Error adding item:', error);
      });
  };



  const handleEdit = (id) => {
    const selectedItem = items.find(item => item._id === id);
    if (selectedItem) {
      setSelectedItem(selectedItem);
      setShowModal(true);
    }
  };

  return (
    <div style={{ height: "auto", width: "100vw", border: "3px solid teal", textAlign: "center" }}>


      <div style={{ height: "auto", width: "400px", border: "3px solid teal", margin: "auto" }}>
        <h1 style={{ textDecoration: "underline" }}>Add/Update Item</h1>
        <hr />
        <label>Name</label>
        <br />
        <input style={{ padding: "5px" }} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label>Description</label>
        <br />
        <input style={{ padding: "5px" }} type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <br />
        <br />
        <button style={{ padding: "5px", backgroundColor: "teal", color: "white" }} onClick={handleAddItem}>Add</button>
        <hr />
        <h4>Item count: <span style={{ backgroundColor: "yellow" }}>{itemCount}</span></h4>

        <h4>Update count: <span style={{ backgroundColor: "yellow" }}>{update}</span></h4>
        <hr />
        <h2 style={{ textDecoration: "underline" }}>Items</h2>
        <ul>
          {items.length > 0 && items.map(item => (
            <div style={{ height: "auto", width: "80%", margin: "auto", display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <li key={item._id} onClick={() => handleEdit(item._id)}>
                {item.name} - {item.description}

              </li>
              <button style={{ padding: "3px", backgroundColor: "teal", color: "white" }} onClick={() => handleEdit(item._id)}>Edit</button>
            </div>
          ))}
        </ul>
      </div>
      {showModal && (
        <EditModal
          itemId={selectedItem._id}
          initialName={selectedItem.name}
          initialDescription={selectedItem.description}
          onClose={() => setShowModal(false)}
          setupdate={setupdate}
          onEdit={() => {
            fetchItems();
            fetchUpdateCount();
          }}
        />
      )}
    </div>
  );
};

export default App;

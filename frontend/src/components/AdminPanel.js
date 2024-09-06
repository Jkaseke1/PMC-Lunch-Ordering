import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, TextField, Button, Typography, List, ListItem, ListItemText, Divider, MenuItem, Select, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanel = () => {
  const [menus, setMenus] = useState({
    Ruth: { entrees: [], starches: [], sides: [], desserts: [] },
    Makagi: { entrees: [], starches: [], sides: [], desserts: [] }
  });
  const [orders, setOrders] = useState([]);
  const [newMenu, setNewMenu] = useState({ caterer: '', items: [] });
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        toast.error('You must be logged in to view this page.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.email !== 'jkaseke@tpg.co.zw') {
          toast.error('You do not have access to this page.');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to verify admin status.');
        navigate('/dashboard');
      }
    };

    checkAdmin();
    loadMenus();
    loadOrders();
  }, [navigate]);

  const loadMenus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu');
      console.log('Menus fetched:', response.data); // Debugging log
      setMenus(response.data);
    } catch (error) {
      toast.error('Failed to load menus.');
    }
  };

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      console.log('Orders fetched:', response.data); // Debugging log
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders.');
    }
  };

  const handleAddItem = () => {
    const newItem = { name: itemName, description: itemDescription, price: itemPrice || 0 }; // Price is optional
    setNewMenu(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setSelectedCategory('');
  };

  const handleEditItem = (item) => {
    setItemName(item.name);
    setItemDescription(item.description);
    setItemPrice(item.price || '');
  };

  const handleSubmitMenu = async () => {
    try {
      await axios.post('http://localhost:5000/api/menu', newMenu);
      toast.success('Menu added successfully!');
      setNewMenu({ caterer: '', items: [] });
      loadMenus();
    } catch (error) {
      toast.error('Failed to add menu.');
    }
  };

  const generateReport = async (type) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports?type=${type}`);
      toast.success(`${type} report generated successfully!`);
    } catch (error) {
      toast.error(`Failed to generate ${type} report.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handlePrintOrders = (caterer) => {
    const printContent = document.getElementById(`orders-${caterer}`).innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const handleSendOrders = async () => {
    try {
      await axios.post('http://localhost:5000/api/orders/email');
      toast.success('Orders sent via email successfully!');
    } catch (error) {
      toast.error('Failed to send orders via email.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Add New Menu
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Caterer Name</InputLabel>
              <Select
                value={newMenu.caterer}
                onChange={(e) => setNewMenu({ ...newMenu, caterer: e.target.value })}
              >
                <MenuItem value="Ruth">Ruth</MenuItem>
                <MenuItem value="Makagi">Makagi</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="entrees">Entrees</MenuItem>
                <MenuItem value="starches">Starches</MenuItem>
                <MenuItem value="sides">Sides</MenuItem>
                <MenuItem value="desserts">Desserts</MenuItem>
              </Select>
            </FormControl>
            {selectedCategory && newMenu.caterer && menus[newMenu.caterer] && Array.isArray(menus[newMenu.caterer][selectedCategory]) && (
              <div>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items
                </Typography>
                <List>
                  {menus[newMenu.caterer][selectedCategory].map((item, index) => (
                    <ListItem key={index} button onClick={() => handleEditItem(item)}>
                      <ListItemText primary={`${item.name} - ${item.description} (${item.price ? `$${item.price}` : 'Price not set'})`} />
                    </ListItem>
                  ))}
                </List>
              </div>
            )}
            <Typography variant="subtitle1" gutterBottom>
              Add Item
            </Typography>
            <TextField
              label="Item Name"
              fullWidth
              margin="normal"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              label="Item Description"
              fullWidth
              margin="normal"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
            <TextField
              label="Item Price"
              type="number"
              fullWidth
              margin="normal"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginTop: '10px' }}>
              Add Item
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSubmitMenu} style={{ marginTop: '10px', marginLeft: '10px' }}>
              Submit Menu
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Current Menus
            </Typography>
            {Object.entries(menus).map(([caterer, categories]) => (
              <div key={caterer}>
                <Typography variant="subtitle1">{caterer}</Typography>
                <List>
                  {Object.entries(categories).map(([category, items]) => (
                    <div key={category}>
                      <Typography variant="subtitle2">{category}</Typography>
                      {Array.isArray(items) && items.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`${item.name} - ${item.description} (${item.price ? `$${item.price}` : 'Price not set'})`} />
                        </ListItem>
                      ))}
                      <Divider />
                    </div>
                  ))}
                </List>
              </div>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Orders
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Ruth</Typography>
                <div id="orders-Ruth">
                  {orders.filter(order => order.caterer === 'Ruth').map(order => (
                    <Accordion key={order._id}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{order.user.username}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="subtitle1">Date: {new Date(order.date).toLocaleDateString()}</Typography>
                        <List>
                          {order.selectedItems.map((item, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={`${item.category}: ${item.name}`} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
                <Button variant="contained" color="primary" onClick={() => handlePrintOrders('Ruth')} style={{ marginTop: '10px', marginRight: '10px' }}>
                  Print Orders
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Makagi</Typography>
                <div id="orders-Makagi">
                  {orders.filter(order => order.caterer === 'Makagi').map(order => (
                    <Accordion key={order._id}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{order.user.username}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="subtitle1">Date: {new Date(order.date).toLocaleDateString()}</Typography>
                        <List>
                          {order.selectedItems.map((item, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={`${item.category}: ${item.name}`} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
                <Button variant="contained" color="primary" onClick={() => handlePrintOrders('Makagi')} style={{ marginTop: '10px', marginRight: '10px' }}>
                  Print Orders
                </Button>
              </Grid>
            </Grid>
            <Button variant="contained" color="secondary" onClick={handleSendOrders} style={{ marginTop: '10px' }}>
              Send Orders via Email
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Finance Reports
            </Typography>
            <Button variant="contained" color="primary" onClick={() => generateReport('weekly')} style={{ marginRight: '10px' }}>
              Generate Weekly Report
            </Button>
            <Button variant="contained" color="secondary" onClick={() => generateReport('monthly')}>
              Generate Monthly Report
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default AdminPanel;
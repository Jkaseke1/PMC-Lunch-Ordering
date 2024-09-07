
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GrainIcon from '@mui/icons-material/Grain';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CakeIcon from '@mui/icons-material/Cake';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';

const SelectedListItem = styled(ListItem)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.primary.light : 'inherit',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.action.hover,
    color: selected ? theme.palette.common.white : 'inherit',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  border: `2px solid purple`,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.primary,
  backgroundColor: 'lightgrey',
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState({
    Ruth: { entrees: null, starches: null, sides: null, desserts: null },
    Makagi: { entrees: null, starches: null, sides: null, desserts: null },
  });
  const [menu, setMenu] = useState({
    Ruth: { entrees: [], starches: [], sides: [], desserts: [] },
    Makagi: { entrees: [], starches: [], sides: [], desserts: [] },
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCaterer, setSelectedCaterer] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const loadMenu = () => {
      const updatedMenu = {
        Ruth: {
          entrees: [
            { name: 'Beef Stew' },
            { name: 'Chicken Stew' },
            { name: 'Guru Matambu' },
            { name: 'Smoked Sausage' },
            { name: 'Tbone' },
            { name: 'Gango' },
            { name: 'Roast' },
            { name: 'Mixed Grill' },
            { name: 'Chicken Burger' },
          ],
          starches: [
            { name: 'Chips' },
            { name: 'Wedges' },
            { name: 'Rice' },
            { name: 'Rice Dovi' },
            { name: 'Sadza' },
          ],
          sides: [
            { name: 'Mixed Vegetables' },
            { name: 'Butternut' },
          ],
          desserts: [{ name: 'Fruitpack' }],
        },
        Makagi: {
          entrees: [
            { name: 'Ground Beef with Sausage and Beans' },
            { name: 'Chicken Stew' },
            { name: 'Beef Stew' },
            { name: 'Mixed Grill' },
            { name: 'Chicken Roast' },
            { name: 'Bacon Burger' },
          ],
          starches: [
            { name: 'Spaghetti' },
            { name: 'Chips' },
            { name: 'Rice' },
            { name: 'Peanut Butter Rice' },
            { name: 'Sadza' },
          ],
          sides: [
            { name: 'Coleslaw' },
            { name: 'Mixed Vegetables' },
            { name: 'Leafy Green Vegetables' },
          ],
          desserts: [
            { name: 'Snack Pack (Crackers, Juice & Fruits)' },
            { name: 'Fruitpack (Fruits and Yoghurt)' },
          ],
        },
      };
      setMenu(updatedMenu);
    };

    loadMenu();

    const storedOrderDetails = localStorage.getItem('orderDetails');
    if (storedOrderDetails) {
      setOrderDetails(JSON.parse(storedOrderDetails));
    }
  }, []);

  const handleItemClick = (item, category, caterer) => {
    if (selectedCaterer && selectedCaterer !== caterer) {
      toast.error('You can only select items from one caterer.');
      return;
    }

    setSelectedCaterer(caterer);
    setSelectedItems(prevState => ({
      ...prevState,
      [caterer]: {
        ...prevState[caterer],
        [category]: prevState[caterer][category]?.name === item.name ? null : item,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedItems[selectedCaterer].entrees || !selectedItems[selectedCaterer].starches) {
      toast.error('Please select at least an entree and a starch.');
      return;
    }

    const selectedItemsArray = Object.entries(selectedItems[selectedCaterer])
      .filter(([category, item]) => item !== null)
      .map(([category, item]) => ({ category, name: item.name }));

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('You must be logged in to place an order.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const orderPayload = {
        user: userId,
        caterer: selectedCaterer,
        date: selectedDate.toISOString(),
        selectedItems: selectedItemsArray.map(item => ({
          ...item,
          caterer: selectedCaterer, // Include the caterer name here
        })),
      };

      console.log('Order Payload:', orderPayload); // Debugging line
      const response = await axios.post('http://localhost:5000/api/orders', orderPayload, config);
      
      // Ensure the response contains the caterer name
      const orderResponse = {
        ...response.data,
        selectedItems: response.data.selectedItems.map(item => ({
          ...item,
          caterer: selectedCaterer, // Add caterer name to each item
        })),
      };
      
      toast.success('Order placed successfully!');
      setOrderDetails(orderResponse);
      localStorage.setItem('orderDetails', JSON.stringify(orderResponse));
      setSelectedItems({
        Ruth: { entrees: null, starches: null, sides: null, desserts: null },
        Makagi: { entrees: null, starches: null, sides: null, desserts: null },
      });
      setSelectedCaterer('');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('You must be logged in to cancel an order.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      console.log('Order ID:', orderDetails._id); // Debugging line
      await axios.delete(`http://localhost:5000/api/orders/${orderDetails._id}`, config);

      toast.success('Order cancelled successfully!');
      setOrderDetails(null);
      localStorage.removeItem('orderDetails');
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error('Failed to cancel order. Please try again.');
    }
  };

  const handleEditOrder = async () => {
    if (orderDetails) {
      const updatedSelectedItems = {
        Ruth: { entrees: null, starches: null, sides: null, desserts: null },
        Makagi: { entrees: null, starches: null, sides: null, desserts: null },
      };

      orderDetails.selectedItems.forEach(item => {
        updatedSelectedItems[item.caterer][item.category] = { name: item.name };
      });

      setSelectedItems(updatedSelectedItems);
      setSelectedCaterer(orderDetails.caterer);
      setSelectedDate(new Date(orderDetails.date));
    }
  };

  const handleAddToOrder = async () => {
    if (!selectedItems[selectedCaterer].entrees && !selectedItems[selectedCaterer].starches) {
      toast.error('Please select at least an entree or a starch.');
      return;
    }

    const additionalItemsArray = Object.entries(selectedItems[selectedCaterer])
      .filter(([category, item]) => item !== null)
      .map(([category, item]) => ({ category, name: item.name }));

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('You must be logged in to add items to the order.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const updatedOrderPayload = {
        ...orderDetails,
        selectedItems: [...orderDetails.selectedItems, ...additionalItemsArray.map(item => ({
          ...item,
          caterer: selectedCaterer, // Include the caterer name here
        }))],
      };

      console.log('Updated Order Payload:', updatedOrderPayload); // Debugging line
      const response = await axios.put(`http://localhost:5000/api/orders/${orderDetails._id}`, updatedOrderPayload, config);
      
      // Ensure the response contains the caterer name
      const updatedOrderResponse = {
        ...response.data,
        selectedItems: response.data.selectedItems.map(item => ({
          ...item,
          caterer: selectedCaterer, // Add caterer name to each item
        })),
      };
      
      toast.success('Items added to order successfully!');
      setOrderDetails(updatedOrderResponse);
      localStorage.setItem('orderDetails', JSON.stringify(updatedOrderResponse));
      setSelectedItems({
        Ruth: { entrees: null, starches: null, sides: null, desserts: null },
        Makagi: { entrees: null, starches: null, sides: null, desserts: null },
      });
      setSelectedCaterer('');
    } catch (error) {
      console.error('Failed to add items to order:', error);
      toast.error('Failed to add items to order. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('orderDetails');
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lunch Ordering Dashboard
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        style={{ marginBottom: '20px' }}
      >
        Logout
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Select Date
          </Typography>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            className="border p-2 rounded w-full"
          />
        </Grid>
        {orderDetails && (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
              <Typography variant="h6" gutterBottom>
                Your Ordered Menu
              </Typography>
              <Typography variant="subtitle1">
                Date: {new Date(orderDetails.date).toLocaleDateString()}
              </Typography>
              <List>
                {orderDetails.selectedItems.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${item.caterer} - ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}: ${item.name}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancelOrder}
                fullWidth
                style={{ marginTop: '10px' }}
              >
                Cancel Order
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditOrder}
                fullWidth
                style={{ marginTop: '10px' }}
              >
                Edit Order
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToOrder}
                fullWidth
                style={{ marginTop: '10px' }}
              >
                Add Items to Order
              </Button>
            </Paper>
          </Grid>
        )}
        {Object.entries(menu).map(([caterer, categories]) => (
          <Grid item xs={12} md={6} key={caterer}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>
                {caterer}
              </Typography>
              {Object.entries(categories).map(([category, items]) => (
                <div key={category}>
                  <CategoryTitle variant="subtitle1" gutterBottom>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {category === 'entrees' && <RestaurantIcon style={{ marginLeft: '8px' }} />}
                    {category === 'starches' && <GrainIcon style={{ marginLeft: '8px' }} />}
                    {category === 'sides' && <LocalDiningIcon style={{ marginLeft: '8px' }} />}
                    {category === 'desserts' && <CakeIcon style={{ marginLeft: '8px' }} />}
                  </CategoryTitle>
                  <List>
                    {items.map((item, index) => (
                      <div key={index}>
                        <SelectedListItem
                          button // Ensure this is a boolean
                          onClick={() => handleItemClick(item, category, caterer)}
                          selected={selectedItems[caterer][category]?.name === item.name}
                        >
                          <ListItemText primary={item.name} />
                        </SelectedListItem>
                        {index !== items.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </div>
              ))}
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Place Order
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default Dashboard;

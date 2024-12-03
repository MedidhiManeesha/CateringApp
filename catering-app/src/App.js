

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDetailsForm from './components/CustomerDetailsForm'; 
import MenuTabs from './components/MenuTabs'; 


function App() {
  const [customerDetails, setCustomerDetails] = useState({});

  return (
    <Router>
      <Routes>
       
        <Route path="/"
          element={<CustomerDetailsForm setCustomerDetails={setCustomerDetails} />}
        />

        <Route
          path="/home"
          element={<MenuTabs customerDetails={customerDetails} />} 
        />
        
      </Routes>
      
    </Router>
  );
}

export default App;
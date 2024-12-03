
import React, { useState, useEffect } from "react";
import restaurantLogo from '../imgs/Casserole-logo.png'
import { Container, Tab, Tabs, Box, Grid, Card, Typography, FormControlLabel, Checkbox, Button, TextField ,Dialog, DialogTitle, DialogContent, DialogActions,IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { jsPDF } from "jspdf"; 
import emailjs from 'emailjs-com';
import menus from "../data/menus.json"; 
import standardBackground from '../imgs/standard-bg.jpg'; 
import premiumBackground from '../imgs/premium-bg.jpg';
import crown from '../imgs/crown.png'
import "jspdf-autotable";

export default function MenuTabs({ customerDetails }) {
  useEffect(() => {
    console.log("Customer Details Updated:", customerDetails);
  }, [customerDetails]);

  const [value, setValue] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});
  const [inputText, setInputText] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleCheckboxChange = (menuType, category, item) => {
    setSelectedItems((prev) => {
      const menu = { ...prev[menuType] };
      const categoryItems = menu[category] || [];
      const updatedItems = categoryItems.includes(item)
        ? categoryItems.filter((i) => i !== item)
        : [...categoryItems, item];
      
      return {
        ...prev,
        [menuType]: { ...menu, [category]: updatedItems },
      };
    });
  };

  // Handling input field changes for each category
  const handleInputChange = (menuType, category, item, value) => {
    setInputText((prev) => {
      const menu = { ...prev[menuType] };
      return {
        ...prev,
        [menuType]: {
          ...menu,
          [category]: value, 
        },
      };
    });
  };
  
  const generatePDF = () => {
    if (!selectedItems || Object.keys(selectedItems).length === 0) {
      alert("No items selected to generate a PDF.");
      return;
    }
  
    if (!customerDetails || Object.keys(customerDetails).length === 0) {
      alert("Customer details are missing or incomplete. Please check your input.");
      console.error("Empty or invalid customerDetails:", customerDetails);
      return;
    }
  
    const name = typeof customerDetails.customerName === "string" ? customerDetails.customerName : "Unknown";
    const contact = typeof customerDetails.customerContact === "string" ? customerDetails.customerContact : "0000";
    const firstName = name.split(" ")[0] || "Unknown"; 
    const contactLast4 = contact.slice(-4); 
    const fileName = `${firstName}_${contactLast4}_OrderSummary.pdf`;
  
    const doc = new jsPDF();
    const tableData = [];

    // Prepare data for the PDF, including both checkbox items and text input values
    Object.keys(selectedItems).forEach((menuType) => {
      const menu = selectedItems[menuType];
      Object.keys(menu).forEach((category) => {
        const inputDetail = menu[category]; 
        const items = menu[category]?.items || [];
        
        // Add items to the PDF table
        items.forEach((item) => {
          const input = inputText[menuType]?.[category]?.[item] || ""; 
          tableData.push([item, input]); 
        });
      });
    });
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Customer Order Summary", 10, 10);
  
    // Customer Details as a Table
    const customerDetailsTable = Object.entries(customerDetails).map(([key, value]) => [
      formatLabel(key),
      value || "N/A",
    ]);
    
    doc.autoTable({
      startY: 20,
      head: [["Label", "Details"]],
      body: customerDetailsTable,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      bodyStyles: { fontSize: 10 },
    });
  
    let yPosition = doc.lastAutoTable.finalY + 10;
  
    // Selected Items
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Selected Items", 10, yPosition);
    yPosition += 10;
  
    Object.entries(selectedItems).forEach(([menuType, categories]) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(menuType, 10, yPosition);
      yPosition += 8;
  
      Object.entries(categories || {}).forEach(([category, items]) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`- ${category}:`, 15, yPosition);
        yPosition += 6;
  
        items.forEach((item) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.text(`  * ${item}`, 20, yPosition);
          yPosition += 6;

          const input = inputText[menuType]?.[category]?.[item] || "";
          if (input) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.text(`    Input: ${input}`, 25, yPosition);
            yPosition += 6;
          }

          if (yPosition > 280) {
            doc.addPage();
            yPosition = 10;
          }
        });
        yPosition += 4; 
      });
  
      yPosition += 10; 
    });
  
    // Save the PDF
    doc.save(fileName);
  };
  
  // function to format labels
  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1") 
      .replace(/^./, (str) => str.toUpperCase()) 
      .replace("No", "No."); 
  };

const renderMenu = (menuType, menuData) => (
  <Grid container spacing={2}>
    {menuData.map((category, index) => (
      <Grid item xs={12} sm={6} key={index}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {category.label}
          </Typography>

          {category.items.map((item, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      selectedItems[menuType]?.[category.label]?.includes(item) || false
                    }
                    onChange={() => handleCheckboxChange(menuType, category.label, item)}
                  />
                }
                label={item}
              />
            </Box>
          ))}

          {/* Single Input Field for the Entire Category */}
          <TextField
            label="Other Items"
            variant="outlined"
            size="small"
            value={inputText[menuType]?.[category.label] || ""}
            onChange={(e) =>
              handleInputChange(menuType, category.label, null, e.target.value)
            }
            sx={{ mt: 2 }}
          />
        </Card>
      </Grid>
    ))}
  </Grid>
);

const sendEmail = () => {
  setIsLoading(true);
  
  if (!customerDetails || !selectedItems) {
    console.error("Missing customer details or selected items.");
    setIsLoading(false);
    return;
  }

  const templateParams = {
    customer_name: customerDetails.customerName || "N/A", 
    customer_phone: customerDetails.customerContact || "N/A", 
    selected_items: JSON.stringify(selectedItems) || "[]",
    additional_details: "Additional information here",
  };

  console.log("Template Params:", templateParams); 

  emailjs.init("Av2TXOjQjCbl0DDWw");

  emailjs
    .send("service_og0ohsb", "template_xbavx43", templateParams)
    .then((response) => {
      alert("Email sent successfully.");
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Failed to send email", error.text);
      alert("Failed to send email: " + error.text);
      setIsLoading(false);
    });
};

  const openModal = () => {
    if (!Object.keys(selectedItems).length) {
      alert("No items selected for preview.");
      return;
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
};


return (
  <>
    <div
      style={{
        backgroundImage: `url(${value === 0 ? standardBackground : premiumBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh", 
        
      }}
    >
      {/* Casserole logo */}
      {/* <div
          style={{
            position: "fixed", 
            top: "20px",
            left: "20px", 
            width: "150px",
            height: "100px", 
            overflow: "hidden", 
            border: "5px solid #fff",
          }}
        >  
        <img
        src={restaurantLogo} 
        alt="Restaurant Logo"
        style={{
          width: "100%", 
          height: "100%",
          objectFit: "cover", 
        }}
      />
      </div> */}
      {/* <div
  style={{
    position: "fixed", 
    top: "0", // Position at the top of the screen
    left: "0", // Position at the left of the screen
    width: "150px",
    height: "100px", 
    overflow: "hidden", 
    border: "5px solid #fff",
    zIndex: 1000, // Ensures it stays on top of other content
  }}
>  
  <img
    src={restaurantLogo} 
    alt="Restaurant Logo"
    style={{
      width: "150px", 
      height: "100px",
      objectFit: "cover", 
    }}
  />
</div> */}


     
      <Container maxWidth="md">
        <Box
          sx={{
            position: "fixed", 
            top: 0,
            left: "50%", 
            transform: "translateX(-50%)", 
            width: "400px",
            height: "auto",
            backgroundColor: "white", 
            zIndex: 1000, 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: 3, 
            mb: 2,
            mt:3
          }}
        >
          <Tabs
            value={value}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="menu tabs"
          >
           {/* Tabs for Standard and Premium tabs */}

            <Tab
              label={
                <Typography
                
                >
                  Standard Menu
                </Typography>
              }
            />
            <Tab
              label={
                <Box sx={{ position: "relative" }}>
                  <Typography
                   
                    sx={{
                      color: "gold", 
                    }}
                  >
                    Premium Menu
                  </Typography>
                  <img
                    src={crown} 
                    alt="Crown Icon"
                    style={{
                      position: "absolute",
                      top: "-6px", 
                      right: "-8px", 
                      width: "20px", 
                      height: "20px", 
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Tab Panel to show items of Standard Menu */}
        <TabPanel value={value} index={0}>
          <Container sx={{mt:10}}>{renderMenu("standard", menus.standardMenu)}</Container>
        </TabPanel>

        {/* Tab Panel for Premium Menu */}
        <TabPanel value={value} index={1}>
          <Container sx={{mt:10}}>{renderMenu("premium", menus.premiumMenu)}</Container>
        </TabPanel>

        {/* Button to Generate PDF */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            onClick={openModal}
            
          >
            Submit
          </Button>
        </Box>
        
           {/* Modal for PDF Preview */}
      
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
  <DialogTitle>
    PDF Preview
    <IconButton
      aria-label="close"
      onClick={closeModal}
      sx={{ position: "absolute", right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Customer Details
    </Typography>
    
    {Object.entries(customerDetails).map(([key, value]) => {
  const formattedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2') 
                           .replace(/^./, str => str.toUpperCase()); 
    return (
      <Typography key={key}>
        <strong>{formattedKey}:</strong> {value}
      </Typography>
    );
  })}


    <Typography variant="h6" sx={{ mb: 2 }}>
      Your Selected Items are listed below
    </Typography>
    {Object.entries(selectedItems).map(([menuType, categories], index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, textTransform: "uppercase" }}>
          {menuType}
        </Typography>
        {Object.entries(categories || {}).map(([category, items], idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {category}
            </Typography>

            {/* Show selected items in the category */}
            {items.map((item) => (
              <Box key={item}>
                <Typography variant="body1">{item}</Typography>
              </Box>
            ))}

            {/* Show input text for the entire category */}
            {inputText[menuType]?.[category] && (
              <Typography variant="body2" sx={{ fontStyle: "italic", mt: 1 }}>
                Other: {inputText[menuType][category]}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    ))}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => generatePDF()} variant="contained" color="success">
      Download
    </Button>
    <Button onClick={sendEmail} variant="contained" color="primary">
      Proceed
    </Button>
  </DialogActions>
      </Dialog>

      </Container>
    </div>
  </>
);
}


function TabPanel({ value, index, children }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}



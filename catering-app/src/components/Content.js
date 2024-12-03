
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';


import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// const items = [
//   {
//     icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
//     title: 'Billing Terms',
//     description:
//       'We will charge guaranteed actual guests whichever is higher.',
//   },
//   {
//     icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
//     title: 'Advance Payment Policy',
//     description:
//       '50% advance should be paid at the time of confirmation.',
//   },
//   {
//     icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
//     title: 'Liability Disclaimer',
//     description:
//       'Advance once paid shall not be refunded.',
//   },
//   {
//     icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
//     title: 'Decoration Policy',
//     description:
//       'Management is not responsible for their valuables & belongings.',
//   },
//   {
//     icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
//     title: 'Menu Submission Deadline',
//     description:
//       'Outside flower decorators are not allowed, Menu to be given 3 days before the function.',
//   },
//   {
//     icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
//     title: 'Discount Policy',
//     description:
//       'No discounts allowed after making the confirmation.',
//   },
//   {
//     icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
//     title: 'Food Provision',
//     description:
//       'The rest of the food will not be provided.',
//   },
// ];

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Billing Terms',
    description: 'We will charge guaranteed actual guests whichever is higher.',
  },
  {
    icon: <AttachMoneyIcon sx={{ color: 'text.secondary' }} />,
    title: 'Advance Payment Policy',
    description: '50% advance should be paid at the time of confirmation.',
  },
  {
    icon: <WarningAmberIcon sx={{ color: 'text.secondary' }} />,
    title: 'Liability Disclaimer',
    description: 'Advance once paid shall not be refunded.',
  },
  {
    icon: <DesignServicesIcon sx={{ color: 'text.secondary' }} />,
    title: 'Decoration Policy',
    description: 'Management is not responsible for their valuables & belongings.',
  },
  {
    icon: <CalendarTodayIcon sx={{ color: 'text.secondary' }} />,
    title: 'Menu Submission Deadline',
    description: 'Outside flower decorators are not allowed, Menu to be given 3 days before the function.',
  },
  {
    icon: <LocalOfferIcon sx={{ color: 'text.secondary' }} />,
    title: 'Discount Policy',
    description: 'No discounts allowed after making the confirmation.',
  },
  {
    icon: <RestaurantIcon sx={{ color: 'text.secondary' }} />,
    title: 'Food Provision',
    description: 'The rest of the food will not be provided.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: 'column',
        alignSelf: 'center',
        gap: 4,
        maxWidth: 450,
        px: 2, 
      }}
    >
      {/* Title */}
      <Box sx={{ display: { xs: 'block', md: 'flex' }, justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Terms and Conditions
        </Typography>
      </Box>

      {/* List of Terms */}
      {items.map((item, index) => (
        <Stack
          key={index}
          direction="row"
          sx={{ gap: 2, alignItems: 'flex-start' }}
        >
          {item.icon}
          <div>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 'medium',
                fontSize: { xs: 'body1', sm: 'h6' }, // Adjust font size for responsiveness
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontSize: { xs: 'body2', sm: 'body1' } }} // Ensure text is readable on smaller screens
            >
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}


import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';


export default function MyComponent() {
  

  return (
     <div className="container-fluid mt-20px mx-auto">
    <AppBar position="static">
       
      <Toolbar>
        
       <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center" }}>
  QuickNote
</Typography>
        
      </Toolbar>
     
    </AppBar>
     </div>
  );
}

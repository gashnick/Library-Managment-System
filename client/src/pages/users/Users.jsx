import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { fetchUsers } from '../book/apiService';

export default function Users() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetchUsers();
        if (response.success && response.users) {
          setUsers(response.users);
        } else {
          console.error('Invalid data structure:', response);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsersData();
  }, []);

  const handleAddUser = () => {
    // Add user logic here
    console.log('Add user clicked');
  };

  const handleEditUser = (userId) => {
    // Edit user logic here
    console.log('Edit user clicked for ID:', userId);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Make DELETE request to the backend
      const response = await fetch(`api/user/users/${userId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Handle success, maybe update the UI to reflect the deleted user
        console.log('User deleted successfully');
      } else {
        // Handle error, display a message to the user
        console.error('Failed to delete the user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  // Example button to trigger the delete action
  <button onClick={() => handleDeleteUser(userId)}>Delete User</button>
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Action Buttons Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddUser}
          >
            Add User
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => handleEditUser(null)}
          >
            Edit User
          </Button>
        </Stack>
      </Paper>

      {/* Table Section */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.username}
                    </TableCell>
                    <TableCell align="right">{user.email}</TableCell>
                    <TableCell align="right">{user.role}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleEditUser(user._id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
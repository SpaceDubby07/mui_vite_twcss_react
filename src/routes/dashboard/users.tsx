import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, FormEvent } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AddUserProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isEditing: boolean;
  selectedUser: User | null;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AddUser: React.FC<AddUserProps> = ({
  setUsers,
  isEditing,
  selectedUser,
  setIsEditing,
  setSelectedUser,
}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [selectedUser]);

  // This function will handle submitting a new user
  // or editing an existing user
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && selectedUser) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${selectedUser.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
          }
        );
        if (response.ok) {
          setUsers((prevState) =>
            prevState.map((user) =>
              user.id === selectedUser.id
                ? { ...user, name, email }
                : user
            )
          );
          setIsEditing(false);
          setSelectedUser(null);
          setName('');
          setEmail('');
        } else {
          alert('Error updating user');
        }
      } catch (error) {
        console.error('Failed to update user', error);
      }
    } else {
      try {
        const response = await fetch(
          'http://localhost:3001/api/users',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert(`User added with ID: ${data.id}`);
          setUsers((prevState) => [
            ...prevState,
            { id: data.id, name, email },
          ]);
          setName('');
          setEmail('');
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Failed to add user', error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          margin="normal"
          variant="outlined"
          sx={{
            width: { xs: '100%', lg: '40%' },
            m: { xs: 1, lg: 2 },
          }}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
          variant="outlined"
          sx={{
            width: { xs: '100%', lg: '40%' },
            m: { xs: 1, lg: 2 },
          }}
        />
      </Box>
      <Button sx={{ m: 2 }} variant="contained" type="submit">
        {isEditing ? 'Save' : 'Add User'}
      </Button>
      {isEditing && (
        <Button
          sx={{ m: 2 }}
          variant="outlined"
          onClick={() => {
            setIsEditing(false);
            setSelectedUser(null);
            setName('');
            setEmail('');
          }}
        >
          Cancel
        </Button>
      )}
    </form>
  );
};

interface UserTableProps {
  users: User[];
  deleteUser: (id: number) => Promise<void>;
  editUser: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  deleteUser,
  editUser,
}) => (
  <Box sx={{ mt: 2 }}>
    <Typography variant="h4">Users</Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => editUser(user)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => deleteUser(user.id)}
                  color="error"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export const Route = createFileRoute('/dashboard/users')({
  component: function UsersRoute() {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(
      null
    );

    useEffect(() => {
      const getUsers = async () => {
        try {
          const response = await fetch(
            'http://localhost:3001/api/users'
          );
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Failed to fetch users', error);
        }
      };

      getUsers();
    }, []);

    const deleteUser = async (id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${id}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    };

    const editUser = (user: User) => {
      setSelectedUser(user);
      setIsEditing(true);
    };

    return (
      <div>
        <AddUser
          setUsers={setUsers}
          isEditing={isEditing}
          selectedUser={selectedUser}
          setIsEditing={setIsEditing}
          setSelectedUser={setSelectedUser}
        />
        <UserTable
          users={users}
          deleteUser={deleteUser}
          editUser={editUser}
        />
      </div>
    );
  },
});

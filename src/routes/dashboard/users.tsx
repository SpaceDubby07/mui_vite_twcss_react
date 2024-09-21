import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { User } from '../../types';
import { AddUser } from '../../components/dashboard/forms/AddUser';
import { UserTable } from '../../components/dashboard/tables/UserTable';

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

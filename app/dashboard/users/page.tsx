'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  bookings: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  useEffect(() => {
    const mockData: User[] = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        joinDate: 'Dec 14, 2024',
        bookings: 3,
        totalSpent: 2650,
        status: 'Active',
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 987-6543',
        joinDate: 'Nov 19, 2024',
        bookings: 1,
        totalSpent: 440,
        status: 'Active',
      },
      {
        id: 3,
        name: 'Michael Brown',
        email: 'm.brown@example.com',
        phone: '+1 (555) 456-7890',
        joinDate: 'Jan 04, 2025',
        bookings: 1,
        totalSpent: 3400,
        status: 'Active',
      },
      {
        id: 4,
        name: 'Jennifer Adams',
        email: 'j.adams@example.com',
        phone: '+1 (555) 234-5678',
        joinDate: 'Dec 27, 2024',
        bookings: 2,
        totalSpent: 4750,
        status: 'Active',
      },
      {
        id: 5,
        name: 'David Wilson',
        email: 'd.wilson@example.com',
        phone: '+1 (555) 876-5432',
        joinDate: 'Jan 14, 2025',
        bookings: 1,
        totalSpent: 1200,
        status: 'Inactive',
      },
    ];

    setUsers(mockData);
  }, []);

  const filteredUsers =
    filter === 'All' ? users : users.filter((u) => u.status === filter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Registered Users</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="w-full md:w-1/2 border px-4 py-2 rounded-md"
        />
        <div className="flex gap-2">
          {['All', 'Active', 'Inactive'].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value as 'All' | 'Active' | 'Inactive')}
              className={`px-4 py-2 rounded-md border ${
                filter === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border-blue-600'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left font-semibold">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Join Date</th>
              <th className="px-4 py-2">Bookings</th>
              <th className="px-4 py-2">Total Spent</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 font-medium">#{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">
                  <div>{user.email}</div>
                  <div className="text-xs text-gray-500">{user.phone}</div>
                </td>
                <td className="px-4 py-2">{user.joinDate}</td>
                <td className="px-4 py-2">{user.bookings}</td>
                <td className="px-4 py-2">${user.totalSpent}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-50">
                    View
                  </button>
                  <button className="px-3 py-1 border rounded text-green-600 hover:bg-green-50">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
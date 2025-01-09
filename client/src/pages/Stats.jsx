import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Book, BookOpen, Users, Library } from 'lucide-react';
import axios from 'axios';

const Stats = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    BorrowedBooks: 0,
    totalUsers: 0,
    availableBooks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraryStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/book/stats'); // Adjust endpoint as needed
        if (response?.data) {
          setStats(response.data);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err) {
        console.error('Error fetching library stats:', err);
        setError('Unable to fetch library stats');
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryStats();
  }, []);

  const statCards = [
    {
      title: 'Total Books',
      value: stats?.totalBooks?.toLocaleString() || '0',
      icon: Library,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Borrowed Books',
      value: stats?.BorrowedBooks?.toLocaleString() || '0',
      icon: BookOpen,
      color: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: 'Available Books',
      value: stats?.availableBooks?.toLocaleString() || '0',
      icon: Book,
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      icon: Users,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="flex-1 min-w-[240px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-semibold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Stats;

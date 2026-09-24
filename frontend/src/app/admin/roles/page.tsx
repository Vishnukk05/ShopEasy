"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: { permission: Permission }[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        api.get('/rbac/roles'),
        api.get('/rbac/permissions')
      ]);
      setRoles(rolesRes.data);
      setPermissions(permsRes.data);
    } catch (error) {
      console.error("Failed to fetch RBAC data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/rbac/roles', {
        name: newRoleName,
        description: newRoleDesc,
        permissionIds: selectedPerms
      });
      setNewRoleName('');
      setNewRoleDesc('');
      setSelectedPerms([]);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to create role", error);
      alert("Error creating role");
    }
  };

  const togglePermission = (id: string) => {
    setSelectedPerms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const seedPermissions = async () => {
    try {
      await api.post('/rbac/permissions/seed');
      fetchData();
    } catch (error) {
      alert("Failed to seed permissions");
    }
  };

  if (loading) return <div className="p-8">Loading roles...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Role & Permissions Management</h1>
        <button 
          onClick={seedPermissions} 
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
        >
          Seed Default Permissions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Role Form */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Create New Role</h2>
          <form onSubmit={handleCreateRole} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role Name</label>
              <input 
                type="text" 
                required 
                value={newRoleName} 
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="e.g. PRODUCT_MANAGER"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input 
                type="text" 
                value={newRoleDesc} 
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Short description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Assign Permissions</label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded bg-gray-50">
                {permissions.length === 0 ? (
                  <p className="text-sm text-gray-500 col-span-2">No permissions found. Seed them first.</p>
                ) : (
                  permissions.map(p => (
                    <label key={p.id} className="flex items-center space-x-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedPerms.includes(p.id)}
                        onChange={() => togglePermission(p.id)}
                      />
                      <span>{p.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Create Role
            </button>
          </form>
        </div>

        {/* Existing Roles List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Roles</h2>
          <div className="space-y-4">
            {roles.length === 0 ? (
              <p className="text-gray-500">No roles defined yet.</p>
            ) : (
              roles.map(role => (
                <div key={role.id} className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="font-bold text-lg">{role.name}</h3>
                  {role.description && <p className="text-sm text-gray-600 mb-2">{role.description}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {role.permissions.map(rp => (
                      <span key={rp.permission.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {rp.permission.name}
                      </span>
                    ))}
                    {role.permissions.length === 0 && (
                      <span className="text-xs text-gray-400">No permissions assigned</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

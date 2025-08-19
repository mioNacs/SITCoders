import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaBan } from 'react-icons/fa';
import { removeSuspension, getSuspendedUsers } from '../../services/adminApi';

const SuspendedUsers = ({ showDialog, adminStatus, onCountChange, onUpdateUserSuspension }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [removing, setRemoving] = useState(null); // email

  const extractUsers = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === 'object') {
      for (const key of ['users', 'suspendedUsers', 'suspended', 'accounts', 'suspendedAccounts', 'data', 'result', 'results', 'list']) {
        const val = payload[key];
        if (Array.isArray(val)) return val;
      }
    }
    return [];
  };

  const load = async () => {
    try {
      setLoading(true);
      const data = await getSuspendedUsers();
      setUsers(extractUsers(data));
      if (typeof onCountChange === 'function') onCountChange(extractUsers(data).length);
    } catch (e) {
      console.error('Error fetching suspended users', e);
      showDialog('Error', e.message || 'Failed to fetch suspended users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (email) => {
    try {
      setRemoving(email);
  await removeSuspension(email);
      showDialog('Success', 'Suspension removed successfully', 'success');
      if (typeof onUpdateUserSuspension === 'function') {
        onUpdateUserSuspension(email, false);
      }
      await load();
    } catch (e) {
      console.error('Error removing suspension', e);
      showDialog('Error', e.message || 'Failed to remove suspension', 'error');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Suspended Users</h2>
        <div className="bg-red-50 px-3 py-2 rounded-lg text-red-700 font-semibold text-sm md:text-base">
          {users.length} {users.length === 1 ? 'User' : 'Users'}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-orange-500 mx-auto mb-4" size={32} />
          <p className="text-gray-600">Loading suspended users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaBan className="text-gray-400" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Suspended Users</h3>
          <p className="text-gray-600">All clear! No users are suspended right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(Array.isArray(users) ? users : []).map((u) => (
            <div key={u._id || u.email} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <Link 
                  to={`/profile/${u.username}`}
                  className="block hover:opacity-80 transition-opacity"
                >
                  <img
                    src={u.profilePicture?.url || u.profile || 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link 
                      to={`/profile/${u.username}`}
                      className="font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                    >
                      {u.fullName}
                    </Link>
                    <Link 
                      to={`/profile/${u.username}`}
                      className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                      @{u.username}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 break-all">{u.email}</div>
                  {u.suspensionEnd ? (
                    <div className="text-xs text-orange-500 mt-1">Suspended until {new Date(u.suspensionEnd).toLocaleString()}</div>
                  ) : (
                    <div className="text-xs text-orange-500 mt-1">Suspended permanently</div>
                  )}
                  {u.suspensionReason && (
                    <div className="text-xs text-gray-500 mt-1">Reason: {u.suspensionReason}</div>
                  )}
                </div>
                {adminStatus?.isAdmin && (
                  <button
                    onClick={() => handleRemove(u.email)}
                    disabled={removing === u.email}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs disabled:opacity-50"
                  >
                    {removing === u.email && <FaSpinner className="animate-spin" size={14} />}
                    <span>Remove Suspension</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuspendedUsers;

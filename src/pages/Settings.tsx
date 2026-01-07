import { useState } from 'react';
import {  Lock } from 'lucide-react';
import { theme } from '../theme';
import { useAxios } from '../hooks/useAxios';
import { showConfirm, showError, showToast } from '../utils/sweetAlert';

export default function Settings() {

  const {  put } = useAxios()

  const [formFields, setFormFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const changePasword = (e: any) => {
    const { name, value } = e.target
    console.log(name, value)
    setFormFields({
      ...formFields,
      [name]: value
    })

  }

  const changePaswordfn = async () => {
    if (formFields.confirmPassword !== formFields.newPassword) {
      return showError('New password and confirm password must be same')
    }
    try {
      const result = await showConfirm(
        'Are you sure you want to change password?',
        'This action cannot be undone.',
        'Yes, change it!'
      )
      if (result.isConfirmed) {

        const res = await put('/admin/auth/changePassword', {
          currentPassword: formFields.currentPassword,
          newPassword: formFields.newPassword,
          confirmPassword: formFields.confirmPassword
        })
        if (res.success) {
          showToast('success', 'Password changed successfully')
          setFormFields({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          })
        }
        console.log(res)
      }
    } catch (error) {
      const err = error || ""
      showToast('error', err )
      console.log(error)


    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: theme.gradients.dark }}
            >
              <Lock size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Security</h2>
              <p className="text-sm text-gray-600">Manage security settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Current Password
              </label>
              <input
                name='currentPassword'
                value={formFields.currentPassword}
                onChange={changePasword}

                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                New Password
              </label>
              <input
                name='newPassword'
                value={formFields.newPassword}
                onChange={changePasword}

                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirm New Password
              </label>
              <input
                name='confirmPassword'
                value={formFields.confirmPassword}
                onChange={changePasword}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
                placeholder="Enter new password"
              />
            </div>
            <button
              onClick={changePaswordfn}
              className="w-full px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              style={{ background: theme.gradients.dark }}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: theme.gradients.primary }}
            >
              <Globe size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Preferences</h2>
              <p className="text-sm text-gray-600">General application settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Language
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Timezone
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-6 (Central Time)</option>
                <option>UTC-7 (Mountain Time)</option>
                <option>UTC-8 (Pacific Time)</option>
              </select>
            </div>
          </div>
        </div> */}
      </div>
      {/* 
      <div className="flex justify-end">
        <button
         
          className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
          style={{ background: theme.gradients.primary }}
        >
          <Save size={20} />
          Change Password
        </button>
      </div> */}
    </div>
  );
}

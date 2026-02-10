"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HiOutlineUser, HiOutlineMail, HiOutlineTag, HiOutlinePencil } from "react-icons/hi";

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
      });
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile" });
    }
    setSaving(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-ghost btn-sm gap-2"
              >
                <HiOutlinePencil className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {}
            {message.text && (
              <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-4`}>
                <span>{message.text}</span>
              </div>
            )}

            {}
            <div className="flex justify-center mb-6">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24 border-4 border-primary/20">
                  <span className="text-3xl">{(user.name || user.email)?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-4">
              {}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <HiOutlineUser className="w-4 h-4" /> Display Name
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your display name"
                  />
                ) : (
                  <p className="py-2 px-3 bg-base-200 rounded-lg">{user.name || "Not set"}</p>
                )}
              </div>

              {}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <HiOutlineMail className="w-4 h-4" /> Email
                  </span>
                </label>
                <p className="py-2 px-3 bg-base-200 rounded-lg text-opacity-70">{user.email}</p>
                <label className="label">
                  <span className="label-text-alt opacity-50">Email cannot be changed</span>
                </label>
              </div>

              {}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <HiOutlineTag className="w-4 h-4" /> Role
                  </span>
                </label>
                <div className="py-2 px-3 bg-base-200 rounded-lg">
                  <span className="badge badge-primary">{user.role}</span>
                </div>
              </div>

              {}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Bio</span>
                </label>
                {isEditing ? (
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="py-2 px-3 bg-base-200 rounded-lg min-h-[60px]">
                    {user.bio || "No bio yet"}
                  </p>
                )}
              </div>

              {}
              {isEditing && (
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setIsEditing(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className={`btn btn-primary ${saving ? "loading" : ""}`}
                    disabled={saving}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

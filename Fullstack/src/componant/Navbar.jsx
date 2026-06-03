import React from "react";
import "./Navbar.css";

import {
  StickyNote,
  Plus,
  FileText,
  Pin,
  Trash2,
  Tag,
  User,
  Briefcase,
  Lightbulb,
} from "lucide-react";

const Navbar = () => {
  return (
    <div className="sidebar">
      <div className="logo-section">
        <StickyNote size={30} />
        <h1>NoteSpace</h1>
      </div>

      <button className="add-btn">
        <Plus size={18} />
        Add New Note
      </button>

      <div className="menu-section">
        <h3 className="section-title">MENU</h3>

        <div className="menu-item active">
          <FileText size={18} />
          <span>All Notes</span>
        </div>

        <div className="menu-item">
          <Pin size={18} />
          <span>Pinned</span>
        </div>

        <div className="menu-item">
          <Trash2 size={18} />
          <span>Trash</span>
        </div>
      </div>

      <div className="menu-section">
        <h3 className="section-title">
          <Tag size={16} />
          Tags
        </h3>

        <div className="menu-item">
          <User size={18} />
          <span>Personal</span>
        </div>

        <div className="menu-item">
          <Briefcase size={18} />
          <span>Work</span>
        </div>

        <div className="menu-item">
          <Lightbulb size={18} />
          <span>Ideas</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
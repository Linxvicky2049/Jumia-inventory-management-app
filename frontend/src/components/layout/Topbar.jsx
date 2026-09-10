import { Bell, Search } from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search products..."
        />
      </div>

      <div className="topbar-actions">
        <button className="icon-button">
          <Bell size={19} />
        </button>

        <div className="user-profile">
          <div className="avatar">VO</div>

          <div>
            <strong>Victor Okafor</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
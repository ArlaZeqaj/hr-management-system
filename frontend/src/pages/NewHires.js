import React, { useState } from "react";
import "../styles/NewHires.css";

const NewHires = (props) => {
  const [input1, onChangeInput1] = useState("");
  const [input2, onChangeInput2] = useState("");

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">HRCLOUDX</div>
        
        <div className="divider"></div>
        
        <nav className="nav-menu">
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/hmqpmay4_expires_30_days.png" 
            text="Dashboard" 
          />
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/z06o8o00_expires_30_days.png" 
            text="Profile" 
          />
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/rz3od6et_expires_30_days.png" 
            text="New Hires" 
          />
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/557voprd_expires_30_days.png" 
            text="Employees" 
          />
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/6yzmslw0_expires_30_days.png" 
            text="Billing" 
            active 
          />
        </nav>
        
        <div className="upgrade-card">
          <img 
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/c3gcj8eo_expires_30_days.png" 
            className="upgrade-icon"
            alt="Upgrade" 
          />
          <div className="upgrade-text">
            <div>Upgrade to PRO</div>
            <small>to get access to all features!</small>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="breadcrumbs">
            <span>Pages / Billing</span>
            <h1>Billing</h1>
          </div>
          
          <div className="user-profile">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2bb4edd4-293b-43c8-b39f-493a2edb1d91" alt="User" />
            <span>Doe, Jane</span>
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/082c3bf8-01b8-4766-8555-99763cf21464" alt="Dropdown" />
          </div>
        </header>

        {/* New Hires Content */}
        <div className="contain">
          <div className="column">
            <span className="text">New Hires</span>
            
            {/* Filters Row */}
            <div className="row-view">
              <div className="filter-group">
                <span className="filter-label">Status:</span>
                <select className="filter-select">
                  <option>All</option>
                  <option>Initial Review</option>
                  <option>Confirmed</option>
                  <option>Sent</option>
                </select>
              </div>
              <div className="filter-group">
                <span className="filter-label">Date Range:</span>
                <input type="date" className="filter-date" />
                <span className="filter-to">to</span>
                <input type="date" className="filter-date" />
              </div>
              <button className="filter-button">Apply Filters</button>
              <button className="add-new-button">+ Add New</button>
            </div>
            
            {/* Table Header */}
            <div className="row-view8">
              <span className="text5">Status</span>
              <div className="row-view9">
                <span className="text6">Start Date</span>
                <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/5a850r8p_expires_30_days.png"} className="image6" />
              </div>
              <div className="row-view10">
                <span className="text7">End Date</span>
                <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/7n2eflgp_expires_30_days.png"} className="image6" />
              </div>
              <span className="text8">Nr</span>
              <span className="text9">Documents</span>
              <div className="row-view11">
                <span className="text7">Payment Date</span>
                <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/sdsc05j8_expires_30_days.png"} className="image6" />
              </div>
              <span className="text11">Download</span>
              <span className="text12">Edit</span>
              <span className="text13">Delete</span>
              <span className="text14">Details</span>
            </div>
            
            {/* Table Body */}
            <div className="row-view12">
              <div className="column2">
                <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/elj586qw_expires_30_days.png"} className="image7" />
                <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/wvx8aerg_expires_30_days.png"} className="image8" />
                <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/egd7gizm_expires_30_days.png"} className="image9" />
                <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/gy1jdyyr_expires_30_days.png"} className="image10" />
                <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/2kkmhpcy_expires_30_days.png"} className="image11" />
              </div>
              
              <div className="column3">
                {/* Row 1 */}
                <div className="row-view13">
                  <span className="text15">Initial Review</span>
                  <span className="text16">21-03-2022</span>
                  <span className="text17">23-03-2022</span>
                  <span className="text18">23</span>
                  <span className="text19">PROFORMA/7/03/2022</span>
                  <span className="text20">21-03-2022</span>
                  <button className="button" onClick={()=>alert("Pressed!")}>
                    <span className="text22">Download</span>
                  </button>
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/j7311clg_expires_30_days.png"} className="image12" />
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/5eu3u71p_expires_30_days.png"} className="image13" />
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/77mq9x9d_expires_30_days.png"} className="image14" />
                </div>

                {/* Row 2 */}
                <div className="row-view14">
                  <span className="text23">Confirmed</span>
                  <span className="text16">21-03-2022</span>
                  <span className="text24">22-03-2022</span>
                  <span className="text25">1595</span>
                  <span className="text26">PROFORMA/7/03/2022</span>
                  <span className="text27">21-03-2022</span>
                  <button className="button" onClick={()=>alert("Pressed!")}>
                    <span className="text22">Download</span>
                  </button>
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/j1r4x3e9_expires_30_days.png"} className="image12" />
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/87f06ebz_expires_30_days.png"} className="image13" />
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/enzd109c_expires_30_days.png"} className="image14" />
                </div>

                {/* Expanded Row Section */}
                <div className="column4">
                  <div className="column5">
                    <div className="row-view15">
                      <span className="text28">1</span>
                      <span className="text29">M5HybcidGLASSBacterio</span>
                      <span className="text30">TRANSPORT</span>
                      <span className="text31">2</span>
                    </div>
                    <div className="row-view16">
                      <span className="text34">2</span>
                      <span className="text35">Transport</span>
                      <span className="text36">TRANSPORT</span>
                      <span className="text37">1</span>
                    </div>
                    <div className="view">
                      <button className="button-row-view2" onClick={()=>alert("Pressed!")}>
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/bwptcc2n_expires_30_days.png"} className="image15" />
                        <span className="text40">View Proforma</span>
                      </button>
                    </div>
                  </div>
                  <div className="absolute-row-view">
                    <span className="text41">Confirmed</span>
                    <span className="text42">21-03-2022</span>
                    <span className="text43">22-03-2022</span>
                    <span className="text44">1594</span>
                    <span className="text45">PROFORMA/7/03/2022</span>
                    <span className="text46">21-03-2022</span>
                    <button className="button2" onClick={()=>alert("Pressed!")}>
                      <span className="text48">Download</span>
                    </button>
                    <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/0pvqt807_expires_30_days.png"} className="image12" />
                    <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/tmzj1vh3_expires_30_days.png"} className="image13" />
                    <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/t42bn76u_expires_30_days.png"} className="image16" />
                  </div>
                  <div className="absolute-row-view2">
                    <span className="text49">No.</span>
                    <span className="text50">Name</span>
                    <span className="text51">Code</span>
                    <span className="text52">Quantity</span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="row-view17">
                  <span className="text54">Sent</span>
                  <span className="text55">08-03-2022</span>
                  <span className="text56">09-03-2022</span>
                  <span className="text18">1593</span>
                  <span className="text19">PROFORMA/7/03/2022</span>
                  <span className="text27">21-03-2022</span>
                  <button className="button" onClick={()=>alert("Pressed!")}>
                    <span className="text22">Download</span>
                  </button>
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/367t8enn_expires_30_days.png"} className="image12" />
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/7ababkxk_expires_30_days.png"} className="image17" />
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/alte58ew_expires_30_days.png"} className="image14" />
                </div>

                {/* Row 4 */}
                <div className="row-view18">
                  <span className="text57">Sent</span>
                  <span className="text55">08-03-2022</span>
                  <span className="text58">10-03-2022</span>
                  <span className="text18">1592</span>
                  <span className="text19">PROFORMA/7/03/2022</span>
                  <span className="text27">21-03-2022</span>
                  <button className="button" onClick={()=>alert("Pressed!")}>
                    <span className="text22">Download</span>
                  </button>
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/n4stp6vr_expires_30_days.png"} className="image12" />
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/0104q3tv_expires_30_days.png"} className="image17" />
                  <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/rfakr7t9_expires_30_days.png"} className="image14" />
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="view2">
              <div className="pagination">
                <button className="pagination-button">
                  <img
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/7n2eflgp_expires_30_days.png"
                    className="pagination-icon"
                    alt="Previous"
                  />
                </button>
                <button className="pagination-button active">1</button>
                <button className="pagination-button">2</button>
                <button className="pagination-button">3</button>
                <span className="pagination-ellipsis">...</span>
                <button className="pagination-button">10</button>
                <button className="pagination-button">
                  <img
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/5a850r8p_expires_30_days.png"
                    className="pagination-icon"
                    alt="Next"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          © 2024 HRCloudX. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

// MenuItem component
const MenuItem = ({ icon, text, active = false }) => (
  <div className={`menu-item ${active ? 'active' : ''}`}>
    <img src={icon} alt={text} className="menu-icon" />
    <span className="menu-text">{text}</span>
    {active && <div className="active-indicator"></div>}
  </div>
);

export default NewHires;
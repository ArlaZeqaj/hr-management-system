import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import EmployeeHeader from "./Employee/EmployeeHeader";
import EmployeeFooter from "./Employee/EmployeeFooter";
import Documents from "../components/layout/Documents"


const DocumentsPage = () => {
 return <Documents/>
};
export default DocumentsPage;
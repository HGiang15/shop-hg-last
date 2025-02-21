import React from 'react'
import './LayoutGrid.module.scss'

function LayoutGrid({ children }) {
    return <div className="grid wide">{children}</div>;
}

export default LayoutGrid;

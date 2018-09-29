import React, { Component } from 'react';

export default function MainLayout({ children, location }) {
    return (
        <div className="boz-layout-content">
            {children}
        </div>
        // <div className="boz-layout">
        //     <div className="boz-layout-header">
        //     </div>
        //     <div className="boz-layout-body">
        //         <div className="boz-layout-sider">
        //         </div>
        //         <div className="boz-layout-content">
        //             {children}
        //         </div>
        //     </div>
        // </div>
    );
}
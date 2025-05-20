import React, {useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {AllCommunityModule, ModuleRegistry} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const App = () => {
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef();
    const ws = useRef(null);

    useEffect(() => {
        // 1. Fetch initial data
        fetch("http://localhost:8000/rows")
            .then(res => res.json())
            .then(data => {
                setRowData(data);
            })
            .catch(err => console.error("❌ Failed to load data:", err));

        // 2. Set up WebSocket
        ws.current = new WebSocket("ws://localhost:8000/ws");

        ws.current.onmessage = (event) => {
            const updated = JSON.parse(event.data);
            console.log("📥 WebSocket message:", updated);
            setRowData(prev =>
                prev.map(row => (row.id === updated.id ? updated : row))
            );
        };

        ws.current.onopen = () => console.log("🔌 WebSocket connected");
        ws.current.onerror = (error) => console.error("WebSocket error:", error);
        ws.current.onclose = () => console.log("❌ WebSocket closed");

        return () => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, []);


    const onCellValueChanged = async (params) => {
        await fetch("http://localhost:8000/rows", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(params.data),
        });
    };

    return (
        <div className="ag-theme-alpine" style={{height: 600}}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={[
                    {field: "name", editable: true, filter: true},
                    {field: "value", editable: true, filter: "agNumberColumnFilter"}
                ]}
                onCellValueChanged={onCellValueChanged}
            />
        </div>
    );
};

export default App;

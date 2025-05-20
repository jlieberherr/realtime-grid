import React, {useState, useEffect, useRef} from "react";
import {AgGridReact} from "ag-grid-react";
import {ModuleRegistry} from "ag-grid-community";
import {AllCommunityModule} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const App = () => {
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef();
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/ws");

        ws.current.onmessage = (event) => {
            const updated = JSON.parse(event.data);
            setRowData(prev =>
                prev.map(row => (row.id === updated.id ? updated : row))
            );
        };

        ws.current.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket closed");
        };

        // ✅ Cleanup only when the component is unmounted
        return () => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, []); // <-- only run once

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
                    {field: "name", editable: true},
                    {field: "value", editable: true}
                ]}
                onCellValueChanged={onCellValueChanged}
            />
        </div>
    );
};

export default App;
